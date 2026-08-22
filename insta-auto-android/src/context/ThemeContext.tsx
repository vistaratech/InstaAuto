import React, { createContext, useContext, useState, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import { DarkColors, LightColors, ThemeColors } from "../theme/colors"
import * as Haptics from "expo-haptics"

type ThemeMode = "dark" | "light"

interface ThemeContextType {
  theme: ThemeMode
  colors: ThemeColors
  isDark: boolean
  toggleTheme: () => void
  setThemeMode: (mode: ThemeMode) => void
}

const THEME_STORAGE_KEY = "insta_app_theme_mode"

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  colors: DarkColors,
  isDark: true,
  toggleTheme: () => {},
  setThemeMode: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark")

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await SecureStore.getItemAsync(THEME_STORAGE_KEY)
        if (saved === "light" || saved === "dark") {
          setTheme(saved)
        }
      } catch (e) {
        console.warn("Could not load theme", e)
      }
    }
    loadTheme()
  }, [])

  const setThemeMode = async (mode: ThemeMode) => {
    setTheme(mode)
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode)
    } catch {}
  }

  const toggleTheme = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {}
    const next = theme === "dark" ? "light" : "dark"
    setThemeMode(next)
  }

  const colors = theme === "dark" ? DarkColors : LightColors

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDark: theme === "dark",
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
