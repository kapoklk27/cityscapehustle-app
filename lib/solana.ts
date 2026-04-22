import { Connection } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

export const connection = new Connection(RPC_URL, "confirmed");

export const TOKEN_SYMBOL =
  process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "CSHT";

export async function getTokenBalance(
  walletAddress: string
): Promise<number> {
  try {
    if (!walletAddress) return 0;

    const res = await fetch(
      `/api/token-balance?wallet=${encodeURIComponent(walletAddress)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Token balance fetch failed:", res.status);
      return 0;
    }

    const data = await res.json();

    return typeof data.balance === "number" ? data.balance : 0;
  } catch (err) {
    console.error("Balance error:", err);
    return 0;
  }
}