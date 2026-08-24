import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import {
  LogOut,
  Globe,
  Instagram,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
  Server,
} from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth()
  const { colors, isDark, toggleTheme } = useTheme()
  const insets = useSafeAreaInsets()
  const [backendUrl, setBackendUrl] = useState(apiClient.getBaseUrl())

  const handleLogout = () => {
    Alert.alert(
      "Disconnect Account",
      "Are you sure you want to disconnect this Instagram account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            logout()
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings & Sync</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Manage theme, connected account & cloud sync
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connected Instagram Account Card */}
        <View style={[styles.card, getClayCardStyle(colors)]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, getClayIconBoxStyle(colors, colors.secondary, 44)]}>
              <Instagram size={22} color="#E1306C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Connected Instagram</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Live 24/7 Webhook Engine
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.accountBadge,
              getClayInsetBoxStyle(colors),
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[styles.accountUsername, { color: colors.textPrimary }]}>
                @{user?.username || "creator"}
              </Text>
              <View style={styles.liveSyncBadge}>
                <View style={styles.liveSyncDot} />
                <Text style={styles.liveSyncText}>CONNECTED</Text>
              </View>
            </View>
            <View style={styles.verifiedRow}>
              <CheckCircle2 size={13} color={colors.success} />
              <Text style={[styles.verifiedText, { color: colors.success }]}>
                Official Meta Instagram Graph API Active
              </Text>
            </View>
          </View>
        </View>

        {/* Theme Mode Toggle */}
        <View style={[styles.card, getClayCardStyle(colors)]}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, getClayIconBoxStyle(colors, isDark ? colors.primary : colors.warning, 44)]}>
                {isDark ? (
                  <Moon size={21} color={colors.primaryLight} />
                ) : (
                  <Sun size={21} color={colors.warning} />
                )}
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Appearance</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  {isDark ? "Dark Claymorphic Mode" : "Light Claymorphic Mode"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceInset, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Backend API Configuration */}
        <View style={[styles.card, getClayCardStyle(colors)]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, getClayIconBoxStyle(colors, colors.primary, 44)]}>
              <Server size={20} color={colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Backend Cloud Server</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                API URL Webhook Endpoint
              </Text>
            </View>
          </View>
          <TextInput
            style={[
              styles.textInput,
              getClayInsetBoxStyle(colors),
              {
                color: colors.textPrimary,
              },
            ]}
            value={backendUrl}
            onChangeText={(val) => {
              setBackendUrl(val)
              apiClient.setBaseUrl(val)
            }}
            placeholder="https://www.dmspark.in"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        {/* Security Info */}
        <View style={styles.securityRow}>
          <ShieldCheck size={14} color={colors.success} />
          <Text style={[styles.securityText, { color: colors.textMuted }]}>
            Official Meta Instagram Webhooks · Zero token storage on device
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            getClayButtonStyle(colors, "surface"),
            {
              backgroundColor: colors.isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(225, 29, 72, 0.1)",
              borderColor: colors.isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(225, 29, 72, 0.2)",
              borderBottomColor: colors.dangerBevel,
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={[styles.logoutBtnText, { color: colors.danger }]}>Disconnect Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 3,
    fontWeight: "500",
  },
  content: {
    padding: 18,
    paddingBottom: 95,
  },
  card: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
    fontWeight: "400",
  },
  accountBadge: {
    padding: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  accountUsername: {
    fontSize: 15,
    fontWeight: "700",
  },
  liveSyncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  liveSyncDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  liveSyncText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "500",
  },
  textInput: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginTop: 10,
    fontWeight: "400",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 6,
    marginBottom: 14,
  },
  securityText: {
    fontSize: 11,
    fontWeight: "400",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 18,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
})

