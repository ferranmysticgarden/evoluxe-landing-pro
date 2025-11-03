import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AvisoLegal = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Aviso Legal</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Datos Identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad 
              de la Información y Comercio Electrónico, se informa a los usuarios del sitio web sobre los 
              datos identificativos del titular:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Denominación social:</strong> Evoluxe's Project</li>
              <li><strong>Dirección:</strong> Gerani 31, 17240 Llagostera, España</li>
              <li><strong>Teléfono:</strong> +34 609 955 494</li>
              <li><strong>Correo electrónico:</strong> fcanamases@gmail.com</li>
              <li><strong>Sitio web:</strong> www.evoluxeproject.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Objeto</h2>
            <p>
              El presente aviso legal regula el uso y utilización del sitio web Evoluxe's Project, del que 
              es titular la entidad arriba mencionada. La navegación por el sitio web atribuye la condición 
              de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las 
              disposiciones incluidas en este Aviso Legal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Servicios</h2>
            <p>
              A través del sitio web, Evoluxe's Project facilita a los usuarios el acceso y la utilización 
              de una herramienta profesional de análisis SEO que incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Análisis de palabras clave y métricas SEO avanzadas</li>
              <li>Monitorización de rankings en buscadores</li>
              <li>Auditorías técnicas de sitios web</li>
              <li>Análisis de competencia y backlinks</li>
              <li>Generación de reportes personalizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Responsabilidades</h2>
            <p>
              El titular del sitio web no se hace responsable de la información y contenidos almacenados 
              por los usuarios. El usuario será el único responsable de la veracidad, exactitud, vigencia 
              y autenticidad de los datos e información facilitada.
            </p>
            <p className="mt-4">
              Evoluxe's Project se reserva el derecho a modificar cualquier tipo de información que pudiera 
              aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de 
              los usuarios dichas modificaciones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos del sitio web, incluyendo, sin carácter limitativo, textos, fotografías, 
              gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o 
              sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de Evoluxe's 
              Project o de terceros.
            </p>
            <p className="mt-4">
              Queda prohibida la reproducción, distribución, comunicación pública y transformación de 
              cualquier contenido del sitio web sin la autorización expresa y por escrito del titular.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Exención de Responsabilidad</h2>
            <p>
              El titular del sitio web no garantiza la ausencia de virus u otros elementos lesivos que 
              pudieran causar daños o alteraciones en el sistema informático, documentos o ficheros del 
              usuario. En consecuencia, no será responsable de los daños y perjuicios que pudieran derivarse.
            </p>
            <p className="mt-4">
              Evoluxe's Project no se hace responsable de los daños y perjuicios de cualquier naturaleza 
              que pudieran derivarse de la falta de disponibilidad, continuidad o calidad del funcionamiento 
              del sitio web y de los servicios ofrecidos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Enlaces a Terceros</h2>
            <p>
              El sitio web puede contener enlaces a sitios web de terceros. Evoluxe's Project no asume 
              ninguna responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web 
              de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Legislación Aplicable</h2>
            <p>
              Para la resolución de cualquier controversia o cuestión relacionada con el presente sitio web 
              o con las actividades en él desarrolladas, será de aplicación la legislación española, a cuyos 
              Juzgados y Tribunales se someten expresamente las partes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contacto</h2>
            <p>
              Para cualquier consulta, sugerencia o reclamación relacionada con este Aviso Legal, puede 
              contactar con nosotros a través de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Correo electrónico:</strong> fcanamases@gmail.com</li>
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

export default AvisoLegal;
