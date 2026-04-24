"use client";

import { useMemo, useState } from "react";
import { connectPhantomWallet } from "../../lib/wallet";
import { getTokenBalance, TOKEN_SYMBOL } from "../../lib/solana";

const unrealStores = [
  {
    id: "car-dealer",
    name: "Car Dealer",
    description: "Buy vehicles, luxury cars, and vehicle lootboxes.",
    link: "https://cityscapehustle.com?store=car-dealer",
  },
  {
    id: "property-shop",
    name: "Property Shop",
    description: "Buy apartments, land, building upgrades, and business assets.",
    link: "https://cityscapehustle.com?store=property-shop",
  },
  {
    id: "vip-store",
    name: "VIP Role Store",
    description: "Buy premium roles and exclusive access.",
    link: "https://cityscapehustle.com?store=vip-store",
  },
];

export default function UnrealPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const shortWallet = useMemo(() => {
    if (!walletAddress) return "";
    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-5)}`;
  }, [walletAddress]);

  async function connectWallet() {
    try {
      setLoadingWallet(true);

      const publicKey = await connectPhantomWallet();

      if (!publicKey) {
        alert("Phantom no fue detectado. Abre esta página en Chrome con Phantom instalado.");
        return;
      }

      setWalletAddress(publicKey);

      const balance = await getTokenBalance(publicKey);
      setTokenBalance(balance);
    } catch (error) {
      console.error("Unreal wallet connection error:", error);
      alert("Error conectando Phantom.");
    } finally {
      setLoadingWallet(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 32,
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          border: "1px solid #164e63",
          borderRadius: 24,
          padding: 28,
          background: "linear-gradient(135deg, #020617, #111827)",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              border: "1px solid #06b6d4",
              borderRadius: 999,
              color: "#67e8f9",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Unreal Store Interface
          </div>

          <h1 style={{ fontSize: 46, margin: 0, fontWeight: 900 }}>
            City Scape Hustle
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 760 }}>
            Buy digital assets with CSHT, sync your inventory, and unlock items inside Unreal Engine.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <button
            onClick={connectWallet}
            disabled={loadingWallet}
            style={{
              background: "#06b6d4",
              color: "#020617",
              border: "none",
              padding: "14px 22px",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {loadingWallet ? "Connecting..." : walletAddress ? shortWallet : "Connect Phantom"}
          </button>

          <div
            style={{
              border: "1px solid #334155",
              borderRadius: 14,
              padding: "14px 18px",
              color: "#67e8f9",
              fontWeight: 800,
            }}
          >
            Balance: {tokenBalance} {TOKEN_SYMBOL}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {unrealStores.map((store) => (
            <div
              key={store.id}
              style={{
                border: "1px solid #7e22ce",
                borderRadius: 20,
                padding: 22,
                background: "#09090b",
              }}
            >
              <h2 style={{ marginTop: 0, fontSize: 26 }}>{store.name}</h2>

              <p style={{ color: "#cbd5e1", minHeight: 60 }}>
                {store.description}
              </p>

              <button
                onClick={() => {
                  window.location.href = store.link;
                }}
                style={{
                  marginTop: 12,
                  width: "100%",
                  background: "linear-gradient(90deg, #06b6d4, #7c3aed)",
                  color: "white",
                  border: "none",
                  padding: "14px 18px",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Open Store
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 18,
            background: "#111827",
            border: "1px solid #334155",
            color: "#cbd5e1",
          }}
        >
          <strong style={{ color: "#67e8f9" }}>Next Sync Step:</strong>{" "}
          Unreal will read the player inventory from{" "}
          <span style={{ color: "white" }}>/api/player-data?wallet=PLAYER_WALLET</span>{" "}
          and unlock vehicles, properties, skins, roles, and store ownership.
        </div>
      </section>
    </main>
  );
}