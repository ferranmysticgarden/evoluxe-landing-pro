import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Crown, Building2 } from "lucide-react";
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
    price: "39",
    originalPrice: "59",
    description: "Perfecto para emprendedores y pequeños negocios",
    icon: Zap,
    features: [
      "Hasta 15 proyectos",
      "50+ métricas SEO avanzadas",
      "Monitoreo diario automático",
      "Análisis de competencia básico",
      "Alertas por email",
      "Historial de 30 días",
      "Soporte por email 24h"
    ],
    cta: "Empezar Ahora",
    popular: false,
    priceId: TIERS.starter.price_id,
    productId: TIERS.starter.product_id,
  },
  {
    name: "Profesional",
    price: "99",
    originalPrice: "149",
    description: "Ideal para agencias y consultores SEO",
    icon: Crown,
    features: [
      "Proyectos ilimitados",
      "Todas las métricas SEO premium",
      "Monitoreo en tiempo real",
      "Análisis avanzado de competencia",
      "Auditoría técnica completa",
      "API REST completa",
      "Reportes white-label PDF",
      "Seguimiento de backlinks",
      "Análisis de Core Web Vitals",
      "Soporte prioritario 24/7",
      "Historial ilimitado"
    ],
    cta: "Probar 14 Días Gratis",
    popular: true,
    priceId: TIERS.profesional.price_id,
    productId: TIERS.profesional.product_id,
  },
  {
    name: "Enterprise",
    price: "299",
    originalPrice: "399",
    description: "Para grandes equipos y corporaciones",
    icon: Building2,
    features: [
      "Todo lo de Profesional",
      "Usuarios ilimitados",
      "SSO (SAML, OAuth)",
      "Onboarding personalizado",
      "Gerente de cuenta dedicado",
      "SLA 99.9% garantizado",
      "Integraciones personalizadas",
      "Auditorías trimestrales en vivo",
      "Formación para tu equipo",
      "Acceso anticipado a nuevas funciones",
      "Soporte telefónico directo"
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            🎉 Oferta de Lanzamiento - 30% OFF
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Planes que Escalan Contigo
          </h2>
          <p className="text-lg text-muted-foreground">
            Elige el plan perfecto para tus necesidades. Sin compromisos, cancela cuando quieras.
            <br />
            <span className="font-semibold text-primary">Todos incluyen 14 días gratis.</span>
          </p>
          {user && !subscriptionData?.subscribed && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                ✨ ¡Hola {user.email?.split('@')[0]}! Tu cuenta está lista. Elige tu plan para empezar.
              </p>
            </div>
          )}
          {subscriptionData?.subscribed && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleManageSubscription}>
                ⚙️ Gestionar Suscripción
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isActive = isCurrentPlan(plan.productId);
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index}
                className={`relative flex flex-col transition-all duration-300 hover:scale-105 ${
                  isActive ? 'border-accent border-2 shadow-2xl shadow-accent/20' :
                  plan.popular ? 'border-primary border-2 shadow-2xl shadow-primary/20' : 'border-border hover:border-primary/50'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ✓ Plan Actual
                    </span>
                  </div>
                )}
                {!isActive && plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                      ⭐ Más Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}€</span>
                      <span className="text-5xl font-bold text-foreground">{plan.price}€</span>
                    </div>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-card-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular && !isActive ? 'shadow-lg shadow-primary/30' : ''}`}
                    variant={isActive ? "secondary" : plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => isActive ? null : handlePurchase(plan.name, plan.priceId)}
                    disabled={isActive || loadingPlan === plan.name || subscriptionLoading}
                  >
                    {isActive ? "✓ Plan Actual" : loadingPlan === plan.name ? "Cargando..." : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            🔒 Pago seguro con Stripe • 💳 Acepta todas las tarjetas • 🚫 Cancela cuando quieras
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Sin compromiso
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Factura disponible
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Soporte en español
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;