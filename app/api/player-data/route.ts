import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zojwqvmygybsobglixyy.supabase.co";
const supabaseAnonKey = "sb_publishable_8VfmwvQSBhCGvM9ZfMuRjg_fCyoLkwn";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "wallet is required" },
        { status: 400 }
      );
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("wallet", wallet)
      .maybeSingle();

    const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .select("*")
      .eq("wallet", wallet)
      .order("created_at", { ascending: false });

    const { data: purchases, error: purchasesError } = await supabase
      .from("purchases")
      .select("*")
      .eq("wallet", wallet)
      .order("created_at", { ascending: false });

    if (playerError) {
      return NextResponse.json(
        { error: "player query failed", details: playerError },
        { status: 500 }
      );
    }

    if (inventoryError) {
      return NextResponse.json(
        { error: "inventory query failed", details: inventoryError },
        { status: 500 }
      );
    }

    if (purchasesError) {
      return NextResponse.json(
        { error: "purchases query failed", details: purchasesError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet,
      player,
      inventory: inventory || [],
      purchases: purchases || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected server error", details: error },
      { status: 500 }
    );
  }
}