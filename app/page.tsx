"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { rewardPools, rollRarity, getRandomReward } from "../lib/lootbox";
import { connectPhantomWallet } from "../lib/wallet";
import { sendCSHT } from "../lib/transactions";
import {
  loadProducts,
  saveProducts,
  loadInventoryByWallet,
  saveInventoryByWallet,
  loadCartCount,
  saveCartCount,
  clearMarketplaceStorage,
  clearInventoryByWallet,
} from "../lib/storage";
import { getTokenBalance, TOKEN_SYMBOL } from "../lib/solana";
import { supabase } from "../lib/supabase";
import type { InventoryItem, Product } from "../types/marketplace";

const initialProducts: Product[] = [
  {
    id: 1,
    name: "CSH Mystery CK",
    image: "/images/mystery-ck.png",
    price: "120 CSHT",
    rarity: "MYSTERY",
    category: "Vehicle",
    accent: "#eab308",
    endsAt: "2026-04-20T23:59:59",
    stock: 25,
    sold: 7,
    boxType: "vehicle",
  },
  {
    id: 2,
    name: "Mystery Property Residential",
    image: "/images/mystery-residential.png",
    price: "180 CSHT",
    rarity: "PROPERTY",
    category: "Residential",
    accent: "#8b5cf6",
    endsAt: "2026-04-18T23:59:59",
    stock: 12,
    sold: 3,
    boxType: "residential",
  },
  {
    id: 3,
    name: "Mystery Property Business",
    image: "/images/mystery-business.png",
    price: "250 CSHT",
    rarity: "BUSINESS",
    category: "Business",
    accent: "#38bdf8",
    endsAt: "2026-04-19T23:59:59",
    stock: 10,
    sold: 4,
    boxType: "business",
  },
  {
    id: 4,
    name: "Mystery Bike",
    image: "/images/mystery-bike.png",
    price: "90 CSHT",
    rarity: "BIKE",
    category: "Vehicle",
    accent: "#f97316",
    endsAt: "2026-04-22T23:59:59",
    stock: 20,
    sold: 5,
    boxType: "vehicle",
  },
  {
    id: 5,
    name: "Mystery Building Upgrade",
    image: "/images/mystery-building-upgrade.png",
    price: "300 CSHT",
    rarity: "UPGRADE",
    category: "Upgrade",
    accent: "#22c55e",
    endsAt: "2026-04-25T23:59:59",
    stock: 8,
    sold: 2,
    boxType: "residential",
  },
  {
    id: 6,
    name: "Mystery Character Skin",
    image: "/images/mystery-character-skin.png",
    price: "75 CSHT",
    rarity: "SKIN",
    category: "Character",
    accent: "#ec4899",
    endsAt: "2026-04-21T23:59:59",
    stock: 30,
    sold: 6,
    boxType: "residential",
  },
  {
    id: 7,
    name: "Mystery Income Asset",
    image: "/images/mystery-income-asset.png",
    price: "400 CSHT",
    rarity: "INCOME",
    category: "Income",
    accent: "#14b8a6",
    endsAt: "2026-04-26T23:59:59",
    stock: 6,
    sold: 1,
    boxType: "business",
  },
  {
    id: 8,
    name: "Mystery Land",
    image: "/images/mystery-land.png",
    price: "500 CSHT",
    rarity: "LAND",
    category: "Land",
    accent: "#84cc16",
    endsAt: "2026-04-28T23:59:59",
    stock: 5,
    sold: 1,
    boxType: "residential",
  },
  {
    id: 9,
    name: "Mystery Luxury Vehicle",
    image: "/images/mystery-luxury-vehicle.png",
    price: "650 CSHT",
    rarity: "LUXURY",
    category: "Vehicle",
    accent: "#f59e0b",
    endsAt: "2026-04-24T23:59:59",
    stock: 7,
    sold: 2,
    boxType: "vehicle",
  },
  {
    id: 10,
    name: "Mystery Vehicle Pack",
    image: "/images/mystery-vehicle-pack.png",
    price: "220 CSHT",
    rarity: "PACK",
    category: "Vehicle",
    accent: "#06b6d4",
    endsAt: "2026-04-23T23:59:59",
    stock: 15,
    sold: 4,
    boxType: "vehicle",
  },
  {
    id: 11,
    name: "Mystery VIP Role",
    image: "/images/mystery-vip-role.png",
    price: "1000 CSHT",
    rarity: "VIP",
    category: "Role",
    accent: "#ef4444",
    endsAt: "2026-04-30T23:59:59",
    stock: 3,
    sold: 0,
    boxType: "business",
  },
];

const rarityColors: Record<string, string> = {
  Common: "#94a3b8",
  Rare: "#38bdf8",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
  Mythic: "#ef4444",
};

