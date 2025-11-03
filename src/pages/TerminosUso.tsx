import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TerminosUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Términos de Uso</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar Evoluxe's Project (en adelante, "el Servicio"), usted acepta quedar 
              vinculado por estos Términos de Uso. Si no está de acuerdo con alguno de estos términos, 
              no debe utilizar nuestro Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descripción del Servicio</h2>
            <p>
              Evoluxe's Project es una plataforma SaaS (Software as a Service) que proporciona herramientas 
              profesionales de análisis y optimización SEO, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Análisis de palabras clave y métricas SEO</li>
              <li>Monitorización de rankings en buscadores</li>
              <li>Auditorías técnicas de sitios web</li>
              <li>Análisis de competencia y backlinks</li>
              <li>Generación de informes y reportes personalizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Registro y Cuenta de Usuario</h2>
            <p>
              Para utilizar el Servicio, debe crear una cuenta proporcionando información precisa, completa 
              y actualizada. Usted es responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Todas las actividades realizadas desde su cuenta</li>
              <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
            </ul>
            <p className="mt-4">
              Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos o 
              proporcionen información falsa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Planes y Suscripciones</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Tipos de Planes</h3>
            <p>Ofrecemos varios planes de suscripción con diferentes funcionalidades y límites de uso.</p>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.2 Facturación</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Las suscripciones se facturan mensualmente o anualmente según el plan elegido</li>
              <li>Los pagos se procesan de forma automática en la fecha de renovación</li>
              <li>Los precios pueden modificarse con notificación previa de 30 días</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.3 Prueba Gratuita</h3>
            <p>
              Ofrecemos un período de prueba gratuito de 14 días para el plan Professional. No se requiere 
              tarjeta de crédito. Al finalizar, puede elegir un plan de pago o su cuenta será desactivada.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.4 Reembolsos</h3>
            <p>
              Ofrecemos garantía de devolución del 100% durante los primeros 7 días desde la primera 
              facturación. Después de este período, no se realizarán reembolsos proporcionales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Uso Aceptable</h2>
            <p>Al utilizar el Servicio, usted se compromete a NO:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar el Servicio para actividades ilegales o fraudulentas</li>
              <li>Intentar acceder a cuentas, sistemas o redes sin autorización</li>
              <li>Realizar ingeniería inversa, descompilar o desensamblar el software</li>
              <li>Utilizar bots, scrapers o herramientas automatizadas no autorizadas</li>
              <li>Sobrecargar intencionadamente nuestra infraestructura</li>
              <li>Compartir su cuenta con terceros no autorizados</li>
              <li>Revender o redistribuir el Servicio sin autorización expresa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propiedad Intelectual</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Derechos de Evoluxe's Project</h3>
            <p>
              Todo el contenido del Servicio, incluyendo software, diseño, textos, gráficos, logos, iconos, 
              imágenes y código fuente, es propiedad exclusiva de Evoluxe's Project y está protegido por 
              leyes de propiedad intelectual.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">6.2 Derechos del Usuario</h3>
            <p>
              Usted conserva todos los derechos sobre los datos e información que introduce en el Servicio. 
              Nos concede una licencia limitada para procesar estos datos únicamente con el fin de 
              proporcionar el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Protección de Datos</h2>
            <p>
              El tratamiento de sus datos personales se rige por nuestra{" "}
              <Link to="/politica-privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
              , que forma parte integral de estos Términos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disponibilidad del Servicio</h2>
            <p>
              Nos esforzamos por mantener el Servicio disponible 24/7, pero no podemos garantizar un 
              funcionamiento ininterrumpido. Nos reservamos el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Realizar mantenimientos programados con notificación previa</li>
              <li>Suspender temporalmente el Servicio por razones técnicas o de seguridad</li>
              <li>Modificar o discontinuar funcionalidades con notificación previa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitación de Garantías</h2>
            <p>
              El Servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". No garantizamos que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>El Servicio será ininterrumpido, seguro o libre de errores</li>
              <li>Los resultados obtenidos serán exactos, precisos o fiables</li>
              <li>Cualquier error en el software será corregido</li>
            </ul>
            <p className="mt-4">
              La información proporcionada por el Servicio tiene carácter informativo y no constituye 
              asesoramiento profesional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, Evoluxe's Project no será responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Daños directos, indirectos, incidentales o consecuentes</li>
              <li>Pérdida de beneficios, datos, oportunidades de negocio o reputación</li>
              <li>Daños causados por terceros o fuerza mayor</li>
              <li>Uso inadecuado del Servicio por parte del usuario</li>
            </ul>
            <p className="mt-4">
              En cualquier caso, nuestra responsabilidad estará limitada al importe pagado por el usuario 
              en los últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnización</h2>
            <p>
              Usted acepta indemnizar y eximir de responsabilidad a Evoluxe's Project, sus empleados y 
              colaboradores frente a cualquier reclamación, pérdida o daño resultante de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Su uso del Servicio</li>
              <li>Violación de estos Términos de Uso</li>
              <li>Violación de derechos de terceros</li>
              <li>Contenido que usted proporcione o publique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Cancelación y Terminación</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">12.1 Por el Usuario</h3>
            <p>
              Puede cancelar su suscripción en cualquier momento desde su panel de control. La cancelación 
              será efectiva al final del período de facturación actual.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">12.2 Por Evoluxe's Project</h3>
            <p>
              Podemos suspender o cancelar su cuenta inmediatamente si:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Viola estos Términos de Uso</li>
              <li>Su pago es rechazado o impagado</li>
              <li>Realiza actividades fraudulentas o ilegales</li>
              <li>Solicita la eliminación de su cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Modificaciones de los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Los 
              cambios sustanciales serán notificados con al menos 30 días de antelación por correo 
              electrónico o mediante aviso en el Servicio.
            </p>
            <p className="mt-4">
              El uso continuado del Servicio después de la notificación constituye su aceptación de los 
              nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Integración con Terceros</h2>
            <p>
              El Servicio puede integrarse con plataformas de terceros (Google Analytics, Google Ads, etc.). 
              Estas integraciones están sujetas a los términos y políticas de privacidad de dichas 
              plataformas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. Legislación Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos de Uso se rigen por la legislación española. Para cualquier controversia 
              derivada de estos términos, las partes se someten a los Juzgados y Tribunales correspondientes 
              según la legislación vigente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">16. Resolución de Disputas</h2>
            <p>
              En caso de controversia, las partes acuerdan intentar resolver el conflicto de forma amistosa 
              mediante negociación directa antes de acudir a los tribunales competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">17. Disposiciones Generales</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Divisibilidad:</strong> Si alguna disposición de estos términos se considera 
                inválida, el resto permanecerá en vigor.
              </li>
              <li>
                <strong>Renuncia:</strong> La falta de ejercicio de un derecho no constituye renuncia al mismo.
              </li>
              <li>
                <strong>Cesión:</strong> No puede ceder estos términos sin nuestro consentimiento previo 
                por escrito.
              </li>
              <li>
                <strong>Acuerdo completo:</strong> Estos términos constituyen el acuerdo completo entre 
                las partes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">18. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos Términos de Uso, puede contactarnos en:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Correo electrónico:</strong> fcanamases@gmail.com</li>
              <li><strong>Teléfono:</strong> +34 609 955 494</li>
              <li><strong>Dirección:</strong> Gerani 31, 17240 Llagostera, España</li>
              <li><strong>Asunto:</strong> "Términos de Uso - [Su consulta]"</li>
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

export default TerminosUso;
