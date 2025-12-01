import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Missing email or password" },
      { status: 400 }
    );
  }

  // Buscar usuario en Supabase
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .maybeSingle();

  if (error || !client) {
    return NextResponse.json(
      { ok: false, message: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  if (!client.authorized) {
    return NextResponse.json(
      { ok: false, message: "Acceso no autorizado" },
      { status: 403 }
    );
  }

  // Convertimos los nombres de columna a lo que usa React
  return NextResponse.json({
    ok: true,
    client: {
      email: client.email,
      name: client.name,
      billingAddress: client.billing_address,
      phoneNumber: client.phone_number,
      purchases: client.purchases ?? [],
      payments: client.payments ?? []
    }
  });
}