const productPricesCSHT: Record<number, number> = {
  1: 120,
  2: 180,
  3: 250,
  4: 90,
  5: 300,
  6: 75,
  7: 400,
  8: 500,
  9: 650,
  10: 220,
  11: 1000,
};

function getProductCSHTPrice(productId: number) {
  return productPricesCSHT[productId] || 100;
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Expired";

  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const s = Math.floor((ms / 1000) % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState<Record<number, string>>({});
  const [cartCount, setCartCount] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedReward, setSelectedReward] = useState<InventoryItem | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [activeView, setActiveView] = useState<
    "lootbox" | "marketplace" | "store" | "inventory" | "cart" | "about"
  >("lootbox");

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<
        "lootbox" | "marketplace" | "store" | "inventory" | "cart" | "about"
      >;
      setActiveView(customEvent.detail);
    };

    window.addEventListener("changeView", handler);

    return () => {
      window.removeEventListener("changeView", handler);
    };
  }, []);

  useEffect(() => {
    const savedProducts = loadProducts();
    const savedCartCount = loadCartCount();

    setProducts(savedProducts && savedProducts.length ? savedProducts : initialProducts);
    setCartCount(savedCartCount);
  }, []);

  useEffect(() => {
    if (products.length) {
      saveProducts(products);
    }
  }, [products]);

  useEffect(() => {
    saveCartCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.from("players").select("*");
        console.log("🔥 SUPABASE DATA:", data);
        console.log("❌ SUPABASE ERROR:", error);
      } catch (err) {
        console.error("Supabase test crash:", err);
      }
    };

    testSupabase();
  }, []);

  useEffect(() => {
    if (!walletAddress) {
      setInventory([]);
      setTokenBalance(0);
      return;
    }

    const walletInventory = loadInventoryByWallet(walletAddress);
    setInventory(walletInventory);

    const loadSupabaseInventory = async () => {
      try {
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .eq("wallet", walletAddress)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error cargando inventory desde Supabase:", error);
          return;
        }

        if (data && data.length > 0) {
          const mappedInventory: InventoryItem[] = data.map((item: any) => ({
            boxName: item.box_name || item.item_name || "Unknown Box",
            rewardName: item.item_name || "Unknown Reward",
            rarity: item.rarity || "Common",
            rewardImage: item.image || "/images/mystery-ck.png",
            openedAt: item.created_at
              ? new Date(item.created_at).toLocaleString()
              : new Date().toLocaleString(),
          }));

          setInventory(mappedInventory);
          saveInventoryByWallet(walletAddress, mappedInventory);
        }
      } catch (err) {
        console.error("Crash cargando inventory desde Supabase:", err);
      }
    };

    loadSupabaseInventory();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    saveInventoryByWallet(walletAddress, inventory);
  }, [walletAddress, inventory]);

  useEffect(() => {
    const loadBalance = async () => {
      if (!walletAddress) {
        setTokenBalance(0);
        return;
      }

      const balance = await getTokenBalance(walletAddress);
      console.log("💰 Balance cargado:", balance);
      setTokenBalance(balance);
    };

    loadBalance();
  }, [walletAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<number, string> = {};

      products.forEach((p) => {
        const diff = new Date(p.endsAt).getTime() - Date.now();
        updated[p.id] = formatTimeLeft(diff);
      });

      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  const totalInventory = useMemo(() => inventory.length, [inventory]);

  async function connectWallet() {
    try {
      const publicKey = await connectPhantomWallet();

      if (!publicKey) {
        alert("Phantom no está instalado, no fue detectado, o cancelaste la conexión.");
        setWalletAddress("");
        setIsWalletConnected(false);
        setInventory([]);
        setTokenBalance(0);
        return;
      }

      setWalletAddress(publicKey);
      setIsWalletConnected(true);

      const balance = await getTokenBalance(publicKey);
      console.log("💰 Balance al conectar:", balance);
      setTokenBalance(balance);

      try {
        const { error } = await supabase.from("players").upsert({
          wallet: publicKey,
        });

        if (error) {
          console.error("Error guardando player en Supabase:", error);
        } else {
          console.log("✅ Player guardado en Supabase:", publicKey);
        }
      } catch (err) {
        console.error("Crash guardando player en Supabase:", err);
      }
    } catch (error) {
      console.error("Error conectando wallet:", error);
      alert("Error conectando wallet.");
      setWalletAddress("");
      setIsWalletConnected(false);
      setInventory([]);
      setTokenBalance(0);
    }
  }

  function handleAddToCart(product: Product) {
    const remaining = product.stock - product.sold;
    const expired = new Date(product.endsAt).getTime() - Date.now() <= 0;

    if (remaining <= 0 || expired) return;
    setCartCount((prev) => prev + 1);
  }

  async function handleOpenBox(product: Product) {
    if (!walletAddress) {
      alert("Conecta tu wallet primero.");
      return;
    }

    if (isProcessingPayment) {
      alert("Ya hay un pago en proceso.");
      return;
    }

    const remaining = product.stock - product.sold;
    const expired = new Date(product.endsAt).getTime() - Date.now() <= 0;

    if (remaining <= 0 || expired) return;

    const cshtPrice = getProductCSHTPrice(product.id);

    if (tokenBalance < cshtPrice) {
      alert(`No tienes suficiente ${TOKEN_SYMBOL}. Necesitas ${cshtPrice} ${TOKEN_SYMBOL}.`);
      return;
    }

    try {
      setIsProcessingPayment(true);

      const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || "";

      if (!treasuryWallet) {
        alert("Falta configurar la wallet de destino.");
        return;
      }

      const signature = await sendCSHT(
        walletAddress,
        treasuryWallet,
        cshtPrice
      );

      if (!signature) {
        alert("Pago fallido o cancelado.");
        return;
      }

      console.log("Pago exitoso TX:", signature);

      const rarity = rollRarity(product.boxType);
      const reward = getRandomReward(rewardPools[product.boxType], rarity);

      const openedReward: InventoryItem = {
        boxName: product.name,
        rewardName: reward.name,
        rarity: reward.rarity,
        rewardImage: reward.image,
        openedAt: new Date().toLocaleString(),
      };

      setInventory((prev) => [openedReward, ...prev]);
      setSelectedReward(openedReward);

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, sold: item.sold + 1 } : item
        )
      );

      try {
        const { error: purchaseError } = await supabase.from("purchases").insert({
          wallet: walletAddress,
          item_name: product.name,
          price: cshtPrice,
          tx_signature: signature,
        });

        if (purchaseError) {
          console.error("Error guardando purchase en Supabase:", purchaseError);
        } else {
          console.log("✅ Purchase guardada en Supabase");
        }
      } catch (err) {
        console.error("Crash guardando purchase en Supabase:", err);
      }

      try {
        const { error: inventoryError } = await supabase.from("inventory").insert({
          wallet: walletAddress,
          item_name: reward.name,
          rarity: reward.rarity,
          image: reward.image,
          box_name: product.name,
        });

        if (inventoryError) {
          console.error("Error guardando inventory en Supabase:", inventoryError);
        } else {
          console.log("✅ Inventory guardado en Supabase");
        }
      } catch (err) {
        console.error("Crash guardando inventory en Supabase:", err);
      }

      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(1500);

      let refreshedBalance = await getTokenBalance(walletAddress);

      if (refreshedBalance === tokenBalance) {
        await sleep(2000);
        refreshedBalance = await getTokenBalance(walletAddress);
      }

      console.log("💰 Balance refrescado:", refreshedBalance);
      setTokenBalance(refreshedBalance);
    } catch (error) {
      console.error("Error en compra de lootbox:", error);
      alert("Ocurrió un error procesando la compra.");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  function resetMarketplace() {
    clearMarketplaceStorage();
    clearInventoryByWallet(walletAddress || null);
    setProducts(initialProducts);
    setInventory([]);
    setCartCount(0);
    setSelectedReward(null);
    setTokenBalance(0);
    setWalletAddress("");
    setIsWalletConnected(false);
    setIsProcessingPayment(false);
    setActiveView("lootbox");
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-[1320px]">
        <Header
          cartCount={cartCount}
          inventoryCount={totalInventory}
          tokenBalance={tokenBalance}
          tokenSymbol={TOKEN_SYMBOL}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnectWallet={connectWallet}
          onReset={resetMarketplace}
        />

        {!walletAddress && (
          <div className="mb-8 rounded-2xl border border-yellow-700 bg-yellow-950/40 p-4 text-yellow-200 shadow-lg shadow-yellow-900/10">
            Connect your wallet to load your player inventory and activate purchases.
          </div>
        )}

        {walletAddress && (
          <div className="mb-6 rounded-2xl border border-cyan-800 bg-zinc-950 p-4 text-sm text-cyan-300 shadow-lg shadow-cyan-900/10">
            Player wallet: {walletAddress}
          </div>
        )}

        {activeView === "lootbox" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-cyan-300">🎁 Loot Boxes</h2>
              <p className="text-sm text-zinc-400">
                Open mystery boxes and unlock rare rewards.
              </p>
            </div>

            <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => {
                const remaining = p.stock - p.sold;
                const expired = new Date(p.endsAt).getTime() - Date.now() <= 0;
                const soldOut = remaining <= 0;
                const cshtPrice = getProductCSHTPrice(p.id);
                const progress = Math.max(0, (remaining / p.stock) * 100);

                return (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-3xl border border-purple-900 bg-zinc-950 shadow-2xl shadow-purple-950/20 transition duration-300 hover:-translate-y-1 hover:shadow-purple-900/30"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-64 w-full object-cover"
                    />

                    <div className="space-y-5 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-extrabold leading-tight text-white">
                            {p.name}
                          </h2>
                          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-zinc-400">
                            {p.category} Asset
                          </p>
                        </div>

                        <span
                          className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
                          style={{
                            borderColor: p.accent,
                            color: p.accent,
                          }}
                        >
                          {p.rarity}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Sale ends in
                        </div>
                        <div className="mt-2 text-3xl font-extrabold text-cyan-400">
                          {timeLeft[p.id] || "Loading..."}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-zinc-900/80 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
                          <span>Remaining</span>
                          <span className="font-bold">
                            {remaining} / {p.stock}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${p.accent}, ${p.accent}aa)`,
                            }}
                          />
                        </div>

                        <div className="mt-3 text-sm text-zinc-400">
                          Sold: <span className="font-semibold text-white">{p.sold}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
                          Drop rates
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(rarityColors).map(([rarity, color]) => {
                            const rates: Record<string, string> = {
                              Common: "55%",
                              Rare: "25%",
                              Epic: "12%",
                              Legendary: "6%",
                              Mythic: "2%",
                            };

                            return (
                              <div key={rarity} className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-zinc-300">{rarity}:</span>
                                <span className="font-semibold text-white">{rates[rarity]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-5xl font-black tracking-tight text-white">
                        {cshtPrice} <span className="text-zinc-400">{TOKEN_SYMBOL}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={soldOut || expired}
                          className="rounded-2xl px-5 py-4 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                          style={{
                            background: `linear-gradient(90deg, ${p.accent}, #7c3aed)`,
                          }}
                        >
                          {soldOut ? "Sold Out" : expired ? "Expired" : "Add to Cart"}
                        </button>

                        <button
                          onClick={() => handleOpenBox(p)}
                          disabled={soldOut || expired || isProcessingPayment}
                          className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-lg font-bold text-white transition hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isProcessingPayment ? "Processing..." : "Open Box"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeView === "marketplace" && (
          <div className="rounded-2xl border border-purple-900 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-purple-400">Marketplace</h2>
            <p className="mt-2 text-zinc-400">
              Player trading marketplace coming next.
            </p>
          </div>
        )}

        {activeView === "store" && (
          <div className="rounded-2xl border border-purple-900 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-purple-400">Store</h2>
            <p className="mt-2 text-zinc-400">
              Store section coming next.
            </p>
          </div>
        )}

        {activeView === "inventory" && (
          <div className="rounded-2xl border border-purple-900 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-purple-400">Inventory</h2>

            {inventory.length === 0 ? (
              <p className="mt-2 text-zinc-400">No items yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {inventory.map((item, index) => (
                  <div
                    key={`${item.rewardName}-${index}`}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-black"
                  >
                    <img
                      src={item.rewardImage}
                      alt={item.rewardName}
                      className="h-48 w-full object-cover"
                    />
                    <div className="space-y-2 p-4">
                      <div className="text-lg font-bold text-white">
                        {item.rewardName}
                      </div>
                      <div className="text-sm text-zinc-400">
                        From: {item.boxName}
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: rarityColors[item.rarity] || "#fff" }}
                      >
                        {item.rarity}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {item.openedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === "cart" && (
          <div className="rounded-2xl border border-purple-900 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-purple-400">Cart</h2>
            <p className="mt-2 text-zinc-400">
              Cart view coming next.
            </p>
            <div className="mt-4 text-white">Items in cart: {cartCount}</div>
          </div>
        )}

        {activeView === "about" && (
          <div className="rounded-2xl border border-purple-900 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-purple-400">About Us</h2>
            <p className="mt-2 text-zinc-400">
              City Scape Hustle is building a premium digital asset and loot box experience powered by CSHT.
            </p>
          </div>
        )}

        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-lg rounded-3xl border border-cyan-900 bg-zinc-950 p-6 shadow-2xl shadow-cyan-950/30">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-cyan-400">
                    Lootbox Opened
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {selectedReward.rewardName}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedReward(null)}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-300 hover:border-cyan-500 hover:text-cyan-300"
                >
                  Close
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                <img
                  src={selectedReward.rewardImage}
                  alt={selectedReward.rewardName}
                  className="h-64 w-full object-cover"
                />
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl bg-zinc-900/80 p-4 text-sm">
                <div>
                  <span className="text-zinc-400">Box:</span>{" "}
                  <span className="font-semibold text-white">{selectedReward.boxName}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Reward:</span>{" "}
                  <span className="font-semibold text-white">{selectedReward.rewardName}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Rarity:</span>{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: rarityColors[selectedReward.rarity] || "#fff",
                    }}
                  >
                    {selectedReward.rarity}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400">Opened:</span>{" "}
                  <span className="font-semibold text-white">{selectedReward.openedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}