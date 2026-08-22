import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Header } from "../components/common/Header"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { AutomationRule, Conversation } from "../types"
import {
  Zap,
  MessageSquare,
  MessageCircle,
  Plus,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Flame,
} from "lucide-react-native"
import * as Haptics from "expo-haptics"

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "comment" | "dm">("all")

  // Instant cache initialization
  const [automations, setAutomations] = useState<AutomationRule[]>(() =>
    user?.userId ? apiClient.getCachedAutomations(user.userId) : []
  )
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    user?.userId ? apiClient.getCachedConversations(user.userId) : []
  )
  const [isMasterActive, setIsMasterActive] = useState(true)

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (!user?.userId) return
    if (isManualRefresh) setRefreshing(true)

    try {
      const [rules, chats] = await Promise.all([
        apiClient.getAutomations(user.userId),
        apiClient.getConversations(user.userId),
      ])
      setAutomations(rules)
      setConversations(chats)
    } catch (e) {
      console.warn("Background load error", e)
    } finally {
      setRefreshing(false)
    }
  }, [user?.userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {}
    loadData(true)
  }

  const toggleMaster = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {}
    setIsMasterActive(!isMasterActive)
  }

  const commentCount = useMemo(
    () => automations.filter((a) => a.trigger_source === "comment").length,
    [automations]
  )
  const dmCount = useMemo(
    () => automations.filter((a) => a.trigger_source === "dm").length,
    [automations]
  )

  const filteredAutomations = useMemo(() => {
    if (activeFilter === "all") return automations
    return automations.filter((a) => a.trigger_source === activeFilter)
  }, [automations, activeFilter])

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "Just now"
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ─── 1. Clean Autopilot Status Banner ─── */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: isDark ? "rgba(17, 24, 39, 0.85)" : "#FFFFFF",
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            },
          ]}
        >
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusIndicatorCircle,
                {
                  backgroundColor: isMasterActive
                    ? isDark ? "rgba(16, 185, 129, 0.16)" : "rgba(16, 185, 129, 0.12)"
                    : isDark ? "rgba(245, 158, 11, 0.16)" : "rgba(245, 158, 11, 0.12)",
                },
              ]}
            >
              <View
                style={[
                  styles.statusIndicatorDot,
                  { backgroundColor: isMasterActive ? colors.success : colors.warning },
                ]}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                {isMasterActive ? "Autopilot Active" : "Autopilot Paused"}
              </Text>
              <Text style={[styles.statusSubtitle, { color: colors.textMuted }]}>
                {isMasterActive
                  ? `${automations.filter((a) => a.is_active).length} rules running 24/7`
                  : "Tap switch to resume auto-replies"}
              </Text>
            </View>
          </View>
          <Switch
            value={isMasterActive}
            onValueChange={toggleMaster}
            trackColor={{
              false: isDark ? "#1F2937" : "#E2E8F0",
              true: colors.success,
            }}
            thumbColor="#FFFFFF"
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          />
        </View>

        {/* ─── 2. Minimalist Quick Stats (3 Columns) ─── */}
        <View style={styles.statsGrid}>
          {/* Card 1: Active Rules */}
          <TouchableOpacity
            style={[
              styles.statCard,
              {
                backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "#FFFFFF",
                borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            onPress={() => navigation.navigate("Automations")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <Zap size={16} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {automations.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Rules</Text>
          </TouchableOpacity>

          {/* Card 2: Comments */}
          <TouchableOpacity
            style={[
              styles.statCard,
              {
                backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "#FFFFFF",
                borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            onPress={() => {
              setActiveFilter("comment")
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "rgba(249, 115, 22, 0.1)" },
              ]}
            >
              <MessageCircle size={16} color={colors.accent} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {commentCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Comments</Text>
          </TouchableOpacity>

          {/* Card 3: DM Triggers */}
          <TouchableOpacity
            style={[
              styles.statCard,
              {
                backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "#FFFFFF",
                borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            onPress={() => {
              setActiveFilter("dm")
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: isDark ? "rgba(236, 72, 153, 0.15)" : "rgba(236, 72, 153, 0.1)" },
              ]}
            >
              <MessageSquare size={16} color={colors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {dmCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>DMs</Text>
          </TouchableOpacity>
        </View>

        {/* ─── 3. Sleek Action Button: + New Automation ─── */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            } catch {}
            navigation.navigate("CreateModal")
          }}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={["#2563EB", "#1D4ED8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createButtonGradient}
          >
            <View style={styles.createButtonLeft}>
              <View style={styles.createPlusCircle}>
                <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.createButtonText}>Create New Automation</Text>
            </View>
            <ArrowUpRight size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* ─── 4. Section Title & Clean Filter Pills ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Automations
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Automations")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.viewAllLink, { color: colors.primary }]}>View All →</Text>
          </TouchableOpacity>
        </View>

        {/* Clean Filter Tabs */}
        <View style={styles.filterRow}>
          {(
            [
              { key: "all", label: "All", count: automations.length },
              { key: "comment", label: "Comments", count: commentCount },
              { key: "dm", label: "Direct Messages", count: dmCount },
            ] as const
          ).map((tab) => {
            const isSelected = activeFilter === tab.key
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => {
                  try {
                    Haptics.selectionAsync()
                  } catch {}
                  setActiveFilter(tab.key)
                }}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? "rgba(31, 41, 55, 0.7)"
                      : "#F1F5F9",
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? "#FFFFFF" : colors.textMuted },
                  ]}
                >
                  {tab.label} {tab.count > 0 ? `(${tab.count})` : ""}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* ─── 5. Clean Automation Rule Cards ─── */}
        <View style={styles.rulesContainer}>
          {filteredAutomations.slice(0, 6).map((item) => {
            const isComment = item.trigger_source === "comment"
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cleanRuleCard,
                  {
                    backgroundColor: isDark ? "rgba(17, 24, 39, 0.75)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
                onPress={() => navigation.navigate("CreateModal", { editRule: item })}
                activeOpacity={0.7}
              >
                {/* Left Icon */}
                <View
                  style={[
                    styles.ruleIconCircle,
                    {
                      backgroundColor: isComment
                        ? isDark ? "rgba(249, 115, 22, 0.16)" : "rgba(249, 115, 22, 0.1)"
                        : isDark ? "rgba(59, 130, 246, 0.16)" : "rgba(59, 130, 246, 0.1)",
                    },
                  ]}
                >
                  {isComment ? (
                    <MessageCircle size={18} color={colors.accent} />
                  ) : (
                    <Zap size={18} color={colors.primary} />
                  )}
                </View>

                {/* Middle Info */}
                <View style={styles.ruleCenterInfo}>
                  <View style={styles.ruleTitleRow}>
                    <Text style={[styles.ruleName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={[styles.ruleSnippet, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.trigger_type === "reply_all"
                      ? "Trigger: All Comments"
                      : `Keyword: "${item.trigger_value || ""}"`}
                  </Text>
                </View>

                {/* Right Status */}
                <View style={styles.ruleRightBadge}>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: item.is_active
                          ? isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)"
                          : isDark ? "rgba(156, 163, 175, 0.14)" : "rgba(156, 163, 175, 0.1)",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusSmallDot,
                        { backgroundColor: item.is_active ? colors.success : "#9CA3AF" },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusPillLabel,
                        { color: item.is_active ? colors.success : colors.textMuted },
                      ]}
                    >
                      {item.is_active ? "Active" : "Off"}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            )
          })}

          {filteredAutomations.length === 0 && (
            <View
              style={[
                styles.emptyBox,
                {
                  backgroundColor: isDark ? "rgba(17, 24, 39, 0.5)" : "#FFFFFF",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
                },
              ]}
            >
              <Sparkles size={28} color={colors.primary} style={{ marginBottom: 10 }} />
              <Text style={[styles.emptyBoxTitle, { color: colors.textPrimary }]}>
                No {activeFilter !== "all" ? activeFilter.toUpperCase() : ""} automations
              </Text>
              <Text style={[styles.emptyBoxSub, { color: colors.textMuted }]}>
                Tap the create button above to add your first auto-reply rule!
              </Text>
            </View>
          )}
        </View>

        {/* ─── 6. Clean Recent Inbox Section (Minimal 2-items) ─── */}
        {conversations.length > 0 && (
          <View style={styles.inboxSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                Recent Inbox
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Inbox")}>
                <Text style={[styles.viewAllLink, { color: colors.primary }]}>
                  View All ({conversations.length}) →
                </Text>
              </TouchableOpacity>
            </View>

            {conversations.slice(0, 2).map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={[
                  styles.cleanChatRow,
                  {
                    backgroundColor: isDark ? "rgba(17, 24, 39, 0.75)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
                onPress={() =>
                  navigation.navigate("ChatThread", {
                    conversationId: chat.id,
                    recipientUsername: chat.recipient_username,
                    recipientId: chat.recipient_id,
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.chatAvatarBox,
                    { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" },
                  ]}
                >
                  <Text style={[styles.chatAvatarLetter, { color: colors.primary }]}>
                    {(chat.recipient_username || "U")[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.chatInfo}>
                  <Text style={[styles.chatUsername, { color: colors.textPrimary }]} numberOfLines={1}>
                    @{chat.recipient_username}
                  </Text>
                  <Text style={[styles.chatTimeText, { color: colors.textMuted }]}>
                    {getTimeAgo(chat.last_message_at)}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── 7. Subtle Footer ─── */}
        <View style={styles.minimalFooter}>
          <ShieldCheck size={13} color={colors.success} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Meta Instagram Graph API Connected · 100% Cloud Synced
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },

  // 1. Status Card
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  statusIndicatorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIndicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  statusSubtitle: {
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: "400",
  },

  // 2. Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  // 3. Create Button
  createButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  createButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  createPlusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },

  // 4. Section Header & Filters
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  viewAllLink: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // 5. Rules List
  rulesContainer: {
    gap: 9,
    marginBottom: 18,
  },
  cleanRuleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  ruleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleCenterInfo: {
    flex: 1,
  },
  ruleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ruleName: {
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  ruleSnippet: {
    fontSize: 11.5,
    marginTop: 2,
  },
  ruleRightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusSmallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Empty State
  emptyBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBoxTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  emptyBoxSub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 16,
  },

  // 6. Recent Inbox
  inboxSection: {
    marginBottom: 16,
  },
  cleanChatRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  chatAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarLetter: {
    fontSize: 14,
    fontWeight: "700",
  },
  chatInfo: {
    flex: 1,
  },
  chatUsername: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  chatTimeText: {
    fontSize: 11,
    marginTop: 1,
  },

  // 7. Minimal Footer
  minimalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 10.5,
    fontWeight: "400",
  },
})


