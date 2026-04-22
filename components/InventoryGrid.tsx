"use client";

import { InventoryItem } from "../types/marketplace";

type InventoryGridProps = {
  inventory: InventoryItem[];
};

const rarityColors: Record<string, string> = {
  Common: "#94a3b8",
  Rare: "#38bdf8",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
  Mythic: "#ef4444",
};

export default function InventoryGrid({
  inventory,
}: InventoryGridProps) {
  if (inventory.length === 0) {
    return <p className="text-zinc-400">No rewards opened yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {inventory.map((item, index) => (
        <div
          key={`${item.rewardName}-${index}`}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        >
          <img
            src={item.rewardImage}
            alt={item.rewardName}
            className="mb-3 h-40 w-full rounded-lg object-cover"
          />

          <p className="text-sm text-zinc-400">{item.boxName}</p>

          <h3 className="text-lg font-bold">{item.rewardName}</h3>

          <p
            className="mt-1 text-sm font-semibold"
            style={{ color: rarityColors[item.rarity] || "#ffffff" }}
          >
            {item.rarity}
          </p>

          <p className="mt-2 text-xs text-zinc-500">{item.openedAt}</p>
        </div>
      ))}
    </div>
  );
}