import { BoxType, RarityTier, Reward } from "../types/marketplace";

export const rewardPools: Record<BoxType, Reward[]> = {
  vehicle: [
    { id: "veh-c-1", name: "Starter Street Car", rarity: "Common", image: "/images/mystery-ck.png" },
    { id: "veh-r-1", name: "Sport Coupe", rarity: "Rare", image: "/images/mystery-ck.png" },
    { id: "veh-e-1", name: "Performance Sedan", rarity: "Epic", image: "/images/mystery-ck.png" },
    { id: "veh-l-1", name: "CSH Elite Car", rarity: "Legendary", image: "/images/mystery-luxury-vehicle.png" },
    { id: "veh-m-1", name: "One-Off Hyper Vehicle", rarity: "Mythic", image: "/images/mystery-luxury-vehicle.png" },
  ],
  residential: [
    { id: "res-c-1", name: "Compact Apartment", rarity: "Common", image: "/images/mystery-residential.png" },
    { id: "res-r-1", name: "Modern Condo", rarity: "Rare", image: "/images/mystery-residential.png" },
    { id: "res-e-1", name: "Luxury Penthouse", rarity: "Epic", image: "/images/mystery-residential.png" },
    { id: "res-l-1", name: "Skyline Mansion", rarity: "Legendary", image: "/images/mystery-residential.png" },
    { id: "res-m-1", name: "Founders Estate", rarity: "Mythic", image: "/images/mystery-residential.png" },
  ],
  business: [
    { id: "bus-c-1", name: "Mini Kiosk", rarity: "Common", image: "/images/mystery-business.png" },
    { id: "bus-r-1", name: "Retail Shop", rarity: "Rare", image: "/images/mystery-business.png" },
    { id: "bus-e-1", name: "Branded Storefront", rarity: "Epic", image: "/images/mystery-business.png" },
    { id: "bus-l-1", name: "Premium Commercial Lot", rarity: "Legendary", image: "/images/mystery-business.png" },
    { id: "bus-m-1", name: "Business Tower Unit", rarity: "Mythic", image: "/images/mystery-business.png" },
  ],
  land: [
    { id: "land-c-1", name: "Starter Parcel", rarity: "Common", image: "/images/mystery-land.png" },
    { id: "land-r-1", name: "Urban Plot", rarity: "Rare", image: "/images/mystery-land.png" },
    { id: "land-e-1", name: "Builder Zone", rarity: "Epic", image: "/images/mystery-land.png" },
    { id: "land-l-1", name: "Premium District Lot", rarity: "Legendary", image: "/images/mystery-land.png" },
    { id: "land-m-1", name: "Mythic Prime Land", rarity: "Mythic", image: "/images/mystery-land.png" },
  ],
  luxury: [
    { id: "lux-c-1", name: "Executive Vehicle", rarity: "Common", image: "/images/mystery-luxury-vehicle.png" },
    { id: "lux-r-1", name: "Luxury Touring Car", rarity: "Rare", image: "/images/mystery-luxury-vehicle.png" },
    { id: "lux-e-1", name: "Collector Supercar", rarity: "Epic", image: "/images/mystery-luxury-vehicle.png" },
    { id: "lux-l-1", name: "Legendary Exotic", rarity: "Legendary", image: "/images/mystery-luxury-vehicle.png" },
    { id: "lux-m-1", name: "Mythic Signature Hypercar", rarity: "Mythic", image: "/images/mystery-luxury-vehicle.png" },
  ],
  "vehicle-pack": [
    { id: "pack-c-1", name: "2 Vehicle Starter Pack", rarity: "Common", image: "/images/mystery-vehicle-pack.png" },
    { id: "pack-r-1", name: "Premium Vehicle Duo", rarity: "Rare", image: "/images/mystery-vehicle-pack.png" },
    { id: "pack-e-1", name: "Collector Mobility Pack", rarity: "Epic", image: "/images/mystery-vehicle-pack.png" },
    { id: "pack-l-1", name: "Elite Vehicle Bundle", rarity: "Legendary", image: "/images/mystery-vehicle-pack.png" },
    { id: "pack-m-1", name: "Mythic Mobility Crate", rarity: "Mythic", image: "/images/mystery-vehicle-pack.png" },
  ],
  vip: [
    { id: "vip-c-1", name: "Silver Member", rarity: "Common", image: "/images/mystery-vip-role.png" },
    { id: "vip-r-1", name: "Gold Member", rarity: "Rare", image: "/images/mystery-vip-role.png" },
    { id: "vip-e-1", name: "Elite Access", rarity: "Epic", image: "/images/mystery-vip-role.png" },
    { id: "vip-l-1", name: "Founder VIP Pass", rarity: "Legendary", image: "/images/mystery-vip-role.png" },
    { id: "vip-m-1", name: "God Tier Role", rarity: "Mythic", image: "/images/mystery-vip-role.png" },
  ],
  income: [
    { id: "inc-c-1", name: "Basic Cashflow Asset", rarity: "Common", image: "/images/mystery-income-asset.png" },
    { id: "inc-r-1", name: "Rent Yield Asset", rarity: "Rare", image: "/images/mystery-income-asset.png" },
    { id: "inc-e-1", name: "Premium Passive Asset", rarity: "Epic", image: "/images/mystery-income-asset.png" },
    { id: "inc-l-1", name: "High Yield Commercial Asset", rarity: "Legendary", image: "/images/mystery-income-asset.png" },
    { id: "inc-m-1", name: "Mythic Lifetime Income Asset", rarity: "Mythic", image: "/images/mystery-income-asset.png" },
  ],
  skin: [
    { id: "skin-c-1", name: "Street Outfit", rarity: "Common", image: "/images/mystery-character-skin.png" },
    { id: "skin-r-1", name: "Rare Neon Set", rarity: "Rare", image: "/images/mystery-character-skin.png" },
    { id: "skin-e-1", name: "Epic Masked Skin", rarity: "Epic", image: "/images/mystery-character-skin.png" },
    { id: "skin-l-1", name: "Legendary Founder Skin", rarity: "Legendary", image: "/images/mystery-character-skin.png" },
    { id: "skin-m-1", name: "Mythic Signature Avatar", rarity: "Mythic", image: "/images/mystery-character-skin.png" },
  ],
  upgrade: [
    { id: "up-c-1", name: "Basic Building Upgrade", rarity: "Common", image: "/images/mystery-building-upgrade.png" },
    { id: "up-r-1", name: "Structural Upgrade Pack", rarity: "Rare", image: "/images/mystery-building-upgrade.png" },
    { id: "up-e-1", name: "Premium Neon Upgrade", rarity: "Epic", image: "/images/mystery-building-upgrade.png" },
    { id: "up-l-1", name: "Legendary Expansion Upgrade", rarity: "Legendary", image: "/images/mystery-building-upgrade.png" },
    { id: "up-m-1", name: "Mythic HQ Upgrade", rarity: "Mythic", image: "/images/mystery-building-upgrade.png" },
  ],
  bike: [
    { id: "bike-c-1", name: "Starter Bike", rarity: "Common", image: "/images/mystery-bike.png" },
    { id: "bike-r-1", name: "Street Racer Bike", rarity: "Rare", image: "/images/mystery-bike.png" },
    { id: "bike-e-1", name: "Epic Neon Bike", rarity: "Epic", image: "/images/mystery-bike.png" },
    { id: "bike-l-1", name: "Legendary Speed Bike", rarity: "Legendary", image: "/images/mystery-bike.png" },
    { id: "bike-m-1", name: "Mythic Collector Bike", rarity: "Mythic", image: "/images/mystery-bike.png" },
  ],
};

export function rollRarity(boxType: BoxType): RarityTier {
  const roll = Math.random() * 100;

  if (boxType === "vip") {
    if (roll < 70) return "Common";
    if (roll < 88) return "Rare";
    if (roll < 96) return "Epic";
    if (roll < 99) return "Legendary";
    return "Mythic";
  }

  if (boxType === "luxury") {
    if (roll < 58) return "Common";
    if (roll < 82) return "Rare";
    if (roll < 92) return "Epic";
    if (roll < 98) return "Legendary";
    return "Mythic";
  }

  if (roll < 55) return "Common";
  if (roll < 80) return "Rare";
  if (roll < 92) return "Epic";
  if (roll < 98) return "Legendary";
  return "Mythic";
}

export function getRandomReward(pool: Reward[], rarity: RarityTier): Reward {
  const filtered = pool.filter((item) => item.rarity === rarity);
  const source = filtered.length ? filtered : pool;

  return source[Math.floor(Math.random() * source.length)];
}