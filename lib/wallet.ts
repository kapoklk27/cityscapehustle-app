export function getPhantomProvider() {
  if (typeof window === "undefined") return null;

  const provider = (window as any)?.phantom?.solana;

  if (!provider || !provider.isPhantom) {
    return null;
  }

  return provider;
}

export async function connectPhantomWallet(): Promise<string | null> {
  try {
    const provider = getPhantomProvider();

    if (!provider) {
      return null;
    }

    const response = await provider.connect({ onlyIfTrusted: false });

    const publicKey =
      response?.publicKey?.toString() ||
      provider?.publicKey?.toString() ||
      "";

    if (!publicKey) {
      return null;
    }

    return publicKey;
  } catch (error) {
    console.error("connectPhantomWallet error:", error);
    return null;
  }
}

export async function disconnectPhantomWallet(): Promise<void> {
  try {
    const provider = getPhantomProvider();
    if (!provider) return;
    await provider.disconnect();
  } catch (error) {
    console.error("disconnectPhantomWallet error:", error);
  }
}