"use client";

import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  cartCount: number;
  inventoryCount: number;
  tokenBalance: number;
  tokenSymbol: string;
  isWalletConnected: boolean;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onReset: () => void;
};

export default function Header({
  cartCount,
  inventoryCount,
  tokenBalance,
  tokenSymbol,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
  onReset,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const shortWallet =
    walletAddress && walletAddress.length > 8
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
      : "Connect Wallet";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (
    section: "marketplace" | "store" | "lootbox" | "about" | "inventory" | "cart" | "logout"
  ) => {
    setIsMenuOpen(false);

    if (section === "logout") {
      onReset();
      return;
    }

    window.dispatchEvent(new CustomEvent("changeView", { detail: section }));
  };

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-purple-900 bg-zinc-950 p-4">
      <div>
        <h1 className="text-3xl font-bold text-purple-400">
          City Scape Hustle
        </h1>
        <p className="text-sm text-zinc-400">
          Premium limited mystery asset marketplace
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-lg border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-950"
          >
            Menu
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl">
              <button
                onClick={() => handleMenuClick("marketplace")}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                Marketplace
              </button>

              <button
                onClick={() => handleMenuClick("store")}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                Store
              </button>

              <button
                onClick={() => handleMenuClick("lootbox")}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                Loot Box
              </button>

              <button
                onClick={() => handleMenuClick("about")}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                About Us
              </button>

              <button
                onClick={() => handleMenuClick("inventory")}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                <span>Inventory</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-cyan-300">
                  {inventoryCount}
                </span>
              </button>

              <button
                onClick={() => handleMenuClick("cart")}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-zinc-900"
              >
                <span>Cart</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-cyan-300">
                  {cartCount}
                </span>
              </button>

              <div className="my-2 border-t border-zinc-800" />

              <button
                onClick={() => handleMenuClick("logout")}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm text-red-400 hover:bg-red-950"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-cyan-500 px-4 py-2 text-sm font-bold text-cyan-300">
          💰 Balance: {tokenBalance.toFixed(2)} {tokenSymbol}
        </div>

        <button
          onClick={onConnectWallet}
          className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
        >
          {isWalletConnected && walletAddress ? shortWallet : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}