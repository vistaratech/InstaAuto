import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { API_CONFIG } from "../api/config"
import { InstagramLoginWebView } from "../components/common/InstagramLoginWebView"
import { LinearGradient } from "expo-linear-gradient"
import {
  Zap,
  Instagram,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  LogIn,
  RefreshCw,
} from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const LoginScreen: React.FC = () => {
  const { loginWithDirectCredentials, loginWithOAuthCode, isLoading } = useAuth()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const [loggingIn, setLoggingIn] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [connectedUsers, setConnectedUsers] = useState<
    { userId: string; username: string; updatedAt?: string }[]
  >([])
  const [showWebView, setShowWebView] = useState(false)
  const [exchangingCode, setExchangingCode] = useState(false)

  useEffect(() => {
    fetchConnectedUsers()
  }, [])

  const fetchConnectedUsers = async () => {
    setLoadingUsers(true)
    try {
      const users = await apiClient.getConnectedUsers()
      setConnectedUsers(users)
    } catch {
      setConnectedUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  // Build Instagram OAuth URL
  const getInstagramAuthUrl = () => {
    const redirectUri = API_CONFIG.INSTAGRAM_REDIRECT_URI
    return (
      `https://www.instagram.com/oauth/authorize` +
      `?client_id=${API_CONFIG.INSTAGRAM_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(API_CONFIG.INSTAGRAM_SCOPE)}`
    )
  }

  // Open in-app Instagram login
  const handleConnectInstagram = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {}
    setShowWebView(true)
  }

  // Handle OAuth code intercepted from WebView
  const handleCodeReceived = async (code: string) => {
    setShowWebView(false)
    setExchangingCode(true)
    try {
      const result = await loginWithOAuthCode(code)
      if (!result.success) {
        Alert.alert("Connection Failed", result.error || "Could not connect your Instagram account. Please try again.")
        fetchConnectedUsers()
      }
    } catch (e: any) {
      Alert.alert("Connection Error", e.message || "An unexpected error occurred.")
      fetchConnectedUsers()
    } finally {
      setExchangingCode(false)
    }
  }

  // Select existing account
  const handleSelectAccount = async (username: string, userId: string) => {
    setLoggingIn(true)
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await loginWithDirectCredentials(userId, username)
    } catch {
      Alert.alert("Error", "Could not connect account.")
    } finally {
      setLoggingIn(false)
    }
  }

  const hasAccounts = connectedUsers.length > 0

  // Fullscreen connecting state
  if (exchangingCode) {
    return (
      <View style={[styles.exchangeOverlay, { backgroundColor: colors.background }]}>
        <View style={[styles.exchangeCard, getClayCardStyle(colors)]}>
          <View style={[styles.logoBadge, getClayIconBoxStyle(colors, colors.primary, 80)]}>
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 56, height: 56, borderRadius: 28 }}
              resizeMode="contain"
            />
          </View>
          <ActivityIndicator size="small" color="#1A73E8" style={{ marginVertical: 8 }} />
          <Text style={[styles.exchangeTitle, { color: colors.textPrimary }]}>
            Connecting to DM<Text style={{ color: "#1A73E8" }}>Spark</Text>...
          </Text>
          <Text style={[styles.exchangeSubtitle, { color: colors.textSecondary }]}>
            Setting up your automated Instagram engine
          </Text>
        </View>
      </View>
    )
  }

  return (
    <>
      {/* In-App Instagram Login WebView */}
      <InstagramLoginWebView
        visible={showWebView}
        onClose={() => setShowWebView(false)}
        onCodeReceived={handleCodeReceived}
        authUrl={getInstagramAuthUrl()}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 30 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Hero Brand Header with 3D Clay Logo ─── */}
          <View style={styles.brandHeader}>
            <View
              style={[
                styles.logoBadge,
                getClayIconBoxStyle(colors, colors.primary, 92),
                { backgroundColor: "#FFFFFF" },
              ]}
            >
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
              DM<Text style={{ color: "#1A73E8" }}>Spark</Text>
            </Text>
            <Text style={[styles.brandTagline, { color: colors.textSecondary }]}>
              Auto Reply · Auto Grow · 100% Autopilot
            </Text>
          </View>

          {/* ─── Previous Account Quick-Login (If any) ─── */}
          {hasAccounts && (
            <View style={[styles.accountsCard, getClayCardStyle(colors)]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardHeaderTitle, { color: colors.textPrimary }]}>
                  Continue with Connected Account
                </Text>
                <TouchableOpacity
                  onPress={fetchConnectedUsers}
                  activeOpacity={0.7}
                  style={styles.refreshBtn}
                >
                  <RefreshCw size={14} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {connectedUsers.map((acc, index) => (
                <TouchableOpacity
                  key={acc.userId + index}
                  style={[
                    styles.accountItem,
                    getClayInsetBoxStyle(colors),
                  ]}
                  onPress={() => handleSelectAccount(acc.username, acc.userId)}
                  disabled={loggingIn || isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.accountLeft}>
                    <View style={[styles.accountAvatar, getClayIconBoxStyle(colors, colors.secondary, 40)]}>
                      <Instagram size={19} color="#E1306C" />
                    </View>
                    <View>
                      <Text style={[styles.accountName, { color: colors.textPrimary }]}>
                        @{acc.username}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <CheckCircle2 size={11} color={colors.success} />
                        <Text style={[styles.accountStatus, { color: colors.success }]}>
                          Ready to connect
                        </Text>
                      </View>
                    </View>
                  </View>
                  <LogIn size={18} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ─── Main Action: Tactile 3D Instagram Gradient Connect Button ─── */}
          <TouchableOpacity
            style={[styles.connectButton, getClayButtonStyle(colors, "secondary")]}
            onPress={handleConnectInstagram}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#F58529", "#DD2A7B", "#8134AF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.connectGradient}
            >
              <View style={styles.connectButtonContent}>
                <View style={styles.igIconCircle}>
                  <Instagram size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectButtonTitle}>
                    {hasAccounts ? "Connect Another Account" : "Connect with Instagram"}
                  </Text>
                  <Text style={styles.connectButtonSubtitle}>
                    Instant 1-click official authorization
                  </Text>
                </View>
                <ArrowRight size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* ─── Feature Highlights Clay Card ─── */}
          <View style={[styles.featuresContainer, getClayCardStyle(colors)]}>
            <View style={styles.featureRow}>
              <View style={[styles.featureIconBox, getClayIconBoxStyle(colors, colors.primary, 40), { backgroundColor: colors.isDark ? "rgba(26, 115, 232, 0.2)" : "rgba(26, 115, 232, 0.12)" }]}>
                <MessageCircle size={18} color="#1A73E8" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  Auto-Reply to Reel Comments
                </Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Send instant automated DMs when users comment keywords on your Reels
                </Text>
              </View>
            </View>

            <View style={[styles.featureDivider, { backgroundColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]} />

            <View style={styles.featureRow}>
              <View style={[styles.featureIconBox, getClayIconBoxStyle(colors, colors.accent, 40), { backgroundColor: colors.isDark ? "rgba(255, 109, 0, 0.2)" : "rgba(255, 109, 0, 0.12)" }]}>
                <Zap size={18} color="#FF6D00" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  Smart DM Keyword Triggers
                </Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Automatically reply to inbound DMs 24/7 with custom preset responses
                </Text>
              </View>
            </View>

            <View style={[styles.featureDivider, { backgroundColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]} />

            <View style={styles.featureRow}>
              <View style={[styles.featureIconBox, getClayIconBoxStyle(colors, colors.success, 40), { backgroundColor: colors.isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.12)" }]}>
                <ShieldCheck size={18} color="#10B981" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  100% Safe & Secure
                </Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Built with Official Meta Instagram Graph API — no password sharing
                </Text>
              </View>
            </View>
          </View>

          {/* ─── Trust Footnote ─── */}
          <View style={styles.footerRow}>
            <CheckCircle2 size={14} color={colors.success} />
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Official Meta Verified Partner Application
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Exchange Fullscreen Overlay
  exchangeOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  exchangeCard: {
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    width: "100%",
  },
  exchangeTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },
  exchangeSubtitle: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  // Hero Brand Header
  brandHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBadge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: 66,
    height: 66,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "400",
  },

  // Existing Accounts Card
  accountsCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  refreshBtn: {
    padding: 4,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  accountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accountAvatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  accountName: {
    fontSize: 14.5,
    fontWeight: "600",
  },
  accountStatus: {
    fontSize: 11.5,
    fontWeight: "400",
  },

  // Main Connect Button
  connectButton: {
    borderRadius: 22,
    marginBottom: 20,
    overflow: "hidden",
    padding: 0,
  },
  connectGradient: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  connectButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  igIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  connectButtonTitle: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  connectButtonSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.88)",
    marginTop: 2,
    fontWeight: "400",
    lineHeight: 16,
  },

  // Features Card
  featuresContainer: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 4,
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
  },
  featureDivider: {
    height: 1,
    marginVertical: 10,
  },

  // Footer Trust Row
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "600",
  },
})

