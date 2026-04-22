"use client";

import { InventoryItem } from "../types/marketplace";

type RewardModalProps = {
  reward: InventoryItem | null;
  onClose: () => void;
};

const rarityColors: Record<string, string> = {
  Common: "#94a3b8",
  Rare: "#38bdf8",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
  Mythic: "#ef4444",
};

export default function RewardModal({
  reward,
  onClose,
}: RewardModalProps) {
  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-800 bg-zinc-950 p-6 text-center shadow-2xl shadow-purple-900/40">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
          Box Opened
        </p>

        <h2 className="mb-4 text-2xl font-bold text-purple-400">
          You Won
        </h2>

        <img
          src={reward.rewardImage}
          alt={reward.rewardName}
          className="mx-auto mb-4 h-48 w-full rounded-xl object-cover"
        />

        <h3 className="text-xl font-bold">{reward.rewardName}</h3>

        <p
          className="mt-2 text-lg font-semibold"
          style={{ color: rarityColors[reward.rarity] || "#ffffff" }}
        >
          {reward.rarity}
        </p>

        <p className="mt-3 text-sm text-zinc-400">
          From: <span className="text-zinc-200">{reward.boxName}</span>
        </p>

        <p className="mt-2 text-xs text-zinc-500">{reward.openedAt}</p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-purple-600 py-3 font-bold text-white hover:bg-purple-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}