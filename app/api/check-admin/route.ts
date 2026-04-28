import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

    console.log("ADMIN CHECK WALLET:", wallet);
    console.log("SUPABASE URL EXISTS:", !!SUPABASE_URL);
    console.log("SERVICE KEY EXISTS:", !!SUPABASE_SERVICE_ROLE_KEY);

    if (!wallet) {
      return NextResponse.json(
        { isAdmin: false, error: "Missing wallet" },
        { status: 400 }
      );
    }

    const cleanWallet = String(wallet).trim();

    const { data, error } = await supabaseAdmin
      .from("admin_wallets")
      .select("wallet, role, is_active")
      .eq("wallet", cleanWallet)
      .eq("is_active", true)
      .maybeSingle();

    console.log("ADMIN CHECK DATA:", data);
    console.log("ADMIN CHECK ERROR:", error);

    if (error || !data) {
      return NextResponse.json({ isAdmin: false, role: null, error });
    }

    return NextResponse.json({
      isAdmin: true,
      role: data.role,
      wallet: data.wallet,
    });
  } catch (error: any) {
    console.error("CHECK ADMIN CRASH:", error);

    return NextResponse.json(
      { isAdmin: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}