// ─── DMSpark Color Theme (Synchronized with Logo: Electric Blue + Spark Amber) ─────────────

export const DarkColors = {
  // Backgrounds: Deep Smooth Clay Slate
  background: "#080C16",
  surface: "#111827",
  surfaceElevated: "#1A2234",
  surfaceLight: "#242F46",
  surfaceInset: "#0B101D",

  // Clay Borders & Highlights
  border: "#1F2A40",
  borderSubtle: "#161E2E",
  borderActive: "#1A73E8",
  borderClayLight: "rgba(255, 255, 255, 0.14)",
  borderClayDark: "rgba(0, 0, 0, 0.45)",

  // Brand Accents (Logo Matched Clay)
  primary: "#1A73E8",          // DMSpark Electric Blue
  primaryLight: "#3B82F6",     // Sky Highlight
  primaryGlow: "rgba(26, 115, 232, 0.22)",
  primaryBevel: "#0F4DA8",

  accent: "#FF6D00",           // Logo Lightning Spark (Amber Clay)
  accentLight: "#FFA040",
  accentGlow: "rgba(255, 109, 0, 0.22)",
  accentBevel: "#C2410C",

  secondary: "#E1306C",        // Instagram Rose Clay
  secondaryLight: "#F472B6",
  secondaryGlow: "rgba(225, 48, 108, 0.22)",
  secondaryBevel: "#9D174D",

  // Status Clay
  success: "#10B981",
  successGlow: "rgba(16, 185, 129, 0.2)",
  successBevel: "#047857",

  warning: "#F59E0B",
  warningGlow: "rgba(245, 158, 11, 0.2)",
  warningBevel: "#B45309",

  danger: "#EF4444",
  dangerGlow: "rgba(239, 68, 68, 0.2)",
  dangerBevel: "#B91C1C",

  // Text (High Contrast & Crystal Clear)
  textPrimary: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",

  // Category tags
  tagDm: "#1A73E8",
  tagComment: "#FF6D00",
  tagStory: "#E1306C",
  tagAi: "#10B981",

  // Navigation
  tabBarBg: "#0E1424",
  tabBarActive: "#1A73E8",
  tabBarInactive: "#94A3B8",
  isDark: true,
}

export const LightColors = {
  // Backgrounds: Soft Matte Clay Snow
  background: "#F1F5F9",
  surface: "#FFFFFF",
  surfaceElevated: "#F8FAFC",
  surfaceLight: "#E2E8F0",
  surfaceInset: "#E2E8F0",

  // Clay Borders & Highlights
  border: "#CBD5E1",
  borderSubtle: "#E2E8F0",
  borderActive: "#1A73E8",
  borderClayLight: "rgba(255, 255, 255, 0.95)",
  borderClayDark: "rgba(0, 0, 0, 0.08)",

  // Brand Accents
  primary: "#1A73E8",          // DMSpark Electric Blue
  primaryLight: "#1557B0",     // Deep Blue
  primaryGlow: "rgba(26, 115, 232, 0.15)",
  primaryBevel: "#1557B0",

  accent: "#FF6D00",           // Logo Lightning Spark
  accentLight: "#EA580C",
  accentGlow: "rgba(255, 109, 0, 0.15)",
  accentBevel: "#C2410C",

  secondary: "#E1306C",        // Instagram Rose
  secondaryLight: "#DB2777",
  secondaryGlow: "rgba(225, 48, 108, 0.15)",
  secondaryBevel: "#9D174D",

  // Status
  success: "#059669",
  successGlow: "rgba(5, 150, 105, 0.15)",
  successBevel: "#047857",

  warning: "#D97706",
  warningGlow: "rgba(217, 119, 6, 0.15)",
  warningBevel: "#B45309",

  danger: "#E11D48",
  dangerGlow: "rgba(225, 29, 72, 0.15)",
  dangerBevel: "#BE123C",

  // Text (High Contrast)
  textPrimary: "#0F172A",
  textSecondary: "#334155",
  textMuted: "#64748B",

  // Category tags
  tagDm: "#1A73E8",
  tagComment: "#FF6D00",
  tagStory: "#E1306C",
  tagAi: "#059669",

  // Navigation
  tabBarBg: "#FFFFFF",
  tabBarActive: "#1A73E8",
  tabBarInactive: "#8898AA",
  isDark: false,
}

export type ThemeColors = typeof DarkColors
export const Colors = DarkColors
