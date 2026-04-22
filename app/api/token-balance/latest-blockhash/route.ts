import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const connection = new Connection(RPC_URL, "confirmed");

export async function GET() {
  try {
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    return NextResponse.json({
      blockhash,
      lastValidBlockHeight,
    });
  } catch (error) {
    console.error("BLOCKHASH API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to get latest blockhash" },
      { status: 500 }
    );
  }
}