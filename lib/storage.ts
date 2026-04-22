import type { InventoryItem, Product } from "../types/marketplace";

const PRODUCTS_KEY = "products";
const CART_KEY = "cart";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadProducts(): Product[] {
  if (!isBrowser()) return [];
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadCartCount(): number {
  if (!isBrowser()) return 0;
  return Number(localStorage.getItem(CART_KEY) || 0);
}

export function saveCartCount(count: number) {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, String(count));
}

export function loadInventoryByWallet(wallet: string | null): InventoryItem[] {
  if (!wallet || !isBrowser()) return [];
  return JSON.parse(localStorage.getItem(`inv_${wallet}`) || "[]");
}

export function saveInventoryByWallet(wallet: string | null, data: InventoryItem[]) {
  if (!wallet || !isBrowser()) return;
  localStorage.setItem(`inv_${wallet}`, JSON.stringify(data));
}

export function clearInventoryByWallet(wallet: string | null) {
  if (!wallet || !isBrowser()) return;
  localStorage.removeItem(`inv_${wallet}`);
}

export function clearMarketplaceStorage() {
  if (!isBrowser()) return;
  localStorage.clear();
}