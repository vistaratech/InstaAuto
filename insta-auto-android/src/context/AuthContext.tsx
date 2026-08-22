import React, { createContext, useContext, useState, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import { API_CONFIG } from "../api/config"
import { apiClient } from "../api/apiClient"
import { UserSession } from "../types"

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  loginWithDirectCredentials: (userId: string, username: string) => Promise<void>
  loginWithOAuthCode: (code: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginWithDirectCredentials: async () => {},
  loginWithOAuthCode: async () => ({ success: false }),
  logout: async () => {},
  refreshProfile: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    try {
      await apiClient.init()
      const savedId = await SecureStore.getItemAsync(API_CONFIG.STORAGE_KEYS.USER_ID)
      const savedName = await SecureStore.getItemAsync(API_CONFIG.STORAGE_KEYS.USERNAME)
      const savedPic = await SecureStore.getItemAsync(API_CONFIG.STORAGE_KEYS.PROFILE_PIC)

      if (savedId && savedName) {
        setUser({
          userId: savedId,
          username: savedName,
          profilePictureUrl: savedPic || undefined,
        })
      }
    } catch (e) {
      console.warn("Failed to load secure session", e)
    } finally {
      setIsLoading(false)
    }
  }

  // Login Method 1: Direct credentials (quick connect from DB list)
  const loginWithDirectCredentials = async (userId: string, username: string) => {
    setIsLoading(true)
    try {
      await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.USER_ID, userId)
      await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.USERNAME, username)

      let picUrl: string | undefined
      try {
        const pic = await apiClient.getProfilePicture(userId)
        if (pic) {
          picUrl = pic
          await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.PROFILE_PIC, pic)
        }
      } catch {}

      setUser({
        userId,
        username,
        profilePictureUrl: picUrl,
      })
    } catch (e) {
      console.error("Login failed", e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  // Login Method 2: Instagram OAuth code exchange (same as web flow)
  const loginWithOAuthCode = async (code: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const result = await apiClient.loginWithCode(code)

      if (result.success && result.userId && result.username) {
        await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.USER_ID, result.userId)
        await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.USERNAME, result.username)

        let picUrl: string | undefined
        try {
          const pic = await apiClient.getProfilePicture(result.userId)
          if (pic) {
            picUrl = pic
            await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.PROFILE_PIC, pic)
          }
        } catch {}

        setUser({
          userId: result.userId,
          username: result.username,
          profilePictureUrl: picUrl,
        })
        return { success: true }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (e: any) {
      console.error("OAuth login failed", e)
      return { success: false, error: e.message || "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(API_CONFIG.STORAGE_KEYS.USER_ID)
      await SecureStore.deleteItemAsync(API_CONFIG.STORAGE_KEYS.USERNAME)
      await SecureStore.deleteItemAsync(API_CONFIG.STORAGE_KEYS.PROFILE_PIC)
      setUser(null)
    } catch (e) {
      console.error("Logout error", e)
    }
  }

  const refreshProfile = async () => {
    if (!user?.userId) return
    try {
      const pic = await apiClient.getProfilePicture(user.userId)
      if (pic) {
        await SecureStore.setItemAsync(API_CONFIG.STORAGE_KEYS.PROFILE_PIC, pic)
        setUser((prev) => (prev ? { ...prev, profilePictureUrl: pic } : null))
      }
    } catch (e) {
      console.warn("Could not refresh profile pic", e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithDirectCredentials,
        loginWithOAuthCode,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
