"use client";

// Updated ClientPortal component to use Once UI Core typography variants that
// are supported in the latest version of the library.  The former variants
// like `body-strong` and `heading-strong-xl` were removed in favor of size‐
// specific defaults (e.g. `body-default-s`, `heading-default-xl`).  To
// preserve the bold weight for certain fields we also supply a custom
// `fontWeight` style where appropriate.

import React, { useState } from "react";
import {
  Column,
  Row,
  Input,
  Button,
  Text,
  Flex,
} from "@once-ui-system/core";

/**
 * Client portal component.
 *
 * When first rendered this component shows a simple login form asking
 * the user for their email address and password. On submit it POSTs
 * to `/api/login` and expects a JSON response containing the
 * associated client record. If the login succeeds it displays two
 * sections: one for past purchases and another for active payments.
 * Each payment row includes a “Cancelar” button that simply updates
 * the local state to mark that payment as cancelled. In a real
 * application this button would call an API route that performs a
 * cancellation in your payment provider (e.g. Stripe).
 */
interface Purchase {
  id: string;
  date: string;
  item: string;
  amount: number;
  status: string;
  /**
   * Optional URL to a PDF receipt for this purchase. When provided
   * the UI will render a download link; otherwise a fallback text
   * "No disponible" is displayed. Storing the URL here allows the
   * purchase history table to display a per‑purchase download link.
   */
  pdfUrl?: string;
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
  // State to handle editing of billing information
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // State to handle adding or updating the payment method. When `addingPayment`
  // is true the form for entering new payment details is displayed. We keep
  // separate state for the chosen method type (e.g. "Tarjeta", "PayPal") and
  // the raw details (card number or account identifier). These values are
  // cleared once a new payment has been saved or the form is cancelled.
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newPaymentDetails, setNewPaymentDetails] = useState("");

  /**
   * Persist a newly entered payment method. We generate a masked description
   * from the user input so that sensitive data such as full card numbers are
   * never rendered on screen. After creating a `Payment` object we call the
   * `/api/update-client` route to store the updated payments array in
   * Supabase. On success the local client state is updated and the form
   * fields are reset.
   */
  const handleAddPayment = async () => {
    if (!client) return;
    // Derive a short description: for cards show last 4 digits, otherwise
    // display the method name (e.g. PayPal) to avoid revealing private info.
    const cleanMethod = newPaymentMethod.trim();
    const cleanDetails = newPaymentDetails.trim();
    if (!cleanMethod || !cleanDetails) return;
    let description = cleanMethod;
    // If the method contains "tarjeta" or "card", mask the number
    const lowerMethod = cleanMethod.toLowerCase();
    if (lowerMethod.includes("tarjeta") || lowerMethod.includes("card")) {
      const digits = cleanDetails.replace(/\D+/g, "");
      const last4 = digits.slice(-4) || "XXXX";
      description = `${cleanMethod} ****${last4}`;
    }
    // Create new payment object; use current date in ISO local format
    const newPayment: Payment = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("es-ES"),
      description,
      amount: 0,
      status: "activo",
    };
    const updatedPayments = [...client.payments, newPayment];
    try {
      const res = await fetch("/api/update-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: client.email, updates: { payments: updatedPayments } }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar método de pago");
      }
      // Update local state to include the new payment method
      setClient({ ...client, payments: updatedPayments });
      // Reset form state
      setAddingPayment(false);
      setNewPaymentMethod("");
      setNewPaymentDetails("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al guardar método de pago");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    // Only allow Gmail addresses as requested by the client. This simple check
    // validates the domain before sending a request to the server.
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Por favor, utilice una dirección de Gmail");
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    // In a real application you would call an API route here to cancel
    // the payment with your payment provider. For now we just update the
    // local state to mark it as cancelled.
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
          <Text variant="heading-default-xl" marginBottom="32">
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
        <Column
          style={{ flexGrow: 1, padding: "32px" }}
          gap="40"
        >
          {/* Payment method / subscriptions section */}
          <Column gap="16">
            <Text variant="heading-default-xl">Método de pago</Text>
            {/* Render existing payment methods if any */}
            {client.payments.length > 0 &&
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
                    {/* Use body-default-s for small text and apply bold weight manually */}
                    <Text
                      variant="body-default-s"
                      style={{ fontWeight: "bold" }}
                    >
                      {p.description}
                    </Text>
                    {/* Use body-default-xs variant for caption-like text and neutral-weak color */}
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {p.date}
                    </Text>
                  </Column>
                  <Column style={{ alignItems: "flex-end" }}>
                    <Text
                      variant="body-default-s"
                      style={{ fontWeight: "bold" }}
                    >
                      {p.amount.toFixed(2)} €
                    </Text>
                    {/* Replace deprecated caption variant with body-default-xs and a weak neutral color */}
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {p.status}
                    </Text>
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
              ))}
            {client.payments.length === 0 && (
              <Text>No hay método de pago.</Text>
            )}
            {/* Toggleable form to update payment method */}
            {!addingPayment ? (
              <Button
                variant="tertiary"
                size="s"
                onClick={() => setAddingPayment(true)}
              >
                Actualizar método de pago
              </Button>
            ) : (
              <>
                <Input
                  id="payment-method"
                  type="text"
                  placeholder="Método de pago (ej. Tarjeta, PayPal)"
                  value={newPaymentMethod}
                  onChange={(e: any) => setNewPaymentMethod(e.target.value)}
                />
                <Input
                  id="payment-details"
                  type="text"
                  placeholder="Datos (número de tarjeta o cuenta)"
                  value={newPaymentDetails}
                  onChange={(e: any) => setNewPaymentDetails(e.target.value)}
                />
                <Row gap="8">
                  <Button
                    variant="primary"
                    size="s"
                    onClick={handleAddPayment}
                  >
                    Guardar método de pago
                  </Button>
                  <Button
                    variant="secondary"
                    size="s"
                    onClick={() => {
                      setAddingPayment(false);
                      setNewPaymentMethod("");
                      setNewPaymentDetails("");
                    }}
                  >
                    Cancelar
                  </Button>
                </Row>
              </>
            )}
          </Column>

          {/* Billing information section */}
          <Column gap="16">
            <Text variant="heading-default-xl">Información de facturación</Text>
            {!editing ? (
              <>
                {client.name && (
                  <Row style={{ marginBottom: "4px" }}>
                    <Text
                      variant="body-default-s"
                      style={{ width: "120px", fontWeight: "bold" }}
                    >
                      Nombre
                    </Text>
                    <Text>{client.name}</Text>
                  </Row>
                )}
                {client.billingAddress && (
                  <Row style={{ marginBottom: "4px" }}>
                    <Text
                      variant="body-default-s"
                      style={{ width: "120px", fontWeight: "bold" }}
                    >
                      Dirección
                    </Text>
                    <Text>{client.billingAddress}</Text>
                  </Row>
                )}
                {client.phoneNumber && (
                  <Row style={{ marginBottom: "4px" }}>
                    <Text
                      variant="body-default-s"
                      style={{ width: "120px", fontWeight: "bold" }}
                    >
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
                  id="edit-name"
                  type="text"
                  placeholder="Nombre"
                  value={editName}
                  onChange={(e: any) => setEditName(e.target.value)}
                />
                <Input
                  id="edit-address"
                  type="text"
                  placeholder="Dirección"
                  value={editAddress}
                  onChange={(e: any) => setEditAddress(e.target.value)}
                />
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="Teléfono"
                  value={editPhone}
                  onChange={(e: any) => setEditPhone(e.target.value)}
                />
                <Row gap="8">
                  <Button
                    variant="primary"
                    size="s"
                    onClick={async () => {
                      // Build updates object
                      const updates: any = {
                        name: editName,
                        billingAddress: editAddress,
                        phoneNumber: editPhone,
                      };
                      try {
                        // Persist changes via API
                        const res = await fetch("/api/update-client", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: client.email, updates }),
                        });
                        if (!res.ok) {
                          const errData = await res.json();
                          throw new Error(errData.message || "Error al guardar cambios");
                        }
                        const data = await res.json();
                        // Update local state with returned client
                        setClient({
                          ...client,
                          ...data.client,
                        });
                        setEditing(false);
                      } catch (err: any) {
                        console.error(err);
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

          {/* Invoice / purchase history section */}
          <Column gap="16">
            <Text variant="heading-default-xl">Historial de compras</Text>
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
                    <tr
                      style={{
                        borderBottom: "1px solid var(--neutral-alpha-medium)",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "8px" }}>ID</th>
                      <th style={{ padding: "8px" }}>Fecha</th>
                      <th style={{ padding: "8px" }}>Artículo</th>
                      <th style={{ padding: "8px" }}>Monto</th>
                      <th style={{ padding: "8px" }}>Estado</th>
                      {/* Columna para enlace al recibo PDF */}
                      <th style={{ padding: "8px" }}>Recibo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.purchases.map((p, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid var(--neutral-alpha-weak)",
                          background:
                            idx % 2 === 0
                              ? "var(--neutral-alpha-ultra-weak)"
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "8px" }}>{p.id}</td>
                        <td style={{ padding: "8px" }}>{p.date}</td>
                        <td style={{ padding: "8px" }}>{p.item}</td>
                        <td style={{ padding: "8px" }}>{p.amount.toFixed(2)} €</td>
                        <td style={{ padding: "8px" }}>{p.status}</td>
                        {/* Nueva celda: enlace al recibo PDF si existe */}
                        <td style={{ padding: "8px" }}>
                          {p.pdfUrl ? (
                            <a
                              href={p.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--accent-strong)" }}
                            >
                              Descargar PDF
                            </a>
                          ) : (
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                              No disponible
                            </Text>
                          )}
                        </td>
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

  // Login form
  return (
    <Flex horizontal="center" vertical="center" paddingTop="32">
      <Column gap="16" maxWidth="s" fillWidth>
        <Text variant="heading-default-xl" align="center">
          Portal para clientes
        </Text>

        <form onSubmit={handleLogin}>
          <Column gap="16" fillWidth>
            <Input
              id="login-email"
              type="email"
              placeholder="Correo de Gmail"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            <Input
              id="login-password"
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