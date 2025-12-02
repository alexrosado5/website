import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, updates } = body;

    if (!email || typeof updates !== "object") {
      return NextResponse.json(
        { ok: false, message: "Missing email or updates." },
        { status: 400 }
      );
    }

    // Convertir nombres a formato de columnas reales
    const mappedUpdates: any = {};
    if ("name" in updates) mappedUpdates.name = updates.name;
    if ("billingAddress" in updates) mappedUpdates.billing_address = updates.billingAddress;
    if ("phoneNumber" in updates) mappedUpdates.phone_number = updates.phoneNumber;
    if ("purchases" in updates) mappedUpdates.purchases = updates.purchases;
    if ("payments" in updates) mappedUpdates.payments = updates.payments;
    if ("authorized" in updates) mappedUpdates.authorized = updates.authorized;

    const { data, error } = await supabase
      .from("clients")
      .update(mappedUpdates)
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to update user in Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      client: {
        email: data.email,
        name: data.name,
        billingAddress: data.billing_address,
        phoneNumber: data.phone_number,
        purchases: data.purchases ?? [],
        payments: data.payments ?? []
      }
    });
  } catch (err) {
    console.error("Unexpected error in update-client API:", err);
    return NextResponse.json(
      { ok: false, message: "Server error." },
      { status: 500 }
    );
  }
}
