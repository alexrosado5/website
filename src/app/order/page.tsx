"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Column,
  Heading,
  Text,
  Input,
  Button,
  Schema,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";

export default function OrderPage() {
  const params = useSearchParams();
  const plan = params.get("plan") || "";
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleChange = (field: string) => (e: any) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // 🔹 ÚNICO CAMBIO: handleSubmit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
      }),
    });

    setSubmitted(true);
  };

  const planLabel: Record<string, string> = {
    chatbot: "Chatbot Personalizable",
    plugin: "Plugin Automático",
    automation: "Automatización de Procesos",
  };

  return (
    <Column maxWidth="s" horizontal="center" paddingY="12">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/order"
        title="Solicitar producto"
        description="Formulario de solicitud de productos"
      />
      <Heading variant="display-strong-l" align="center">
        {planLabel[plan] ?? "Plan personalizado"}
      </Heading>
      <Text
        wrap="balance"
        onBackground="neutral-weak"
        align="center"
        marginTop="8"
        marginBottom="24"
      >
        {plan === "automation"
          ? "Por favor indícanos tus datos y nos pondremos en contacto contigo para elaborar un presupuesto a medida."
          : "Introduce tus datos para completar tu solicitud. Nuestro equipo se pondrá en contacto contigo para confirmar el servicio."}
      </Text>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <Column gap="16" fillWidth>
            <Input
              id="name"
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange("name")}
              required
            />
            <Input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
            <Input
              id="phone"
              type="tel"
              placeholder="Número de teléfono"
              value={form.phone}
              onChange={handleChange("phone")}
              required
            />
            <Input
              id="company"
              type="text"
              placeholder="Empresa (opcional)"
              value={form.company}
              onChange={handleChange("company")}
            />
            <Button type="submit" variant="primary" size="m">
              Enviar solicitud
            </Button>
          </Column>
        </form>
      ) : (
        <Text
          align="center"
          variant="heading-default-m"
          onBackground="accent-strong"
        >
          ¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto
          contigo pronto.
        </Text>
      )}
    </Column>
  );
}
