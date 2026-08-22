import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { getClayCardStyle, getClayIconBoxStyle } from "../../theme/clayStyles"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  trend?: string
  color?: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  const { colors } = useTheme()
  const activeColor = color || colors.primary

  return (
    <View style={[styles.card, getClayCardStyle(colors)]}>
      <View style={[styles.iconBox, getClayIconBoxStyle(colors, activeColor, 40), { backgroundColor: `${activeColor}18` }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 12.5,
    fontWeight: "600",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: "400",
  },
})

