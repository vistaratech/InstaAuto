import React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { Zap, Moon, Sun } from "lucide-react-native"
import { getClayIconBoxStyle, getClayPillStyle } from "../../theme/clayStyles"

interface HeaderProps {
  title?: string
  subtitle?: string
  rightAction?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
  const { user } = useAuth()
  const { colors, isDark, toggleTheme } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
          borderBottomColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <View style={styles.left}>
        {user?.profilePictureUrl ? (
          <View style={[styles.avatarClayRing, { borderColor: colors.primary }]}>
            <Image source={{ uri: user.profilePictureUrl }} style={styles.avatar} />
          </View>
        ) : (
          <View
            style={[
              styles.avatarClayRing,
              getClayIconBoxStyle(colors, colors.primary, 46),
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Image
              source={require("../../../assets/logo.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </View>
        )}
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title || `@${user?.username || "creator"}`}
          </Text>
          <View
            style={[
              styles.statusClayPill,
              {
                backgroundColor: colors.isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(5, 150, 105, 0.12)",
                borderColor: colors.isDark ? "rgba(16, 185, 129, 0.28)" : "rgba(5, 150, 105, 0.2)",
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.subtitle, { color: colors.success }]}>
              {subtitle || "Live Engine Active"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        {rightAction || (
          <TouchableOpacity
            style={[
              styles.themeBtn,
              getClayIconBoxStyle(colors, colors.primary, 42),
              { backgroundColor: colors.surface },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {isDark ? (
              <Sun size={19} color={colors.warning} />
            ) : (
              <Moon size={19} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarClayRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: "#1A73E8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  statusClayPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
})
