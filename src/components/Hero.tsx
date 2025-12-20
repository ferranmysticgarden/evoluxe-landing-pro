import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BarChart3, TrendingUp, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { normalizeAndValidateUrl } from "@/lib/urlValidation";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    improvements: string[];
  } | null>(null);

  const handleStartTrial = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleViewDemo = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: "URL requerida",
        description: "Por favor introduce una URL válida",
        variant: "destructive",
      });
      return;
    }

    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeAndValidateUrl(url).normalizedUrl;
    } catch (err) {
      toast({
        title: "URL inválida",
        description: err instanceof Error ? err.message : "Por favor introduce una URL válida (ej: example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-seo', {
        body: { url: normalizedUrl }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysis({
          score: data.score,
          improvements: data.improvements
        });
        
        toast({
          title: "✅ Análisis completado",
          description: `Tu sitio tiene un ${data.score}% de optimización SEO`,
        });
      } else {
        throw new Error(data.error || "Error al analizar");
      }
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      toast({
        title: "Error al analizar",
        description: error instanceof Error ? error.message : "No se pudo completar el análisis. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGoToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    pricingSection?.scrollIntoView({ behavior: "smooth" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "¡Excelente! Tu SEO está muy bien optimizado";
    if (score >= 60) return "Bien, pero hay margen de mejora";
    if (score >= 40) return "Necesitas optimizar tu SEO urgentemente";
    return "Tu SEO necesita una revisión completa";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            🏆 Herramienta SEO #1 en España
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Domina Google con{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SEO Pro Analytics
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Analiza, monitoriza y optimiza tu estrategia SEO con la herramienta más completa del mercado. 
            Análisis de competencia, seguimiento de rankings y auditorías técnicas en tiempo real.
          </p>

          {/* SEO Analysis Form */}
          <Card className="mb-8 bg-card/50 backdrop-blur border-primary/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">🚀 Analiza tu SEO Gratis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Descubre en segundos cómo mejorar tu posicionamiento
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Introduce la URL de tu sitio (ej: example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    disabled={isAnalyzing}
                  />
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing}
                    className="gap-2 shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        Analizar Gratis
                      </>
                    )}
                  </Button>
                </div>

                {/* Analysis Results */}
                {analysis && (
                  <div className="mt-6 space-y-4 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Optimización SEO</span>
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                          {analysis.score}%
                        </span>
                      </div>
                      <Progress value={analysis.score} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {getScoreMessage(analysis.score)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Mejoras Recomendadas:
                      </h4>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={handleGoToPricing}
                      className="w-full gap-2 shadow-lg"
                      size="lg"
                    >
                      Ver Planes y Mejorar mi SEO
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="group h-14 gap-2 px-8 text-base shadow-lg transition-all hover:shadow-xl"
              onClick={handleStartTrial}
            >
              Probar Gratis 14 Días
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-base"
              onClick={handleViewDemo}
            >
              Ver Funcionalidades
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>50+ Métricas SEO</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Monitoreo 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>100% RGPD Compatible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[128px]" />
    </section>
  );
};

export default Hero;
