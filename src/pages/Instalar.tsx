import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Monitor, Apple, Chrome } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Instalar = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
    setIsInstalled(isStandaloneMode);

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Instalar Evoluxe SEO
            </h1>
            <p className="text-xl text-muted-foreground">
              Instala nuestra app en tu dispositivo para acceso rápido y uso offline
            </p>
          </div>

          {isStandalone ? (
            <Card className="max-w-md mx-auto border-green-500/50 bg-green-500/10">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-green-500">¡App Instalada!</CardTitle>
                <CardDescription>
                  Ya estás usando Evoluxe SEO como aplicación instalada.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Android / Chrome */}
              <Card className="border-primary/30 hover:border-primary/60 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Chrome className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Android / Chrome</CardTitle>
                      <CardDescription>Windows, Android, Linux</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deferredPrompt ? (
                    <Button 
                      onClick={handleInstallClick} 
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Instalar Ahora
                    </Button>
                  ) : (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Pasos para instalar:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Abre Chrome en tu dispositivo</li>
                        <li>Toca el menú <strong>⋮</strong> (tres puntos)</li>
                        <li>Selecciona <strong>"Instalar app"</strong> o <strong>"Añadir a pantalla de inicio"</strong></li>
                        <li>Confirma la instalación</li>
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* iOS / Safari */}
              <Card className="border-primary/30 hover:border-primary/60 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Apple className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">iPhone / iPad</CardTitle>
                      <CardDescription>Safari en iOS</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Pasos para instalar:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Abre <strong>Safari</strong> (no funciona en Chrome)</li>
                      <li>Toca el botón <strong>Compartir</strong> (cuadrado con flecha)</li>
                      <li>Desplázate y toca <strong>"Añadir a pantalla de inicio"</strong></li>
                      <li>Toca <strong>"Añadir"</strong> en la esquina superior derecha</li>
                    </ol>
                  </div>
                  {isIOS && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-amber-600 dark:text-amber-400 text-sm">
                        📱 Estás en iOS. Usa Safari para instalar la app.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Ventajas de la App Instalada</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Acceso Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Abre la app directamente desde tu pantalla de inicio
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Funciona Offline</h3>
                <p className="text-sm text-muted-foreground">
                  Accede a funciones básicas sin conexión a internet
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Pantalla Completa</h3>
                <p className="text-sm text-muted-foreground">
                  Sin barra de navegador, experiencia nativa
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instalar;
