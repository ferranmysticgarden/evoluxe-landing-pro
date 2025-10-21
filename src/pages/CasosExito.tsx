import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target } from "lucide-react";

const CasosExito = () => {
  const cases = [
    {
      company: "TechStartup SL",
      industry: "Tecnología",
      results: [
        { label: "Tráfico orgánico", value: "+240%", icon: TrendingUp },
        { label: "Keywords top 10", value: "+185", icon: Target },
        { label: "Conversiones", value: "+320%", icon: Users }
      ],
      description: "Una startup tecnológica que logró posicionarse en su sector en menos de 6 meses usando nuestra herramienta."
    },
    {
      company: "E-commerce Fashion",
      industry: "Moda y Retail",
      results: [
        { label: "Tráfico orgánico", value: "+180%", icon: TrendingUp },
        { label: "Keywords top 10", value: "+120", icon: Target },
        { label: "Ventas online", value: "+250%", icon: Users }
      ],
      description: "Una tienda online que multiplicó sus ventas gracias a una estrategia SEO basada en datos precisos."
    },
    {
      company: "Agencia Marketing Digital",
      industry: "Servicios",
      results: [
        { label: "Clientes gestionados", value: "50+", icon: Users },
        { label: "Proyectos activos", value: "200+", icon: Target },
        { label: "Tiempo ahorrado", value: "70%", icon: TrendingUp }
      ],
      description: "Una agencia que optimizó sus procesos y mejoró los resultados de todos sus clientes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Casos de Éxito
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo empresas y profesionales están transformando su presencia online con Evoluxe's Project
            </p>
          </div>

          <div className="space-y-12">
            {cases.map((caso, index) => (
              <Card key={index} className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    {caso.company}
                  </h2>
                  <p className="text-primary font-medium">{caso.industry}</p>
                </div>

                <p className="text-muted-foreground mb-8">
                  {caso.description}
                </p>

                <div className="grid gap-6 md:grid-cols-3">
                  {caso.results.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <div key={idx} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                          {result.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-card p-8 rounded-lg border border-border">
            <h3 className="text-2xl font-bold text-card-foreground mb-4">
              ¿Quieres ser el próximo caso de éxito?
            </h3>
            <p className="text-muted-foreground mb-6">
              Únete a cientos de empresas que ya están mejorando su SEO
            </p>
            <a
              href="/#pricing"
              className="inline-flex items-center justify-center h-10 px-6 font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Ver Planes
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CasosExito;