"use client";

import { Product } from "../types/marketplace";

type ProductCardProps = {
  product: Product;
  timeLeft: string;
  onAddToCart: (product: Product) => void;
  onOpenBox: (product: Product) => void;
};

export default function ProductCard({
  product,
  timeLeft,
  onAddToCart,
  onOpenBox,
}: ProductCardProps) {
  const remaining = product.stock - product.sold;
  const expired = new Date(product.endsAt).getTime() - Date.now() <= 0;
  const soldOut = remaining <= 0;

  const progress = Math.max(0, (remaining / product.stock) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-900 bg-zinc-950 transition hover:scale-[1.01]">
      
      <img
        src={product.image}
        alt={product.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold">{product.name}</h3>

          <span
            className="rounded-full border px-2 py-1 text-xs"
            style={{ borderColor: product.accent, color: product.accent }}
          >
            {product.rarity}
          </span>
        </div>

        <p className="mb-1 text-xs uppercase tracking-widest text-zinc-400">
          {product.category} Asset
        </p>

        <p className="mb-2 text-sm text-gray-400">SALE ENDS IN</p>
        <p className="mb-3 font-bold text-cyan-400">{timeLeft}</p>

        {/* Progress */}
        <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">Remaining</span>
            <span className="font-bold text-white">
              {remaining} / {product.stock}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: product.accent,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            Sold:{" "}
            <span className="font-semibold text-zinc-200">
              {product.sold}
            </span>
          </p>
        </div>

        {/* Drop Rates */}
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <p className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
            Drop Rates
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-zinc-300">Common: 55%</span>
            <span className="text-zinc-300">Rare: 25%</span>
            <span className="text-zinc-300">Epic: 12%</span>
            <span className="text-zinc-300">Legendary: 6%</span>
            <span className="text-zinc-300">Mythic: 2%</span>
          </div>
        </div>

        <p className="mb-4 text-lg font-semibold">{product.price}</p>

        <div className="grid grid-cols-2 gap-3">
          {/* Add to cart */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={expired || soldOut}
            className={`rounded-lg py-2 font-bold ${
              expired || soldOut
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                : ""
            }`}
            style={
              expired || soldOut
                ? undefined
                : {
                    background: `linear-gradient(90deg, ${product.accent}, purple)`,
                  }
            }
          >
            {soldOut ? "Sold Out" : expired ? "Expired" : "Add to Cart"}
          </button>

          {/* Open box */}
          <button
            onClick={() => onOpenBox(product)}
            disabled={expired || soldOut}
            className={`rounded-lg border py-2 font-bold ${
              expired || soldOut
                ? "cursor-not-allowed border-zinc-800 text-zinc-500"
                : "border-zinc-600 text-white hover:border-white"
            }`}
          >
            Open Box
          </button>
        </div>
      </div>
    </div>
  );
}