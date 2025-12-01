"use client";

import React, { useState } from "react";
import {
  Column,
  Row,
  Input,
  Button,
  Text,
  Flex,
} from "@once-ui-system/core";

interface Purchase {
  id: string;
  date: string;
  item: string;
  amount: number;
  status: string;
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface Client {
  email: string;
  name?: string;
  billingAddress?: string;
  phoneNumber?: string;
  purchases: Purchase[];
  payments: Payment[];
}

export default function ClientPortal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Por favor, utilice una dirección de Gmail");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Credenciales incorrectas");
      }

      const data = await res.json();
      setClient(data.client);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setClient(null);
      setError(err.message ?? "Error inesperado");
    }
  };

  const handleCancelPayment = (paymentId: string) => {
    if (!client) return;

    const updatedPayments = client.payments.map((payment) =>
      payment.id === paymentId ? { ...payment, status: "cancelado" } : payment
    );

    setClient({ ...client, payments: updatedPayments });
  };

  if (client) {
    return (
      <Row style={{ minHeight: "80vh" }}>
        {/* Left sidebar */}
        <Column
          style={{
            flexBasis: "25%",
            maxWidth: "300px",
            borderRight: "1px solid var(--neutral-alpha-medium)",
            padding: "32px",
          }}
        >
          <Text variant="heading-strong-xl" marginBottom="32">
            Portal de cliente
          </Text>
          <Button
            variant="tertiary"
            size="m"
            onClick={() => {
              setClient(null);
              setEmail("");
              setPassword("");
            }}
          >
            Cerrar sesión
          </Button>
        </Column>

        {/* Main content */}
        <Column style={{ flexGrow: 1, padding: "32px" }} gap="40">
          {/* Payments */}
          <Column gap="16">
            <Text variant="heading-strong-xl">Método de pago</Text>

            {client.payments.length === 0 ? (
              <Text>Sin método de pago.</Text>
            ) : (
              client.payments.map((p, idx) => (
                <Row
                  key={idx}
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--neutral-alpha-weak)",
                    padding: "8px 0",
                  }}
                >
                  <Column>
                    <Text variant="body-default-m">{p.description}</Text>
                    <Text variant="caption">{p.date}</Text>
                  </Column>

                  <Column style={{ alignItems: "flex-end" }}>
                    <Text variant="body-default-m">{p.amount.toFixed(2)} €</Text>
                    <Text variant="caption">{p.status}</Text>

                    {p.status !== "cancelado" && (
                      <Button
                        variant="secondary"
                        size="s"
                        onClick={() => handleCancelPayment(p.id)}
                        style={{ marginTop: "4px" }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Column>
                </Row>
              ))
            )}
          </Column>

          {/* Billing Info */}
          <Column gap="16">
            <Text variant="heading-strong-xl">Información de facturación</Text>

            {!editing ? (
              <>
                {client.name && (
                  <Row>
                    <Text variant="body-default-m" style={{ width: "120px" }}>
                      Nombre
                    </Text>
                    <Text>{client.name}</Text>
                  </Row>
                )}

                {client.billingAddress && (
                  <Row>
                    <Text variant="body-default-m" style={{ width: "120px" }}>
                      Dirección
                    </Text>
                    <Text>{client.billingAddress}</Text>
                  </Row>
                )}

                {client.phoneNumber && (
                  <Row>
                    <Text variant="body-default-m" style={{ width: "120px" }}>
                      Teléfono
                    </Text>
                    <Text>{client.phoneNumber}</Text>
                  </Row>
                )}

                <Button
                  variant="tertiary"
                  size="s"
                  onClick={() => {
                    setEditing(true);
                    setEditName(client.name ?? "");
                    setEditAddress(client.billingAddress ?? "");
                    setEditPhone(client.phoneNumber ?? "");
                  }}
                >
                  Actualizar información
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={editName}
                  onChange={(e: any) => setEditName(e.target.value)}
                  fillWidth
                />
                <Input
                  type="text"
                  placeholder="Dirección"
                  value={editAddress}
                  onChange={(e: any) => setEditAddress(e.target.value)}
                  fillWidth
                />
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  value={editPhone}
                  onChange={(e: any) => setEditPhone(e.target.value)}
                  fillWidth
                />

                <Row gap="8">
                  <Button
                    variant="primary"
                    size="s"
                    onClick={async () => {
                      const updates: any = {
                        name: editName,
                        billingAddress: editAddress,
                        phoneNumber: editPhone,
                      };

                      try {
                        const res = await fetch("/api/update-client", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: client.email,
                            updates,
                          }),
                        });

                        if (!res.ok) {
                          const errData = await res.json();
                          throw new Error(errData.message);
                        }

                        const data = await res.json();
                        setClient({ ...client, ...data.client });
                        setEditing(false);
                      } catch (err: any) {
                        alert(err.message || "Error al guardar cambios");
                      }
                    }}
                  >
                    Guardar
                  </Button>

                  <Button
                    variant="secondary"
                    size="s"
                    onClick={() => setEditing(false)}
                  >
                    Cancelar
                  </Button>
                </Row>
              </>
            )}
          </Column>

          {/* Purchase History */}
          <Column gap="16">
            <Text variant="heading-strong-xl">Historial de compras</Text>

            {client.purchases.length === 0 ? (
              <Text>No hay compras.</Text>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "8px" }}>ID</th>
                      <th style={{ padding: "8px" }}>Fecha</th>
                      <th style={{ padding: "8px" }}>Artículo</th>
                      <th style={{ padding: "8px" }}>Monto</th>
                      <th style={{ padding: "8px" }}>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {client.purchases.map((p, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px" }}>{p.id}</td>
                        <td style={{ padding: "8px" }}>{p.date}</td>
                        <td style={{ padding: "8px" }}>{p.item}</td>
                        <td style={{ padding: "8px" }}>
                          {p.amount.toFixed(2)} €
                        </td>
                        <td style={{ padding: "8px" }}>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Column>
        </Column>
      </Row>
    );
  }

  return (
    <Flex justify="center" align="center" paddingTop="32">
      <Column gap="16" maxWidth="s" fillWidth>
        <Text variant="heading-strong-xl" align="center">
          Portal para clientes
        </Text>

        <form onSubmit={handleLogin}>
          <Column gap="16" fillWidth>
            <Input
              type="email"
              placeholder="Correo de Gmail"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              fillWidth
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              fillWidth
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
