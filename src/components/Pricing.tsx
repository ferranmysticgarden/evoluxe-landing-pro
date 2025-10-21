import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Starter",
    price: "49",
    period: "mes",
    description: "Perfecto para freelancers y pequeños proyectos",
    features: [
      "10 proyectos activos",
      "100 keywords monitorizadas",
      "5 competidores por proyecto",
      "Auditoría técnica básica",
      "Análisis de backlinks",
      "Reportes mensuales",
      "Soporte por email"
    ],
    cta: "Empezar Ahora",
    popular: false
  },
  {
    name: "Professional",
    price: "149",
    period: "mes",
    description: "Ideal para agencias y empresas en crecimiento",
    features: [
      "50 proyectos activos",
      "1000 keywords monitorizadas",
      "15 competidores por proyecto",
      "Auditoría técnica avanzada",
      "Análisis completo de backlinks",
      "Seguimiento de rankings 24/7",
      "Reportes personalizados white-label",
      "API acceso completo",
      "Soporte prioritario"
    ],
    cta: "Probar Gratis 14 Días",
    popular: true
  },
  {
    name: "Enterprise",
    price: "399",
    period: "mes",
    description: "Para grandes empresas con necesidades avanzadas",
    features: [
      "Proyectos ilimitados",
      "10,000+ keywords monitorizadas",
      "Competidores ilimitados",
      "Auditoría técnica enterprise",
      "Análisis histórico de backlinks",
      "Alertas en tiempo real",
      "Dashboards personalizados",
      "Integraciones avanzadas",
      "Account manager dedicado",
      "Soporte 24/7"
    ],
    cta: "Contactar Ventas",
    popular: false
  }
];

const Pricing = () => {
  const { toast } = useToast();

  const handlePurchase = (planName: string) => {
    toast({
      title: "Redirigiendo a pago...",
      description: `Procesando tu suscripción al plan ${planName}`,
    });
    // Aquí se integrará Stripe
  };

  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Planes Diseñados para tu Crecimiento
          </h2>
          <p className="text-lg text-muted-foreground">
            Elige el plan perfecto para tus necesidades. Cancela cuando quieras, sin compromisos.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 ${
                plan.popular 
                  ? 'border-primary shadow-2xl scale-105 bg-card' 
                  : 'bg-card border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-foreground">{plan.price}€</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
              </div>

              <Button 
                onClick={() => handlePurchase(plan.name)}
                className={`w-full mb-6 h-12 ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : ''
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Todos los planes incluyen 14 días de prueba gratuita. 
            <br />
            <a href="#" className="text-primary hover:underline">
              Comparar todos los planes
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
