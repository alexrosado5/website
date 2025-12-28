import {
    Column,
    Heading,
    Text,
    Button,
    Schema,
    Meta,
  } from "@once-ui-system/core";
  import { baseURL } from "@/resources";
  
  export async function generateMetadata() {
    return Meta.generate({
      title: "Planes y precios - PixelShield Agency",
      description:
        "Descubre nuestros planes de chatbots personalizables, plugins automáticos y automatización de procesos.",
      baseURL,
      path: "/pricing",
    });
  }
  
  export default function PricingPage() {
    return (
      <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
        <Schema
          as="webPage"
          baseURL={baseURL}
          path="/pricing"
          title="Planes y precios"
          description="Descubre nuestros planes de automatización"
          image={`/api/og/generate?title=${encodeURIComponent(
            "Planes y precios"
          )}`}
        />
        <Heading variant="display-strong-l" wrap="balance" align="center">
          Planes y precios
        </Heading>
  
        {/* Plan Chatbot */}
        <Column
          style={{
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "600px",
            padding: "24px",
          }}
          gap="12"
        >
          <Heading variant="display-strong-m">Chatbot Personalizable</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Setup: 30 € · Mantenimiento: 30 €/mes (primer mes al 50 %).
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Obtén un chatbot adaptable a tus necesidades. Mejora la atención al
            cliente y automatiza consultas frecuentes.
          </Text>
          <Button
            variant="primary"
            size="m"
            href="/order?plan=chatbot"
            style={{ marginTop: "16px" }}
          >
            Contratar Chatbot
          </Button>
        </Column>
  
        {/* Plan Plugin */}
        <Column
          style={{
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "600px",
            padding: "24px",
          }}
          gap="12"
        >
          <Heading variant="display-strong-m">Plugin Automático</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Setup: 30 € · Mantenimiento: 45 €/mes.
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Elija el plugin que mejor se adapte a su empresa. Automatice acciones
            y procesos clave con la flexibilidad que necesita.
          </Text>
          <Button
            variant="primary"
            size="m"
            href="/order?plan=plugin"
            style={{ marginTop: "16px" }}
          >
            Solicitar Plugin
          </Button>
        </Column>
  
        {/* Plan Automatización */}
        <Column
          style={{
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "600px",
            padding: "24px",
          }}
          gap="12"
        >
          <Heading variant="display-strong-m">
            Automatización de Procesos
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Setup + mantenimiento: precio según proyecto.
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Diseñamos soluciones de automatización a medida para optimizar
            procesos complejos. Contáctanos para un presupuesto personalizado.
          </Text>
          <Button
            variant="primary"
            size="m"
            href="/order?plan=automation"
            style={{ marginTop: "16px" }}
          >
            Solicitar Propuesta
          </Button>
        </Column>
      </Column>
    );
  }
  