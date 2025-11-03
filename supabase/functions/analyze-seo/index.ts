import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-SEO] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { url } = await req.json();
    if (!url) throw new Error("URL is required");
    
    logStep("Analyzing URL", { url });

    // Fetch webpage content
    let pageContent = "";
    let pageTitle = "";
    let metaDescription = "";
    let headings: string[] = [];
    let imageCount = 0;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
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
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      logStep("Error fetching URL", { error: errorMsg });
      pageContent = `No se pudo acceder a la URL: ${errorMsg}`;
    }

    // Use Lovable AI to analyze SEO
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    logStep("Calling Lovable AI for analysis");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI credits depleted. Please add credits to continue.");
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
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
      const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      logStep("Error parsing AI response", { error: errorMsg, content: aiContent });
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
