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

  // Cuando el trabajador está autenticado, cargamos todos los clientes administrativos
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

  // Vista de login para empleados
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

  // Vista principal con lista de clientes administrativos
  return (
    <Row style={{ minHeight: "80vh" }}>
      {/* Barra lateral */}
      <Column
        style={{
          flexBasis: "25%",
          maxWidth: "300px",
          borderRight: "1px solid var(--neutral-alpha-medium)",
          padding: "32px",
        }}
      >
        <Text variant="heading-default-xl" marginBottom="32">
          Portal administrativo
        </Text>
        <Button
          variant="tertiary"
          size="m"
          onClick={() => {
            setStaff(null);
            setClients([]);
            setEmail("");
            setPassword("");
          }}
        >
          Cerrar sesión
        </Button>
      </Column>

      {/* Contenido principal */}
      <Column style={{ flexGrow: 1, padding: "32px" }} gap="32">
        <Text variant="heading-default-xl">Datos de clientes</Text>

        {clients.length === 0 ? (
          <Text>No hay registros.</Text>
        ) : (
          clients.map((record, idx) => {
            // Eliminamos ID para no mostrarlo
            const filtered = Object.entries(record).filter(
              ([key]) => key !== "id"
            );

            return (
              <Column
                key={idx}
                gap="16"
                style={{
                  background: "var(--surface-primary)",
                  padding: "24px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: "1px solid var(--neutral-alpha-medium)",
                }}
              >
                <Text variant="heading-default-l">
                  Ficha del cliente
                </Text>

                <Column gap="12">
                  {filtered.map(([key, value]) => (
                    <Row
                      key={key}
                      horizontal="between"
                      gap="12"
                      style={{
                        paddingBottom: "8px",
                        borderBottom: "1px solid var(--neutral-alpha-weak)",
                      }}
                    >
                      <Text
                        variant="body-default-m"
                        style={{ fontWeight: 600 }}
                      >
                        {key.replace(/_/g, " ")}
                      </Text>

                      <Text
                        variant="body-default-m"
                        style={{ maxWidth: "500px", textAlign: "right" }}
                      >
                        {String(value)}
                      </Text>
                    </Row>
                  ))}
                </Column>
              </Column>
            );
          })
        )}
      </Column>
    </Row>
  );
}
