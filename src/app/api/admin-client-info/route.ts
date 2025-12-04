// src/app/api/admin-client-info/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data, error } = await supabase
    .from("admin_client_info")
    .select("*");

  if (error) {
    return NextResponse.json(
      { ok: false, message: "Error al obtener los datos" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data });
}
