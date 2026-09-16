// mobile/lib/api.ts
import { TokenStorage } from "./storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface MobileUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export const MobileApi = {
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await TokenStorage.getItem("topupgame_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["Cookie"] = `topupgame_session=${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  },

  // Auth
  async login(email: string, password: string) {
    const res = await this.fetchWithAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      if (data.token) {
        await TokenStorage.setItem("topupgame_token", data.token);
      }
      await TokenStorage.setItem("topupgame_user", JSON.stringify(data.user));
    }
    return data;
  },

  async register(formData: { name: string; email: string; phoneWa: string; password: string }) {
    const res = await this.fetchWithAuth("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      await TokenStorage.setItem("topupgame_user", JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    await this.fetchWithAuth("/api/auth/logout", { method: "POST" });
    await TokenStorage.removeItem("topupgame_token");
    await TokenStorage.removeItem("topupgame_user");
  },

  async getStoredUser(): Promise<MobileUser | null> {
    const userStr = await TokenStorage.getItem("topupgame_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Tracking
  async trackInvoice(invoiceId: string) {
    const res = await this.fetchWithAuth(`/api/orders/track?id=${encodeURIComponent(invoiceId)}`);
    return await res.json();
  },

  // Chat
  async getChatMessages(orderJokiId: string) {
    const res = await this.fetchWithAuth(`/api/realtime/chat/${orderJokiId}`);
    return await res.json();
  },
};
