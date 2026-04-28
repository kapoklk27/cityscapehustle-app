"use client";

import { useState } from "react";
import { connectPhantomWallet } from "../../lib/wallet";

export default function AdminPage() {
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAdminLogin() {
    try {
      setLoading(true);

      const publicKey = await connectPhantomWallet();

      if (!publicKey) {
        alert("Wallet connection failed.");
        return;
      }

      setWallet(publicKey);

      const res = await fetch("/api/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: publicKey,
        }),
      });

      const data = await res.json();

      if (!data.isAdmin) {
        alert("Access Denied.");
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
      setRole(data.role);
    } catch (err) {
      console.error(err);
      alert("Admin login failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl border border-cyan-800 bg-zinc-950 p-8">
          <h1 className="text-4xl font-black text-cyan-400 mb-4">
            Admin Access
          </h1>

          <p className="text-zinc-400 mb-6">
            Connect authorized admin wallet to continue.
          </p>

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-6 py-4 text-lg font-black text-black"
          >
            {loading ? "Checking..." : "Connect Admin Wallet"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-cyan-800 bg-zinc-950 p-8">
          <h1 className="text-4xl font-black text-cyan-400">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-zinc-400">
            Logged in as: {wallet}
          </p>

          <p className="text-purple-400 font-bold">
            Role: {role}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-purple-800 p-6">
              <h2 className="text-xl font-bold">Manage Stores</h2>
              <p className="text-zinc-400 mt-2">
                Block / verify / edit store settings
              </p>
            </div>

            <div className="rounded-2xl border border-purple-800 p-6">
              <h2 className="text-xl font-bold">Set Platform Fees</h2>
              <p className="text-zinc-400 mt-2">
                Configure marketplace commission %
              </p>
            </div>

            <div className="rounded-2xl border border-purple-800 p-6">
              <h2 className="text-xl font-bold">Fraud Monitoring</h2>
              <p className="text-zinc-400 mt-2">
                Suspend suspicious stores / wallets
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}