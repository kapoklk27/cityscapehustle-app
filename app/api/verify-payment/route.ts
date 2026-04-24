import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { createClient } from "@supabase/supabase-js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT || "";
const RECEIVER_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || "";
const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "9");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { signature, wallet, amount, itemName, price } = body;

    if (!signature || !wallet || !amount) {
      return NextResponse.json(
        { error: "Missing signature, wallet or amount" },
        { status: 400 }
      );
    }

    if (!TOKEN_MINT || !RECEIVER_WALLET) {
      return NextResponse.json(
        { error: "Server token config missing" },
        { status: 500 }
      );
    }

    const connection = new Connection(RPC_URL, "confirmed");

    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 400 }
      );
    }

    const mint = TOKEN_MINT;
    const receiver = RECEIVER_WALLET;
    const expectedRawAmount = BigInt(
      Math.round(Number(amount) * Math.pow(10, TOKEN_DECIMALS))
    );

    let validReceiver = false;
    let validMint = false;
    let validAmount = false;
    let validOwner = false;

    for (const ix of tx.transaction.message.instructions) {
      const parsed = (ix as any)?.parsed;
      if (!parsed) continue;

      if (parsed.type === "transferChecked") {
        const info = parsed.info || {};

        if (info.mint === mint) {
          validMint = true;
        }

        if (info.destinationOwner === receiver || info.destination === receiver) {
          validReceiver = true;
        }

        if (info.tokenAmount?.amount) {
          const raw = BigInt(info.tokenAmount.amount);
          if (raw === expectedRawAmount) {
            validAmount = true;
          }
        }

        if (info.authority === wallet || info.owner === wallet) {
          validOwner = true;
        }
      }
    }

    if (!validMint) {
      return NextResponse.json({ error: "Invalid mint" }, { status: 400 });
    }

    if (!validReceiver) {
      return NextResponse.json({ error: "Invalid receiver" }, { status: 400 });
    }

    if (!validAmount) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!validOwner) {
      return NextResponse.json({ error: "Invalid wallet sender" }, { status: 400 });
    }

    const existing = await supabase
      .from("purchases")
      .select("id")
      .eq("tx_signature", signature)
      .maybeSingle();

    if (existing.data) {
      return NextResponse.json(
        { error: "Transaction already used" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      signature,
      wallet,
      itemName: itemName ?? null,
      price: price ?? amount,
    });
  } catch (error: any) {
    console.error("verify-payment error:", error);
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}