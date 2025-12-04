// src/app/api/staff-login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Utiliza la misma inicialización que en otros endpoints
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Faltan email o contraseña" },
      { status: 400 },
    );
  }

  // Buscar usuario en la tabla staff_users con las mismas credenciales
  const { data: staff, error } = await supabase
    .from("staff_users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .maybeSingle();

  if (error || !staff) {
    return NextResponse.json(
      { ok: false, message: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  // Devuelve el registro completo del trabajador (lo usaremos solo para marcar que ha hecho login)
  return NextResponse.json({ ok: true, staff });
}
