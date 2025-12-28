import {
  Column,
  Heading,
  Text,
  Button,
  Schema,
  Meta,
  Badge,
  Row,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: "Planes y precios - PixelShield Agency",
    description:
      "Chatbots inteligentes, plugins automáticos y automatización de procesos para escalar tu negocio.",
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
        description="Planes flexibles de automatización y desarrollo digital"
        image={`/api/og/generate?title=${encodeURIComponent(
          "Planes y precios"
        )}`}
      />

      {/* TÍTULO */}
      <Column gap="8" align="center">
        <Heading variant="display-strong-l" wrap="balance" align="center">
          Planes diseñados para crecer contigo
        </Heading>
        <Text onBackground="neutral-weak" align="center">
          Automatiza, optimiza y escala tu negocio con soluciones creadas a
          medida.
        </Text>
      </Column>

      {/* CHATBOT */}
      <Column
        gap="16"
        style={{
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "640px",
          padding: "28px",
          background: "var(--surface-primary)",
        }}
      >
        <Row gap="12" vertical="center">
          <Heading variant="display-strong-m">Chatbot Personalizable</Heading>
          <Badge background="accent-alpha-weak" onBackground="accent-strong">
            Más popular
          </Badge>
        </Row>

        <Text onBackground="neutral-weak">
          Ideal para empresas que quieren mejorar su atención al cliente y
          automatizar respuestas 24/7.
        </Text>

        <Column gap="4">
          <Text>
            <strong>Setup:</strong> 30 €
          </Text>
          <Text>
            <strong>Mantenimiento:</strong> 30 €/mes
          </Text>
          <Text onBackground="accent-strong">
            🔥 Oferta limitada: primer mes al <strong>50 %</strong>
          </Text>
        </Column>

        <Button
          variant="primary"
          size="m"
          href="/order?plan=chatbot"
          style={{ marginTop: "12px" }}
        >
          Contratar Chatbot
        </Button>
      </Column>

      {/* PLUGIN */}
      <Column
        gap="16"
        style={{
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "640px",
          padding: "28px",
          background: "var(--surface-primary)",
        }}
      >
        <Heading variant="display-strong-m">Plugin Automático</Heading>

        <Text onBackground="neutral-weak">
          Desarrollo de plugins personalizados adaptados a las necesidades de tu
          empresa.
        </Text>

        <Column gap="4">
          <Text>
            <strong>Setup:</strong> 30 €
          </Text>
          <Text>
            <strong>Mantenimiento:</strong> 45 €/mes
          </Text>
        </Column>

        <Text onBackground="neutral-weak">
          Perfecto para automatizar formularios, procesos internos, integraciones
          o funcionalidades avanzadas.
        </Text>

        <Button
          variant="secondary"
          size="m"
          href="/order?plan=plugin"
          style={{ marginTop: "12px" }}
        >
          Solicitar Plugin
        </Button>
      </Column>

      {/* AUTOMATIZACIÓN */}
      <Column
        gap="16"
        style={{
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "640px",
          padding: "28px",
          background: "var(--surface-primary)",
        }}
      >
        <Heading variant="display-strong-m">
          Automatización de Procesos
        </Heading>

        <Text onBackground="neutral-weak">
          Soluciones avanzadas a medida para empresas que buscan escalar sin
          límites.
        </Text>

        <Text>
          <strong>Precio:</strong> según alcance del proyecto
        </Text>

        <Text onBackground="neutral-weak">
          Analizamos tu caso, diseñamos la automatización y te proponemos la
          mejor solución técnica y económica.
        </Text>

        <Button
          variant="tertiary"
          size="m"
          href="/order?plan=automation"
          style={{ marginTop: "12px" }}
        >
          Solicitar propuesta personalizada
        </Button>
      </Column>
    </Column>
  );
}
