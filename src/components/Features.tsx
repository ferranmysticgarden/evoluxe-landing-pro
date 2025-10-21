import { 
  Search, 
  LineChart, 
  Users, 
  FileSearch, 
  Globe, 
  Zap,
  Target,
  Award,
  Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Análisis de Palabras Clave",
    description: "Descubre oportunidades con 50+ métricas: volumen, dificultad, CPC, tendencias y variaciones estacionales."
  },
  {
    icon: Users,
    title: "Análisis de Competencia",
    description: "Espía las estrategias de tus competidores: keywords, backlinks, contenido top y gaps de oportunidad."
  },
  {
    icon: LineChart,
    title: "Seguimiento de Rankings",
    description: "Monitoriza tus posiciones en tiempo real en Google, Bing y Yahoo con alertas automáticas."
  },
  {
    icon: FileSearch,
    title: "Auditoría Técnica SEO",
    description: "Identifica errores críticos: crawlability, velocidad, mobile-first, Core Web Vitals y más."
  },
  {
    icon: Globe,
    title: "Análisis de Backlinks",
    description: "Perfil completo de enlaces: autoridad de dominio, anchor text, enlaces tóxicos y oportunidades."
  },
  {
    icon: Zap,
    title: "Optimización de Contenido",
    description: "Recomendaciones en tiempo real para mejorar tu contenido y superar a la competencia."
  },
  {
    icon: Target,
    title: "Intención de Búsqueda",
    description: "Análisis semántico avanzado para alinear tu contenido con la intención del usuario."
  },
  {
    icon: Award,
    title: "Métricas SERP Avanzadas",
    description: "Featured snippets, People Also Ask, imágenes, vídeos y más elementos de las SERPs."
  },
  {
    icon: Shield,
    title: "Reportes Personalizados",
    description: "Dashboards interactivos y reportes white-label para clientes con datos en tiempo real."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Todo lo que Necesitas para Dominar el SEO
          </h2>
          <p className="text-lg text-muted-foreground">
            Una suite completa de herramientas profesionales para llevar tu estrategia SEO al siguiente nivel
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
