import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Herramienta SEO Profesional #1
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Domina el SEO con{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              50+ Métricas Avanzadas
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Analiza, monitoriza y optimiza tu estrategia SEO con la herramienta más completa del mercado. 
            Análisis de competencia, seguimiento de rankings y auditorías técnicas en tiempo real.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="group h-14 gap-2 px-8 text-base shadow-lg transition-all hover:shadow-xl"
            >
              Probar Gratis 14 Días
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-base"
            >
              Ver Demo en Vivo
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
