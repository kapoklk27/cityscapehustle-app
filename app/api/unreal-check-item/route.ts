import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const wallet = searchParams.get("wallet");
    const item = searchParams.get("item");

    if (!wallet || !item) {
      return NextResponse.json(
        { success: false, owns: false, error: "Missing wallet or item" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("inventory")
      .select("id, wallet, item_name")
      .eq("wallet", wallet)
      .eq("item_name", item)
      .limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, owns: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet,
      item,
      owns: !!data && data.length > 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, owns: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}