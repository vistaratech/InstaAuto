import { ViewStyle } from "react-native"
import { ThemeColors } from "./colors"

/**
 * DMSpark Ultra-Premium Claymorphism & 3D Tactile Design System
 */
export const getClayCardStyle = (colors: ThemeColors, isHoveredOrActive = false): ViewStyle => ({
  backgroundColor: colors.surface,
  borderRadius: 22,
  borderWidth: 1,
  borderColor: colors.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
  borderTopColor: colors.isDark ? "rgba(255, 255, 255, 0.15)" : "#FFFFFF",
  borderBottomColor: colors.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.06)",
  shadowColor: colors.isDark ? "#000000" : "#64748B",
  shadowOffset: { width: 0, height: isHoveredOrActive ? 2 : 6 },
  shadowOpacity: colors.isDark ? 0.35 : 0.08,
  shadowRadius: isHoveredOrActive ? 6 : 14,
  elevation: isHoveredOrActive ? 2 : 4,
})

export const getClayElevatedCardStyle = (colors: ThemeColors): ViewStyle => ({
  backgroundColor: colors.surfaceElevated,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
  borderTopColor: colors.isDark ? "rgba(255, 255, 255, 0.18)" : "#FFFFFF",
  borderBottomColor: colors.isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.08)",
  shadowColor: colors.isDark ? "#000000" : "#475569",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: colors.isDark ? 0.3 : 0.1,
  shadowRadius: 10,
  elevation: 4,
})

export const getClayInsetBoxStyle = (colors: ThemeColors): ViewStyle => ({
  backgroundColor: colors.surfaceInset,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.04)",
  borderTopColor: colors.isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.08)",
  borderBottomColor: colors.isDark ? "rgba(255, 255, 255, 0.06)" : "#FFFFFF",
})

export const getClayButtonStyle = (
  colors: ThemeColors,
  variant: "primary" | "secondary" | "accent" | "surface" = "primary"
): ViewStyle => {
  let bgColor = colors.primary
  let bottomBevel = "#0F4DA8"
  let shadowColor = "#1A73E8"

  if (variant === "secondary") {
    bgColor = colors.secondary
    bottomBevel = "#9D174D"
    shadowColor = "#E1306C"
  } else if (variant === "accent") {
    bgColor = colors.accent
    bottomBevel = "#C2410C"
    shadowColor = "#FF6D00"
  } else if (variant === "surface") {
    bgColor = colors.surfaceElevated
    bottomBevel = colors.isDark ? "#080C14" : "#CBD5E1"
    shadowColor = colors.isDark ? "#000000" : "#94A3B8"
  }

  return {
    backgroundColor: bgColor,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    borderBottomWidth: 3,
    borderBottomColor: bottomBevel,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
}

export const getClayPillStyle = (colors: ThemeColors, colorName: string, active = false): ViewStyle => ({
  backgroundColor: active ? colorName : colors.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 7,
  borderWidth: 1,
  borderColor: active ? "rgba(255,255,255,0.3)" : colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
  borderTopColor: active ? "rgba(255,255,255,0.5)" : colors.isDark ? "rgba(255,255,255,0.12)" : "#FFFFFF",
  borderBottomWidth: active ? 2.5 : 1,
  borderBottomColor: active ? "rgba(0,0,0,0.3)" : colors.isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)",
  shadowColor: active ? colorName : "#000",
  shadowOffset: { width: 0, height: active ? 3 : 1 },
  shadowOpacity: active ? 0.25 : 0.05,
  shadowRadius: active ? 5 : 2,
  elevation: active ? 3 : 1,
})

export const getClayIconBoxStyle = (colors: ThemeColors, colorName: string, size = 44): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2.3,
  backgroundColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.95)",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: colors.isDark ? "rgba(255, 255, 255, 0.12)" : "#FFFFFF",
  borderTopColor: colors.isDark ? "rgba(255, 255, 255, 0.22)" : "#FFFFFF",
  borderBottomWidth: 1.5,
  borderBottomColor: colors.isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.06)",
  shadowColor: colorName,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 3,
})

