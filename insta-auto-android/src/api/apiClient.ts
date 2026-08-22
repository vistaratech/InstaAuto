import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { API_CONFIG } from "./config"
import { AutomationRule, Conversation, Message, ReelScheduleItem } from "../types"

// Create optimized axios instance with mobile-friendly timeout
const api = axios.create({
  timeout: 20000,
  headers: {
    "Cache-Control": "no-cache",
  },
})

class ApiClient {
  private baseUrl: string = API_CONFIG.DEFAULT_BACKEND_URL

  // In-Memory Fast Caches for 0ms Instant Loading
  private automationsCache: Map<string, AutomationRule[]> = new Map()
  private conversationsCache: Map<string, Conversation[]> = new Map()
  private mediaCache: Map<string, any[]> = new Map()

  async init() {
    try {
      const savedUrl = await SecureStore.getItemAsync(API_CONFIG.STORAGE_KEYS.BACKEND_URL)
      if (savedUrl && (savedUrl.startsWith("https://") || savedUrl.includes("vercel.app"))) {
        this.baseUrl = savedUrl
      } else {
        this.baseUrl = API_CONFIG.DEFAULT_BACKEND_URL
        await SecureStore.deleteItemAsync(API_CONFIG.STORAGE_KEYS.BACKEND_URL).catch(() => { })
      }
    } catch (e) {
      this.baseUrl = API_CONFIG.DEFAULT_BACKEND_URL
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, "")
  }

  getBaseUrl() {
    return this.baseUrl
  }

  // --- FAST AUTOMATIONS WITH INSTANT CACHE ---
  getCachedAutomations(userId: string): AutomationRule[] {
    return this.automationsCache.get(userId) || []
  }

  async getAutomations(userId: string): Promise<AutomationRule[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/automations?userId=${userId}`)
      const data = res.data || []
      this.automationsCache.set(userId, data)
      return data
    } catch (e) {
      console.warn("Error fetching automations, returning cache if available", e)
      return this.automationsCache.get(userId) || []
    }
  }

  async createAutomation(payload: {
    userId: string
    name: string
    trigger_source: "dm" | "comment" | "story"
    trigger_type: "keyword" | "postback" | "reply_all"
    trigger_value: string
    content: any
    specific_media_id?: string | null
  }): Promise<AutomationRule> {
    const res = await api.post(`${this.baseUrl}/api/automations`, payload)
    const newRule = res.data

    // Optimistic cache update
    const current = this.automationsCache.get(payload.userId) || []
    this.automationsCache.set(payload.userId, [newRule, ...current])

    return newRule
  }

  async updateAutomation(payload: {
    id: string
    name: string
    trigger_source?: "dm" | "comment" | "story"
    trigger_type?: "keyword" | "postback" | "reply_all"
    trigger_value: string
    content: any
    specific_media_id?: string | null
  }): Promise<AutomationRule> {
    const res = await api.put(`${this.baseUrl}/api/automations`, payload)
    const updated = res.data

    // Update in all caches
    for (const [uid, list] of this.automationsCache.entries()) {
      this.automationsCache.set(
        uid,
        list.map((r) => (r.id === payload.id ? updated : r))
      )
    }

    return updated
  }

  async deleteAutomation(id: string, userId: string): Promise<boolean> {
    // Optimistic remove
    const current = this.automationsCache.get(userId) || []
    this.automationsCache.set(
      userId,
      current.filter((r) => r.id !== id)
    )

    try {
      await api.delete(`${this.baseUrl}/api/automations?id=${id}&userId=${userId}`)
      return true
    } catch {
      return true
    }
  }

  // --- FAST INBOX WITH INSTANT CACHE ---
  getCachedConversations(userId: string): Conversation[] {
    return this.conversationsCache.get(userId) || []
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/inbox/conversations?userId=${userId}`)
      const data = res.data || []
      this.conversationsCache.set(userId, data)
      return data
    } catch (e) {
      return this.conversationsCache.get(userId) || []
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/inbox/messages?conversationId=${conversationId}`)
      return res.data || []
    } catch {
      return []
    }
  }

  async sendMessage(userId: string, recipientId: string, text: string): Promise<any> {
    const res = await api.post(`${this.baseUrl}/api/inbox/send`, {
      userId,
      recipientId,
      message: text,
    })
    return res.data
  }

  // --- FAST INSTAGRAM MEDIA WITH INSTANT CACHE ---
  getCachedMedia(userId: string): any[] {
    return this.mediaCache.get(userId) || []
  }

  async getInstagramMedia(userId: string): Promise<any[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/instagram/media?userId=${userId}`)
      const data = res.data?.data || []
      if (data.length > 0) {
        this.mediaCache.set(userId, data)
      }
      return data
    } catch (e) {
      return this.mediaCache.get(userId) || []
    }
  }

  async getProfilePicture(userId: string): Promise<string | null> {
    try {
      const res = await api.get(`${this.baseUrl}/api/instagram/profile-picture?userId=${userId}`)
      return res.data?.profilePictureUrl || null
    } catch {
      return null
    }
  }

  async getReelsPool(userId: string): Promise<ReelScheduleItem[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/scheduler?userId=${userId}`)
      return res.data || []
    } catch {
      return []
    }
  }

  // --- AUTH: Instagram OAuth Code Exchange (Same as Web) ---
  async loginWithCode(code: string): Promise<{ success: boolean; userId: string; username: string; error?: string }> {
    try {
      const res = await api.post(`${this.baseUrl}/api/instagram/callback`, { code })
      return res.data
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || e.message || "Login failed"
      return { success: false, userId: "", username: "", error: errorMsg }
    }
  }

  // --- AUTH: List Connected Users from Neon DB ---
  async getConnectedUsers(): Promise<{ userId: string; username: string; updatedAt?: string }[]> {
    try {
      const res = await api.get(`${this.baseUrl}/api/instagram/users`)
      return res.data?.users || []
    } catch {
      return []
    }
  }
}

export const apiClient = new ApiClient()

