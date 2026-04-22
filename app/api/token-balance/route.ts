import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const connection = new Connection(RPC_URL, "confirmed");

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

function getExpectedMint(): PublicKey {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT?.trim();

  if (!mint) {
    throw new Error("NEXT_PUBLIC_TOKEN_MINT is empty");
  }

  return new PublicKey(mint);
}

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json({ balance: 0 });
    }

    const owner = new PublicKey(wallet);
    const expectedMintKey = getExpectedMint();
    const expectedMint = expectedMintKey.toString();

    const response = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    });

    let balance = 0;
    const decimals = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 9);

    console.log("======== TOKEN DEBUG ========");
    console.log("Wallet:", wallet);
    console.log("Mint buscado:", expectedMint);

    for (const item of response.value) {
      const info = (item.account.data as any)?.parsed?.info;
      if (!info?.mint) continue;

      let currentMintKey: PublicKey;
      let currentMint = "";

      try {
        currentMintKey = new PublicKey(info.mint);
        currentMint = currentMintKey.toString();
      } catch {
        continue;
      }

      const rawAmount = info.tokenAmount?.amount || "0";
      const calculatedBalance =
        Number(rawAmount) / Math.pow(10, decimals);

      console.log("→ Encontrado:", currentMint, calculatedBalance, rawAmount);

      if (currentMintKey.equals(expectedMintKey)) {
        balance = calculatedBalance;
        console.log("✅ MATCH REAL:", currentMint);
        console.log("💰 BALANCE CALCULADO:", balance);
        break;
      }
    }

    console.log("BALANCE FINAL:", balance);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("ERROR API:", error);
    return NextResponse.json({ balance: 0 });
  }
}