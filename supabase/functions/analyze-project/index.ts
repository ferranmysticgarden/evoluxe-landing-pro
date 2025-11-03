import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-PROJECT] ${step}${detailsStr}`);
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

    // Get project
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userData.user.id)
      .single();

    if (projectError || !project) throw new Error("Project not found");
    
    logStep("Project found", { url: project.url });

    // Fetch webpage
    const startTime = Date.now();
    const response = await fetch(project.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)' }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
