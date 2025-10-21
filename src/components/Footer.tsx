import { BarChart3 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Evoluxe's Project</span>
            </a>
            <p className="text-sm text-muted-foreground mb-4">
              La herramienta SEO profesional más completa para dominar los rankings de búsqueda.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Evoluxe's Project. Todos los derechos reservados.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Integraciones
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/aviso-legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Aviso Legal
                </a>
              </li>
              <li>
                <a href="/politica-privacidad" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/terminos-uso" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Contacto: <a href="mailto:contact@evoluxe.com" className="text-primary hover:underline">contact@evoluxe.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
