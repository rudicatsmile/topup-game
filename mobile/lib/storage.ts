// mobile/lib/storage.ts
// Secure token storage abstraction for Expo React Native

let memoryStorage: Record<string, string> = {};

export const TokenStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Dynamic import to support both native Expo and fallback
      const SecureStore = await import("expo-secure-store").catch(() => null);
      if (SecureStore && typeof SecureStore.setItemAsync === "function") {
        await SecureStore.setItemAsync(key, value);
        return;
      }
    } catch {}
    memoryStorage[key] = value;
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const SecureStore = await import("expo-secure-store").catch(() => null);
      if (SecureStore && typeof SecureStore.getItemAsync === "function") {
        return await SecureStore.getItemAsync(key);
      }
    } catch {}
    return memoryStorage[key] || null;
  },

  async removeItem(key: string): Promise<void> {
    try {
      const SecureStore = await import("expo-secure-store").catch(() => null);
      if (SecureStore && typeof SecureStore.deleteItemAsync === "function") {
        await SecureStore.deleteItemAsync(key);
        return;
      }
    } catch {}
    delete memoryStorage[key];
  },
};
