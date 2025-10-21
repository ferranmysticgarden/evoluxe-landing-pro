import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PoliticaCookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Política de Cookies</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. 
              Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre 
              los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan 
              y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. ¿Qué tipos de cookies utiliza este sitio web?</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-3">Cookies Técnicas</h3>
              <p>
                Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de 
                las diferentes opciones o servicios que en ella existen como, por ejemplo, controlar el tráfico y 
                la comunicación de datos, identificar la sesión o acceder a partes de acceso restringido.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-3">Cookies de Análisis</h3>
              <p>
                Son aquellas que permiten al responsable de las mismas el seguimiento y análisis del comportamiento 
                de los usuarios de los sitios web a los que están vinculadas. La información recogida mediante este 
                tipo de cookies se utiliza en la medición de la actividad de los sitios web y para la elaboración 
                de perfiles de navegación de los usuarios, con el fin de introducir mejoras en función del análisis 
                de los datos de uso que hacen los usuarios del servicio.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-3">Cookies de Autenticación</h3>
              <p>
                Utilizamos cookies para gestionar la sesión de usuario y mantener su sesión activa mientras navega 
                por el sitio web. Estas cookies son esenciales para el funcionamiento del servicio.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Detalle de cookies utilizadas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Nombre</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Tipo</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Duración</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2">supabase-auth-token</td>
                    <td className="border border-border px-4 py-2">Técnica</td>
                    <td className="border border-border px-4 py-2">Sesión</td>
                    <td className="border border-border px-4 py-2">Gestión de autenticación de usuario</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2">sb-refresh-token</td>
                    <td className="border border-border px-4 py-2">Técnica</td>
                    <td className="border border-border px-4 py-2">7 días</td>
                    <td className="border border-border px-4 py-2">Renovación automática de sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. ¿Cómo puedo desactivar o eliminar las cookies?</h2>
            <p>
              Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración 
              de las opciones del navegador instalado en su ordenador. A continuación le proporcionamos enlaces en los 
              que encontrará información sobre cómo puede activar sus preferencias en los principales navegadores:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Safari
                </a>
              </li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> Si desactiva las cookies técnicas, es posible que algunas funcionalidades 
              del sitio web no funcionen correctamente, especialmente aquellas relacionadas con la autenticación y 
              el mantenimiento de la sesión.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Consentimiento</h2>
            <p>
              Al utilizar este sitio web, usted acepta el uso de cookies de acuerdo con esta Política de Cookies. 
              Si no está de acuerdo con el uso de cookies, deberá desactivarlas siguiendo las instrucciones de su 
              navegador o abstenerse de utilizar este sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Actualizaciones</h2>
            <p>
              Evoluxe's Project puede modificar esta Política de Cookies en función de exigencias legislativas, 
              reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la 
              Agencia Española de Protección de Datos. Cuando se produzcan cambios significativos en esta Política 
              de Cookies, se comunicarán a los usuarios mediante aviso informativo en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contacto</h2>
            <p>
              Para cualquier consulta sobre esta Política de Cookies, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Correo electrónico:</strong> evoluxesproject@gmail.com</li>
              <li><strong>Teléfono:</strong> +34 609 955 494</li>
              <li><strong>Dirección:</strong> Gerani 31, 17240 Llagostera, España</li>
            </ul>
          </section>

          <p className="text-sm mt-12 pt-6 border-t border-border">
            <strong>Última actualización:</strong> Enero 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;