import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface BadgeProps {
  type: "dm" | "comment" | "story" | string
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  const { colors } = useTheme()

  const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    dm: {
      label: "DM TRIGGER",
      color: colors.tagDm,
      bg: colors.isDark ? "rgba(26, 115, 232, 0.18)" : "rgba(26, 115, 232, 0.12)",
    },
    comment: {
      label: "COMMENT",
      color: colors.tagComment,
      bg: colors.isDark ? "rgba(255, 109, 0, 0.18)" : "rgba(255, 109, 0, 0.12)",
    },
    story: {
      label: "STORY REPLY",
      color: colors.tagStory,
      bg: colors.isDark ? "rgba(225, 48, 108, 0.18)" : "rgba(225, 48, 108, 0.12)",
    },
  }

  const config = BADGE_CONFIG[type] || {
    label: type.toUpperCase(),
    color: colors.textSecondary,
    bg: colors.surfaceElevated,
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: colors.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
          borderTopColor: colors.isDark ? "rgba(255, 255, 255, 0.22)" : "#FFFFFF",
          borderBottomColor: colors.isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.08)",
          shadowColor: config.color,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
})

