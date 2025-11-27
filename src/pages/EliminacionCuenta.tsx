import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EliminacionCuenta = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Eliminación de cuenta
          </h1>
          <p className="text-muted-foreground mb-4">
            En cumplimiento del Reglamento General de Protección de Datos (RGPD) y de la
            normativa española de protección de datos, puedes solicitar la eliminación
            completa de tu cuenta y de los datos personales asociados.
          </p>
          <p className="text-muted-foreground mb-4">
            Para garantizar tu seguridad, gestionamos la eliminación de cuentas de forma
            manual y verificada.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">
            ¿Cómo solicitar la eliminación de tu cuenta?
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
            <li>Escribe un correo electrónico desde la misma dirección con la que te registraste.</li>
            <li>
              Envía el email a {" "}
              <a
                href="mailto:fcanamases@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta"
                className="text-primary hover:underline"
              >
                fcanamases@gmail.com
              </a>{" "}
              indicando en el asunto: <strong>"Solicitud de eliminación de cuenta"</strong>.
            </li>
            <li>
              En el cuerpo del mensaje, incluye:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Tu nombre y apellidos (opcional).</li>
                <li>El email de acceso a la cuenta.</li>
                <li>Confirmación explícita de que deseas eliminar tu cuenta y todos tus datos.</li>
              </ul>
            </li>
          </ol>
          <p className="text-muted-foreground mb-4">
            Una vez recibida tu solicitud, verificaremos la identidad del solicitante y
            procederemos a eliminar la cuenta y los datos asociados en un plazo máximo de
            <strong> 30 días naturales</strong>. Te enviaremos un correo de confirmación cuando
            el proceso se haya completado.
          </p>
          <p className="text-muted-foreground">
            Si tienes cualquier duda adicional sobre privacidad o protección de datos,
            también puedes escribirnos a la misma dirección de correo.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EliminacionCuenta;
