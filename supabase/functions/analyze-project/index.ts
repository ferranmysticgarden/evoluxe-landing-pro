import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-PROJECT] ${step}${detailsStr}`);
};

// Sanitize error messages for client responses
const getSafeErrorMessage = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Log full error server-side for debugging
  logStep("ERROR", { message: errorMessage });
  
  // Map to safe client messages
  if (errorMessage.includes('not authenticated') || errorMessage.includes('Unauthorized')) {
    return 'Se requiere autenticación';
  }
  if (errorMessage.includes('not found') || errorMessage.includes('Project not found')) {
    return 'Proyecto no encontrado';
  }
  if (errorMessage.includes('Invalid URL')) {
    return 'URL inválida';
  }
  if (errorMessage.includes('subscription') || errorMessage.includes('Subscription required')) {
    return 'Se requiere una suscripción activa';
  }
  if (errorMessage.includes('Rate limit') || errorMessage.includes('Too many requests')) {
    return 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos';
  }
  if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
    return 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo';
  }
  
  // Generic safe message for unknown errors
  return 'Ha ocurrido un error. Por favor, inténtalo de nuevo';
};

const MAX_URL_LENGTH = 2048;
const FETCH_TIMEOUT_MS = 30000; // 30 second timeout
const RATE_LIMIT_WINDOW_MS = 300000; // 5 minutes
const MAX_ANALYSES_PER_WINDOW = 10;

const isLikelyIpv4 = (host: string) => /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);

const parseIpv4 = (host: string): number[] | null => {
  if (!isLikelyIpv4(host)) return null;
  const parts = host.split('.').map((p) => Number(p));
  if (parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return parts;
};

const isPrivateIpv4 = (parts: number[]) => {
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
};

const isBlockedHostname = (hostname: string) => {
  const host = hostname.toLowerCase();
  if (host === 'localhost') return true;
  if (host.endsWith('.local')) return true;
  if (host === '0.0.0.0') return true;
  if (host === '::1') return true;
  if (host.startsWith('fe80:')) return true;
  if (host.startsWith('fc') || host.startsWith('fd')) return true;
  return false;
};

const normalizeAndValidateUrlForFetch = (rawUrl: string) => {
  if (!rawUrl) throw new Error('Invalid URL');
  if (rawUrl.length > MAX_URL_LENGTH) throw new Error('Invalid URL');

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid URL');
  if (parsed.username || parsed.password) throw new Error('Invalid URL');
  if (isBlockedHostname(parsed.hostname)) throw new Error('Invalid URL');

  const ipv4 = parseIpv4(parsed.hostname);
  if (ipv4 && isPrivateIpv4(ipv4)) throw new Error('Invalid URL');

  return parsed.toString();
};

// Check subscription status server-side
const checkUserSubscription = async (userEmail: string): Promise<boolean> => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    logStep("STRIPE_SECRET_KEY not set, allowing access");
    return true; // Allow if Stripe not configured
  }

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    
    if (customers.data.length === 0) {
      return false;
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    return subscriptions.data.length > 0;
  } catch (error) {
    logStep("Error checking subscription", { error: String(error) });
    return false;
  }
};

// Simple rate limiting using project's last_analyzed_at
const checkRateLimit = async (
  supabaseClient: any, 
  userId: string, 
  projectId: string
): Promise<{ allowed: boolean; reason?: string }> => {
  try {
    // Check if project was analyzed too recently
    const { data: project, error } = await supabaseClient
      .from('projects')
      .select('last_analyzed_at')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error || !project) {
      return { allowed: false, reason: 'Project not found' };
    }

    if (project.last_analyzed_at) {
      const lastAnalyzed = new Date(project.last_analyzed_at).getTime();
      const now = Date.now();
      const timeSinceLastAnalysis = now - lastAnalyzed;
      
      // Minimum 1 minute between analyses for same project
      if (timeSinceLastAnalysis < 60000) {
        return { 
          allowed: false, 
          reason: 'Rate limit: Please wait at least 1 minute between analyses' 
        };
      }
    }

    // Check total analyses count in window
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabaseClient
      .from('seo_analyses')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('analyzed_at', windowStart);

    if (!countError && count !== null && count >= MAX_ANALYSES_PER_WINDOW) {
      return { 
        allowed: false, 
        reason: 'Too many requests. Please try again later' 
      };
    }

    return { allowed: true };
  } catch (error) {
    logStep("Rate limit check error", { error: String(error) });
    return { allowed: true }; // Allow on error to not block users
  }
};

// Fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { projectId } = await req.json();
    if (!projectId) throw new Error("Project ID is required");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    logStep("User authenticated", { userId: userData.user.id });

    // Check subscription server-side
    const hasSubscription = await checkUserSubscription(userData.user.email || '');
    if (!hasSubscription) {
      throw new Error("Subscription required");
    }
    logStep("Subscription verified");

    // Check rate limit
    const rateLimit = await checkRateLimit(supabaseClient, userData.user.id, projectId);
    if (!rateLimit.allowed) {
      throw new Error(rateLimit.reason || "Rate limit exceeded");
    }
    logStep("Rate limit check passed");

    // Get project
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userData.user.id)
      .single();

    if (projectError || !project) throw new Error("Project not found");

    const safeUrl = normalizeAndValidateUrlForFetch(project.url);
    logStep("Project found", { url: safeUrl });

    // Fetch webpage with timeout
    const startTime = Date.now();
    const response = await fetchWithTimeout(
      safeUrl, 
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)' } },
      FETCH_TIMEOUT_MS
    );

    if (!response.ok) throw new Error(`Failed to fetch page`);
    
    const html = await response.text();
    const loadTime = Date.now() - startTime;
    const pageSizeKb = new Blob([html]).size / 1024;
    
    logStep("Page fetched", { loadTime, pageSizeKb });

    // Extract SEO data
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || "";
    const metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    
    // Extract H1 tags
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
    const h1Tags = h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim());
    
    // Extract H2 count
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    
    // Canonical URL
    const canonicalUrl = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || "";
    
    // Robots meta
    const robotsMeta = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    
    // Images
    const imgMatches = html.match(/<img[^>]+>/gi) || [];
    const imagesTotal = imgMatches.length;
    const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']*["']/i.test(img)).length;
    const imagesWithoutAlt = imagesTotal - imagesWithAlt;
    
    // Links
    const internalLinks = (html.match(new RegExp(`<a[^>]*href=["'](?:${project.url}|/)[^"']*["']`, 'gi')) || []).length;
    const externalLinks = (html.match(/<a[^>]*href=["']https?:\/\/[^"']+["']/gi) || []).length - internalLinks;
    
    // Word count (approximate)
    const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                           .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ');
    const wordCount = textContent.trim().split(/\s+/).length;
    
    // Mobile friendly
    const hasViewportMeta = /<meta[^>]*name=["']viewport["']/i.test(html);
    const mobileFriendly = hasViewportMeta;
    
    // HTTPS
    const isHttps = project.url.startsWith('https://');
    
    // Schema markup
    const hasSchemaMarkup = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
    const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    const schemaTypes: string[] = [];
    schemaMatches.forEach(script => {
      try {
        const jsonStr = script.replace(/<[^>]+>/g, '');
        const json = JSON.parse(jsonStr);
        if (json['@type']) schemaTypes.push(json['@type']);
      } catch {}
    });
    
    // Open Graph
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    
    // Twitter Card
    const twitterCard = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
    
    // Calculate issues
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    if (!title) criticalIssues.push("Falta etiqueta <title>");
    else if (title.length < 30) warnings.push("Título muy corto (< 30 caracteres)");
    else if (title.length > 60) warnings.push("Título muy largo (> 60 caracteres)");
    
    if (!metaDescription) criticalIssues.push("Falta meta description");
    else if (metaDescription.length < 120) warnings.push("Meta description muy corta");
    else if (metaDescription.length > 160) warnings.push("Meta description muy larga");
    
    if (h1Tags.length === 0) criticalIssues.push("Falta etiqueta H1");
    if (h1Tags.length > 1) warnings.push(`Múltiples H1 detectadas (${h1Tags.length})`);
    
    if (imagesWithoutAlt > 0) warnings.push(`${imagesWithoutAlt} imágenes sin atributo ALT`);
    
    if (!isHttps) criticalIssues.push("Sitio no usa HTTPS");
    
    if (!hasViewportMeta) criticalIssues.push("Falta meta viewport para móvil");
    
    if (!hasSchemaMarkup) recommendations.push("Añadir schema markup (JSON-LD)");
    
    if (!ogTitle || !ogDescription) recommendations.push("Añadir Open Graph tags");
    
    if (!twitterCard) recommendations.push("Añadir Twitter Card meta tags");
    
    if (pageSizeKb > 3000) warnings.push(`Página muy pesada (${pageSizeKb.toFixed(0)} KB)`);
    
    if (loadTime > 3000) warnings.push(`Tiempo de carga lento (${(loadTime / 1000).toFixed(1)}s)`);
    
    if (wordCount < 300) warnings.push("Contenido muy corto (< 300 palabras)");
    
    // Calculate overall score
    let score = 100;
    score -= criticalIssues.length * 15;
    score -= warnings.length * 5;
    score -= recommendations.length * 2;
    score = Math.max(0, Math.min(100, score));
    
    logStep("Analysis complete", { score, criticalIssues: criticalIssues.length });

    // Save analysis to database
    const { error: insertError } = await supabaseClient
      .from('seo_analyses')
      .insert({
        project_id: projectId,
        overall_score: score,
        title,
        title_length: title.length,
        meta_description: metaDescription,
        meta_description_length: metaDescription.length,
        h1_count: h1Tags.length,
        h1_tags: h1Tags,
        h2_count: h2Count,
        canonical_url: canonicalUrl,
        robots_meta: robotsMeta,
        page_load_time: loadTime,
        page_size_kb: pageSizeKb,
        word_count: wordCount,
        images_total: imagesTotal,
        images_with_alt: imagesWithAlt,
        images_without_alt: imagesWithoutAlt,
        internal_links: internalLinks,
        external_links: externalLinks,
        mobile_friendly: mobileFriendly,
        has_viewport_meta: hasViewportMeta,
        is_https: isHttps,
        has_schema_markup: hasSchemaMarkup,
        schema_types: schemaTypes,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        twitter_card: twitterCard,
        critical_issues: criticalIssues,
        warnings,
        recommendations,
        raw_html: html.substring(0, 50000) // Store first 50KB only
      });

    if (insertError) throw insertError;

    // Update project last_analyzed_at
    await supabaseClient
      .from('projects')
      .update({ last_analyzed_at: new Date().toISOString() })
      .eq('id', projectId);

    logStep("Analysis saved to database");

    return new Response(JSON.stringify({
      success: true,
      score,
      criticalIssues,
      warnings,
      recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const safeMessage = getSafeErrorMessage(error);
    return new Response(JSON.stringify({ 
      success: false,
      error: safeMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
