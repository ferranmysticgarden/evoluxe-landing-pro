import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const TIERS = {
  starter: {
    price_id: "price_1SKbcbEMc3nGa1zuMywK3eTU",
    product_id: "prod_TH9wmvuriJwECc",
  },
  profesional: {
    price_id: "price_1SKbdAEMc3nGa1zuGPmhFTK6",
    product_id: "prod_TH9xDonPBboybw",
  },
  enterprise: {
    price_id: "price_1SKbdbEMc3nGa1zu1jaL2F7k",
    product_id: "prod_TH9xwp4byjyTXm",
  },
};

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Para proyectos pequeños y startups",
    features: [
      "Hasta 10 proyectos",
      "50 métricas SEO",
      "Monitoreo diario",
      "Análisis de competencia básico",
      "Soporte por email"
    ],
    cta: "Empezar Gratis",
    popular: false,
    priceId: TIERS.starter.price_id,
    productId: TIERS.starter.product_id,
  },
  {
    name: "Profesional",
    price: "79",
    description: "Ideal para agencias y profesionales",
    features: [
      "Proyectos ilimitados",
      "Todas las métricas SEO",
      "Monitoreo en tiempo real",
      "Análisis avanzado de competencia",
      "Auditoría técnica completa",
      "API access",
      "Soporte prioritario 24/7",
      "Reportes white-label"
    ],
    cta: "Probar 14 Días Gratis",
    popular: true,
    priceId: TIERS.profesional.price_id,
    productId: TIERS.profesional.product_id,
  },
  {
    name: "Enterprise",
    price: "199",
    description: "Para grandes equipos y empresas",
    features: [
      "Todo lo de Profesional",
      "Gestión de equipos",
      "SSO y seguridad avanzada",
      "Onboarding personalizado",
      "Gerente de cuenta dedicado",
      "SLA garantizado",
      "Integraciones personalizadas",
      "Auditorías trimestrales"
    ],
    cta: "Contactar Ventas",
    popular: false,
    priceId: TIERS.enterprise.price_id,
    productId: TIERS.enterprise.product_id,
  }
];

const Pricing = () => {
  const { toast } = useToast();
  const { user, session, subscriptionData, subscriptionLoading, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Scroll suave a la sección cuando se carga con hash
  React.useEffect(() => {
    if (window.location.hash === '#pricing') {
      setTimeout(() => {
        const element = document.getElementById('pricing');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handlePurchase = async (planName: string, priceId: string) => {
    if (!user || !session) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para suscribirte a un plan.",
      });
      navigate("/auth");
      return;
    }

    setLoadingPlan(planName);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        setTimeout(() => {
          refreshSubscription();
        }, 5000);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sesión de pago. Inténtalo de nuevo.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user || !session) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo abrir el portal de gestión. Inténtalo de nuevo.",
      });
    }
  };

  const isCurrentPlan = (productId: string) => {
    return subscriptionData?.subscribed && subscriptionData.product_id === productId;
  };

  return (
    <section id="pricing" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Planes Adaptados a tu Crecimiento
          </h2>
          <p className="text-lg text-muted-foreground">
            Elige el plan perfecto para tus necesidades SEO. Sin compromisos, cancela cuando quieras.
          </p>
          {user && !subscriptionData?.subscribed && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                ✨ ¡Tu cuenta está lista! Elige un plan para comenzar tu prueba gratis de 14 días
              </p>
            </div>
          )}
          {subscriptionData?.subscribed && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleManageSubscription}>
                Gestionar Suscripción
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isActive = isCurrentPlan(plan.productId);
            return (
              <Card 
                key={index}
                className={`relative flex flex-col ${
                  isActive ? 'border-accent border-2 shadow-xl' :
                  plan.popular ? 'border-primary border-2 shadow-xl' : 'border-border'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Plan Actual
                    </span>
                  </div>
                )}
                {!isActive && plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-foreground">{plan.price}€</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={isActive ? "secondary" : plan.popular ? "default" : "outline"}
                    onClick={() => isActive ? null : handlePurchase(plan.name, plan.priceId)}
                    disabled={isActive || loadingPlan === plan.name || subscriptionLoading}
                  >
                    {isActive ? "Plan Actual" : loadingPlan === plan.name ? "Cargando..." : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Todos los planes incluyen 14 días de prueba gratis. No se requiere tarjeta de crédito.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
