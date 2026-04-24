import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
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
        { success: false, error: "Missing signature, wallet or amount" },
        { status: 400 }
      );
    }

    if (!TOKEN_MINT || !RECEIVER_WALLET) {
      return NextResponse.json(
        { success: false, error: "Server token config missing" },
        { status: 500 }
      );
    }

    const connection = new Connection(RPC_URL, "confirmed");

    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx || tx.meta?.err) {
      return NextResponse.json(
        { success: false, error: "Transaction not confirmed" },
        { status: 400 }
      );
    }

    const mint = new PublicKey(TOKEN_MINT);
    const buyer = new PublicKey(wallet);
    const receiver = new PublicKey(RECEIVER_WALLET);

    const expectedSourceAta = await getAssociatedTokenAddress(
      mint,
      buyer,
      false,
      TOKEN_PROGRAM_ID
    );

    const expectedReceiverAta = await getAssociatedTokenAddress(
      mint,
      receiver,
      false,
      TOKEN_PROGRAM_ID
    );

    const expectedRawAmount = BigInt(
      Math.round(Number(amount) * Math.pow(10, TOKEN_DECIMALS))
    );

    let verified = false;

    for (const ix of tx.transaction.message.instructions) {
      const parsed = (ix as any)?.parsed;
      if (!parsed) continue;

      const info = parsed.info || {};

      if (parsed.type === "transfer") {
        const source = String(info.source || "");
        const destination = String(info.destination || "");
        const authority = String(info.authority || "");
        const rawAmount = BigInt(String(info.amount || "0"));

        if (
          source === expectedSourceAta.toString() &&
          destination === expectedReceiverAta.toString() &&
          authority === buyer.toString() &&
          rawAmount === expectedRawAmount
        ) {
          verified = true;
          break;
        }
      }

      if (parsed.type === "transferChecked") {
        const source = String(info.source || "");
        const destination = String(info.destination || "");
        const authority = String(info.authority || "");
        const mintFromTx = String(info.mint || "");
        const rawAmount = BigInt(String(info.tokenAmount?.amount || "0"));

        if (
          mintFromTx === mint.toString() &&
          source === expectedSourceAta.toString() &&
          destination === expectedReceiverAta.toString() &&
          authority === buyer.toString() &&
          rawAmount === expectedRawAmount
        ) {
          verified = true;
          break;
        }
      }
    }

    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const existing = await supabase
      .from("purchases")
      .select("id")
      .eq("tx_signature", signature)
      .maybeSingle();

    if (existing.data) {
      return NextResponse.json(
        { success: false, error: "Transaction already used" },
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
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}