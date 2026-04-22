export type BoxType =
  | "vehicle"
  | "residential"
  | "business"
  | "land"
  | "luxury"
  | "vehicle-pack"
  | "vip"
  | "income"
  | "skin"
  | "upgrade"
  | "bike";

export type RarityTier = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  rarity: string;
  category: string;
  accent: string;
  endsAt: string;
  stock: number;
  sold: number;
  boxType: BoxType;
};

export type Reward = {
  id: string;
  name: string;
  rarity: RarityTier;
  image: string;
};

export type InventoryItem = {
  boxName: string;
  rewardName: string;
  rarity: RarityTier;
  rewardImage: string;
  openedAt: string;
};