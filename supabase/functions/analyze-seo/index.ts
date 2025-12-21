import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-SEO] ${step}${detailsStr}`);
};

// Sanitize error messages for client responses
const getSafeErrorMessage = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Log full error server-side for debugging
  logStep("ERROR", { message: errorMessage });
  
  // Map to safe client messages
  if (errorMessage.includes('Invalid URL')) {
    return 'URL inválida. Por favor, introduce una URL válida';
  }
  if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
    return 'Demasiadas solicitudes. Por favor, espera un momento';
  }
  if (errorMessage.includes('credits') || errorMessage.includes('402')) {
    return 'Servicio temporalmente no disponible';
  }
  if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
    return 'La solicitud tardó demasiado. Inténtalo de nuevo';
  }
  if (errorMessage.includes('LOVABLE_API_KEY')) {
    return 'Servicio de análisis no configurado';
  }
  
  // Generic safe message
  return 'Ha ocurrido un error durante el análisis. Por favor, inténtalo de nuevo';
};

const MAX_URL_LENGTH = 2048;
const FETCH_TIMEOUT_MS = 30000; // 30 second timeout
const AI_TIMEOUT_MS = 60000; // 60 second timeout for AI

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
  const trimmed = rawUrl.trim();
  if (!trimmed) throw new Error('Invalid URL');
  if (trimmed.length > MAX_URL_LENGTH) throw new Error('Invalid URL');

  const withScheme = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
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

    const { url } = await req.json();
    const safeUrl = normalizeAndValidateUrlForFetch(url);

    logStep("Analyzing URL", { url: safeUrl });

    // Fetch webpage content with timeout
    let pageContent = "";
    let pageTitle = "";
    let metaDescription = "";
    let headings: string[] = [];
    let imageCount = 0;

    try {
      const response = await fetchWithTimeout(
        safeUrl, 
        { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)' } },
        FETCH_TIMEOUT_MS
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL`);
      }

      const html = await response.text();
      
      // Extract basic SEO elements
      pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
      metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
      
      // Extract headings
      const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
      headings = h1Matches.map(h => h.replace(/<[^>]+>/g, ''));
      
      // Count images with alt tags
      const imgMatches = html.match(/<img[^>]+>/gi) || [];
      imageCount = imgMatches.length;
      const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']*["']/i.test(img)).length;
      
      pageContent = `
Título: ${pageTitle}
Meta Description: ${metaDescription}
Cantidad de H1: ${headings.length}
Imágenes totales: ${imageCount}
Imágenes con ALT: ${imagesWithAlt}
      `.trim();
      
      logStep("Content extracted", { 
        title: pageTitle.substring(0, 50),
        hasDescription: !!metaDescription,
        h1Count: headings.length 
      });
      
    } catch (fetchError) {
      logStep("Error fetching URL", { error: String(fetchError) });
      pageContent = `No se pudo acceder a la URL`;
    }

    // Use Lovable AI to analyze SEO
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    logStep("Calling Lovable AI for analysis");

    const aiResponse = await fetchWithTimeout(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Eres un experto en SEO. Analiza la información de una página web y proporciona:
1. Un porcentaje de optimización SEO (0-100)
2. Una lista de 5-7 mejoras prioritarias y concretas

Responde SOLO con JSON en este formato exacto:
{
  "score": 75,
  "improvements": [
    "Mejora específica 1",
    "Mejora específica 2",
    ...
  ]
}

Sé crítico pero constructivo. El score debe reflejar problemas reales.`
            },
            {
              role: "user",
              content: `Analiza esta página web y dame el score y mejoras en formato JSON:

URL: ${url}
${pageContent}

Recuerda: responde SOLO con el JSON, sin texto adicional.`
            }
          ],
        }),
      },
      AI_TIMEOUT_MS
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI credits depleted");
      }
      throw new Error(`AI gateway error`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";
    
    logStep("AI response received");

    // Parse AI response
    let analysis;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      logStep("Error parsing AI response", { error: String(parseError) });
      // Fallback analysis
      analysis = {
        score: 50,
        improvements: [
          "Optimizar el título de la página (max 60 caracteres)",
          "Añadir meta description atractiva (max 160 caracteres)",
          "Incluir palabras clave relevantes en H1",
          "Añadir atributos ALT descriptivos a todas las imágenes",
          "Mejorar la velocidad de carga de la página",
          "Implementar schema markup para SEO avanzado"
        ]
      };
    }

    logStep("Analysis complete", { score: analysis.score });

    return new Response(JSON.stringify({
      success: true,
      url,
      score: analysis.score,
      improvements: analysis.improvements
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
