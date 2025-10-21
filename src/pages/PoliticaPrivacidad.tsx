import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Política de Privacidad</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Información General</h2>
            <p>
              En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de 
              abril de 2016 relativo a la protección de las personas físicas (RGPD), le informamos sobre 
              el tratamiento de sus datos personales.
            </p>
            <p className="mt-4">
              <strong>Responsable del tratamiento:</strong> Evoluxe's Project<br />
              <strong>Contacto:</strong> contact@evoluxe.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Datos Recopilados</h2>
            <p>Recopilamos y procesamos los siguientes tipos de datos personales:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Datos de identificación:</strong> nombre, apellidos, dirección de correo electrónico</li>
              <li><strong>Datos de facturación:</strong> información de pago, dirección de facturación</li>
              <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia</li>
              <li><strong>Datos de uso:</strong> proyectos creados, keywords monitorizadas, informes generados</li>
              <li><strong>Datos de cookies:</strong> identificadores de sesión, preferencias de usuario</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Finalidad del Tratamiento</h2>
            <p>Sus datos personales serán tratados con las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestión de su cuenta de usuario y prestación de los servicios contratados</li>
              <li>Procesamiento de pagos y emisión de facturas</li>
              <li>Envío de comunicaciones relacionadas con el servicio (actualizaciones, mantenimiento, soporte)</li>
              <li>Mejora de nuestros servicios mediante análisis de uso</li>
              <li>Cumplimiento de obligaciones legales y fiscales</li>
              <li>Envío de newsletters y comunicaciones comerciales (solo con su consentimiento previo)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Base Legal del Tratamiento</h2>
            <p>El tratamiento de sus datos personales se basa en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Ejecución del contrato:</strong> para la prestación de los servicios solicitados</li>
              <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y uso de cookies no esenciales</li>
              <li><strong>Interés legítimo:</strong> para la mejora de nuestros servicios y seguridad</li>
              <li><strong>Obligación legal:</strong> para el cumplimiento de obligaciones fiscales y contables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Compartición de Datos</h2>
            <p>
              Sus datos podrán ser comunicados a terceros prestadores de servicios necesarios para el 
              funcionamiento de la plataforma:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pasarelas de pago:</strong> Stripe y PayPal (para procesamiento de pagos)</li>
              <li><strong>Proveedores de hosting:</strong> para el almacenamiento seguro de datos</li>
              <li><strong>Servicios de análisis:</strong> Google Analytics (con IP anonimizada)</li>
              <li><strong>Servicios de email:</strong> para el envío de comunicaciones autorizadas</li>
            </ul>
            <p className="mt-4">
              Todos estos terceros están obligados contractualmente a mantener la confidencialidad y 
              seguridad de sus datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Transferencias Internacionales</h2>
            <p>
              Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico 
              Europeo. En estos casos, garantizamos que se han adoptado las medidas de seguridad adecuadas 
              mediante cláusulas contractuales tipo aprobadas por la Comisión Europea o certificaciones de 
              cumplimiento normativo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Conservación de Datos</h2>
            <p>
              Sus datos personales serán conservados durante el tiempo necesario para cumplir con la 
              finalidad para la que fueron recabados:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Datos de cuenta:</strong> mientras mantenga su cuenta activa</li>
              <li><strong>Datos de facturación:</strong> durante el plazo establecido por la legislación fiscal (mínimo 4 años)</li>
              <li><strong>Datos de marketing:</strong> hasta que retire su consentimiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Derechos del Usuario</h2>
            <p>Tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acceso:</strong> obtener confirmación sobre si estamos tratando sus datos</li>
              <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de sus datos ("derecho al olvido")</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos</li>
              <li><strong>Limitación:</strong> solicitar la limitación del tratamiento</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado</li>
              <li><strong>No ser objeto de decisiones automatizadas</strong></li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, puede contactarnos en: contact@evoluxe.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies propias y de terceros para mejorar su experiencia de navegación y analizar 
              el uso del sitio web:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies técnicas:</strong> necesarias para el funcionamiento del sitio</li>
              <li><strong>Cookies de análisis:</strong> Google Analytics (IP anonimizada)</li>
              <li><strong>Cookies de publicidad:</strong> Google Ads (solo con su consentimiento)</li>
            </ul>
            <p className="mt-4">
              Puede configurar o rechazar las cookies en cualquier momento desde la configuración de su 
              navegador. Tenga en cuenta que algunas funcionalidades pueden verse afectadas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Google Ads y Remarketing</h2>
            <p>
              Utilizamos Google Ads para mostrar anuncios personalizados. Google puede recopilar información 
              sobre su navegación para mostrarle publicidad relevante. Puede desactivar la publicidad 
              personalizada de Google en: 
              <a href="https://adssettings.google.com" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://adssettings.google.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Seguridad de los Datos</h2>
            <p>
              Hemos adoptado medidas técnicas y organizativas apropiadas para proteger sus datos personales 
              contra el acceso no autorizado, alteración, divulgación o destrucción:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cifrado SSL/TLS para todas las comunicaciones</li>
              <li>Servidores seguros con acceso restringido</li>
              <li>Copias de seguridad periódicas</li>
              <li>Auditorías de seguridad regulares</li>
              <li>Formación del personal en protección de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Menores de Edad</h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos intencionadamente 
              datos personales de menores. Si tiene conocimiento de que un menor ha proporcionado datos 
              personales, contacte con nosotros inmediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Modificaciones</h2>
            <p>
              Nos reservamos el derecho a modificar esta Política de Privacidad en cualquier momento. 
              Los cambios serán publicados en esta página y, si son sustanciales, le notificaremos por 
              correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Autoridad de Control</h2>
            <p>
              Si considera que el tratamiento de sus datos personales no se ajusta a la normativa, puede 
              presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sitio web: www.aepd.es</li>
              <li>Dirección: C/ Jorge Juan, 6, 28001 Madrid</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contacto</h2>
            <p>
              Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de sus datos 
              personales, puede contactarnos en:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Correo electrónico:</strong> contact@evoluxe.com</li>
              <li><strong>Asunto:</strong> "Protección de Datos - [Su consulta]"</li>
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

export default PoliticaPrivacidad;
