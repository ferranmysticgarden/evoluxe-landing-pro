import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "Cómo mejorar tu SEO en 2025",
      excerpt: "Descubre las últimas estrategias y tendencias para posicionar tu sitio web en los primeros resultados de búsqueda.",
      date: "15 Enero 2025",
      category: "SEO Tips"
    },
    {
      title: "Análisis de palabras clave: Guía completa",
      excerpt: "Todo lo que necesitas saber para encontrar y analizar las mejores keywords para tu negocio.",
      date: "10 Enero 2025",
      category: "Tutoriales"
    },
    {
      title: "El futuro del SEO con IA",
      excerpt: "Cómo la inteligencia artificial está transformando el posicionamiento web y qué esperar en los próximos años.",
      date: "5 Enero 2025",
      category: "Tendencias"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog de Evoluxe's Project
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artículos, guías y recursos sobre SEO, marketing digital y posicionamiento web
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-card-foreground mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Próximamente más contenido... 
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;