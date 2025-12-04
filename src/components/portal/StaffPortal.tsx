// src/components/portal/StaffPortal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Column,
  Row,
  Flex,
  Input,
  Button,
  Text,
} from "@once-ui-system/core";

// Tipado opcional para un registro de cliente administrativo
interface AdminClientRecord {
  [key: string]: any;
}

export default function StaffPortal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staff, setStaff] = useState<any | null>(null);
  const [clients, setClients] = useState<AdminClientRecord[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "plan">("info");
  const [error, setError] = useState<string | null>(null);

  // Manejo de login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Credenciales incorrectas");
      }

      const data = await res.json();
      setStaff(data.staff);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setStaff(null);
      setError(err.message ?? "Error inesperado");
    }
  };

  // Cargar clientes
  useEffect(() => {
    if (!staff) return;
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/admin-client-info");
        const json = await res.json();
        if (json.ok) {
          setClients(json.data);
        }
      } catch (e) {
        console.error("Error al cargar datos administrativos:", e);
      }
    };
    fetchClients();
  }, [staff]);

  // Si no hay login → mostrar login
  if (!staff) {
    return (
      <Flex horizontal="center" vertical="center" paddingTop="32">
        <Column gap="16" maxWidth="s" fillWidth>
          <Text variant="heading-default-xl" align="center">
            Portal administrativo
          </Text>

          <form onSubmit={handleLogin}>
            <Column gap="16" fillWidth>
              <Input
                id="staff-login-email"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />

              <Input
                id="staff-login-password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />

              {error && (
                <Text onBackground="accent-strong" align="center">
                  {error}
                </Text>
              )}

              <Button type="submit" size="l">
                Acceder
              </Button>
            </Column>
          </form>
        </Column>
      </Flex>
    );
  }

  return (
    <Row style={{ minHeight: "80vh" }}>
      {/* PANEL LATERAL */}
      <Column
        style={{
          flexBasis: "25%",
          maxWidth: "300px",
          borderRight: "1px solid var(--neutral-alpha-medium)",
          padding: "32px",
        }}
        gap="32"
      >
        <Text variant="heading-default-xl">Portal administrativo</Text>

        <Text variant="body-default-l" style={{ fontWeight: 600 }}>
          Clientes
        </Text>

        <Column gap="8">
          {clients.map((c, i) => (
            <Button
              key={i}
              variant={selectedClient === i ? "secondary" : "tertiary"}
              size="m"
              onClick={() => setSelectedClient(i)}
            >
              {c.client_name ?? "Cliente"}
            </Button>
          ))}
        </Column>

        <Button
          variant="tertiary"
          size="m"
          onClick={() => {
            setStaff(null);
            setClients([]);
            setSelectedClient(null);
          }}
        >
          Cerrar sesión
        </Button>
      </Column>

      {/* CONTENIDO */}
      <Column style={{ flexGrow: 1, padding: "32px" }} gap="32">
        {!clients.length || selectedClient === null ? (
          <Text>Selecciona un cliente en la lista.</Text>
        ) : (
          <>
            {/* PESTAÑAS */}
            <Row gap="16">
              <Button
                variant={activeTab === "info" ? "secondary" : "tertiary"}
                onClick={() => setActiveTab("info")}
              >
                Información
              </Button>

              <Button
                variant={activeTab === "plan" ? "secondary" : "tertiary"}
                onClick={() => setActiveTab("plan")}
              >
                Estado del plan
              </Button>
            </Row>

            {/* TARJETA PRINCIPAL */}
            <Column
              gap="16"
              style={{
                background: "var(--surface-primary)",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid var(--neutral-alpha-medium)",
              }}
            >
              {activeTab === "info" && (
                <>
                  <Text variant="heading-default-l">Ficha del cliente</Text>

                  {Object.entries(clients[selectedClient])
                    .filter(([key]) => key !== "id" && key !== "plan_state")
                    .map(([key, value]) => (
                      <Row
                        key={key}
                        horizontal="between"
                        style={{
                          paddingBottom: "8px",
                          borderBottom: "1px solid var(--neutral-alpha-weak)",
                        }}
                      >
                        <Text variant="body-default-m" style={{ fontWeight: 600 }}>
                          {key.replace(/_/g, " ")}
                        </Text>
                        <Text variant="body-default-m" style={{ textAlign: "right" }}>
                          {String(value)}
                        </Text>
                      </Row>
                    ))}
                </>
              )}

              {activeTab === "plan" && (
                <>
                  <Text variant="heading-default-l">Estado del plan</Text>

                  <Column gap="16">
                    <Row horizontal="between">
                      <Text variant="body-default-m" style={{ fontWeight: 600 }}>
                        Estado:
                      </Text>

                      <Text variant="body-default-m">
                        {clients[selectedClient].plan_state ?? "No definido"}
                      </Text>
                    </Row>

                    <Row horizontal="between">
                      <Text variant="body-default-m" style={{ fontWeight: 600 }}>
                        Plan contratado:
                      </Text>

                      <Text variant="body-default-m">
                        {clients[selectedClient].plan_status ?? "—"}
                      </Text>
                    </Row>
                  </Column>
                </>
              )}
            </Column>
          </>
        )}
      </Column>
    </Row>
  );
}
