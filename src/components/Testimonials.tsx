import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "SEO Manager en TechCorp",
    content: "Evoluxe's Project ha transformado completamente nuestra estrategia SEO. Las métricas avanzadas nos permiten tomar decisiones basadas en datos reales.",
    rating: 5,
    avatar: "MG"
  },
  {
    name: "Carlos Rodríguez",
    role: "Fundador de Agencia Digital",
    content: "La mejor inversión para nuestra agencia. Los reportes white-label son impresionantes y nuestros clientes están encantados con los resultados.",
    rating: 5,
    avatar: "CR"
  },
  {
    name: "Ana Martínez",
    role: "Content Strategist",
    content: "El análisis de intención de búsqueda es increíblemente preciso. Hemos duplicado nuestro tráfico orgánico en 6 meses.",
    rating: 5,
    avatar: "AM"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Confiado por Profesionales del SEO
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de marketers y agencias confían en nosotros para impulsar su estrategia SEO
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-card border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
