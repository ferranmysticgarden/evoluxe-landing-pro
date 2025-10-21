import { Button } from "@/components/ui/button";
import { BarChart3, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Evoluxe's Project</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </a>
            <Link to="/casos-exito" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Casos de Éxito
            </Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Iniciar Sesión
            </Button>
            <Button size="sm">
              Probar Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Precios
            </a>
            <Link to="/casos-exito" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Casos de Éxito
            </Link>
            <Link to="/blog" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" size="sm" className="w-full">
                Iniciar Sesión
              </Button>
              <Button size="sm" className="w-full">
                Probar Gratis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
