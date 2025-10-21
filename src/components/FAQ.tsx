import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona la prueba gratuita de 14 días?",
    answer: "Puedes probar todas las funcionalidades del plan Professional sin ningún compromiso. No se requiere tarjeta de crédito para empezar. Al finalizar los 14 días, puedes elegir el plan que mejor se adapte a tus necesidades."
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu panel de control. Los cambios se reflejarán inmediatamente y se prorratearán en tu próxima factura."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) a través de Stripe, y también PayPal. Todas las transacciones están cifradas y son 100% seguras."
  },
  {
    question: "¿Los datos están protegidos según el RGPD?",
    answer: "Absolutamente. Cumplimos al 100% con el RGPD y todas las normativas europeas de protección de datos. Tus datos están cifrados y nunca los compartimos con terceros sin tu consentimiento explícito."
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer: "Sí, todos los planes incluyen soporte por email. Los planes Professional y Enterprise tienen soporte prioritario, y el plan Enterprise incluye un account manager dedicado con soporte 24/7."
  },
  {
    question: "¿Puedo exportar mis datos?",
    answer: "Sí, puedes exportar todos tus datos en cualquier momento en formatos CSV, Excel o PDF. También ofrecemos acceso completo a nuestra API en los planes Professional y Enterprise."
  },
  {
    question: "¿Con qué frecuencia se actualizan los datos?",
    answer: "Los datos de rankings se actualizan diariamente. Las auditorías técnicas se pueden ejecutar bajo demanda las veces que necesites. Los datos de backlinks se actualizan semanalmente."
  },
  {
    question: "¿Ofrecen descuentos por pago anual?",
    answer: "Sí, ofrecemos un 20% de descuento en todos los planes si eliges la facturación anual. Contacta con nuestro equipo de ventas para más detalles."
  }
];

const FAQ = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground md:text-5xl">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Todo lo que necesitas saber sobre Evoluxe's Project
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-card-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            ¿Tienes más preguntas?
          </p>
          <a 
            href="mailto:support@evoluxe.com" 
            className="text-primary hover:underline font-medium"
          >
            Contacta con nuestro equipo
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
