import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 👉 GET: leer solicitudes (Staff Portal)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, data: [] },
      { status: 200 } // ⚠️ importante: SIEMPRE JSON
    );
  }
}

// 👉 POST: crear solicitud (Formulario)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, name, email, phone, company } = body;

    if (!plan || !name || !email || !phone) {
      return NextResponse.json(
        { ok: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert([
      { plan, name, email, phone, company },
    ]);

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
