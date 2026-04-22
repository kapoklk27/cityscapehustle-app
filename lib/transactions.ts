import { PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";

export const TOKEN_SYMBOL =
  process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "CSHT";

export const TOKEN_NAME =
  process.env.NEXT_PUBLIC_TOKEN_NAME || "CityScape Hustle Token";

function getProvider(): any {
  if (typeof window === "undefined") return null;

  const anyWindow = window as any;
  const provider = anyWindow?.phantom?.solana || anyWindow?.solana;

  if (!provider?.isPhantom) {
    throw new Error("Phantom wallet no está disponible.");
  }

  return provider;
}

export function getTokenMint(): PublicKey {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT?.trim();

  if (!mint) {
    throw new Error("NEXT_PUBLIC_TOKEN_MINT is empty");
  }

  return new PublicKey(mint);
}

async function getLatestBlockhashFromServer(): Promise<{
  blockhash: string;
  lastValidBlockHeight: number;
}> {
  const res = await fetch("/api/token-balance/latest-blockhash", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener latest blockhash");
  }

  return res.json();
}

export async function sendCSHT(
  fromWalletAddress: string,
  toWalletAddress: string,
  amountUi: number
): Promise<string> {
  if (!fromWalletAddress?.trim()) {
    throw new Error("Wallet address missing");
  }

  if (!toWalletAddress?.trim()) {
    throw new Error("Treasury wallet missing");
  }

  if (!amountUi || amountUi <= 0) {
    throw new Error("Invalid amount");
  }

  const provider = getProvider();
  if (!provider) {
    throw new Error("Phantom wallet no está disponible.");
  }

  const mint = getTokenMint();
  const fromOwner = new PublicKey(fromWalletAddress.trim());
  const toOwner = new PublicKey(toWalletAddress.trim());

  const connectedWallet = provider.publicKey?.toString?.();
  if (!connectedWallet) {
    throw new Error("Phantom no tiene una wallet conectada");
  }

  if (connectedWallet !== fromOwner.toString()) {
    throw new Error(
      "La wallet conectada en Phantom no coincide con la wallet de la app"
    );
  }

  const decimals = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "9");
  const amountBaseUnits = BigInt(
    Math.round(amountUi * Math.pow(10, decimals))
  );

  const fromTokenAccount = await getAssociatedTokenAddress(
    mint,
    fromOwner,
    false,
    TOKEN_PROGRAM_ID
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    mint,
    toOwner,
    false,
    TOKEN_PROGRAM_ID
  );

  const { blockhash } = await getLatestBlockhashFromServer();

  const tx = new Transaction();
  tx.feePayer = fromOwner;
  tx.recentBlockhash = blockhash;

  tx.add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromOwner,
      amountBaseUnits,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const result = await provider.signAndSendTransaction(tx);

  if (!result?.signature) {
    throw new Error("Phantom no devolvió signature");
  }

  return result.signature;
}