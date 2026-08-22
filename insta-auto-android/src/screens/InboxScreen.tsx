import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { Conversation } from "../types"
import { Search, MessageSquare, ChevronRight, User, Activity, Clock } from "lucide-react-native"
import {
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const InboxScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()

  // Instant 0ms cache initialization
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    user?.userId ? apiClient.getCachedConversations(user.userId) : []
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const loadInbox = useCallback(async (isManual = false) => {
    if (!user?.userId) return
    if (isManual) setRefreshing(true)

    try {
      const data = await apiClient.getConversations(user.userId)
      setConversations(data)
    } catch (e) {
      console.warn("Error loading inbox", e)
    } finally {
      setRefreshing(false)
    }
  }, [user?.userId])

  useEffect(() => {
    loadInbox()
  }, [loadInbox])

  const filtered = conversations.filter((c) =>
    c.recipient_username.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const renderItem = ({ item }: { item: Conversation }) => {
    const initial = (item.recipient_username || "U")[0].toUpperCase()

    return (
      <TouchableOpacity
        style={[styles.chatCard, getClayCardStyle(colors)]}
        onPress={() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          } catch {}
          navigation.navigate("ChatThread", {
            conversationId: item.id,
            recipientId: item.recipient_id,
            recipientUsername: item.recipient_username,
          })
        }}
        activeOpacity={0.75}
      >
        <View style={[styles.avatar, getClayIconBoxStyle(colors, colors.secondary, 46)]}>
          <Text style={[styles.avatarText, { color: colors.secondary }]}>{initial}</Text>
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.topRow}>
            <Text style={[styles.username, { color: colors.textPrimary }]}>@{item.recipient_username}</Text>
            <View style={styles.timeBadge}>
              <Clock size={11} color={colors.textMuted} />
              <Text style={[styles.timeText, { color: colors.textMuted }]}>
                {getTimeAgo(item.last_message_at)}
              </Text>
            </View>
          </View>
          <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.last_message || "Tap to view conversation history"}
          </Text>
        </View>

        <ChevronRight size={18} color={colors.textMuted} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Follower Inbox</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Real-time Instagram direct message threads
            </Text>
          </View>
          <View
            style={[
              styles.syncPill,
              {
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.18)" : "rgba(5, 150, 105, 0.12)",
                borderColor: isDark ? "rgba(16, 185, 129, 0.35)" : "rgba(5, 150, 105, 0.25)",
              },
            ]}
          >
            <Activity size={12} color={colors.success} />
            <Text style={[styles.syncText, { color: colors.success }]}>LIVE SYNC</Text>
          </View>
        </View>

        <View style={[styles.searchBar, getClayInsetBoxStyle(colors)]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search conversations by username..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadInbox(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={[styles.emptyContainer, getClayCardStyle(colors)]}>
            <View style={[styles.emptyIconBox, getClayIconBoxStyle(colors, colors.secondary, 56)]}>
              <MessageSquare size={30} color={colors.secondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No messages yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              When followers DM you on Instagram, their conversations will appear here in real-time.
            </Text>
          </View>
        }
      />
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  syncPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  syncText: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "400",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingBottom: 95,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 13,
    marginBottom: 8,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  chatInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  username: {
    fontSize: 14.5,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "400",
  },
  lastMessage: {
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 17,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginVertical: 20,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15.5,
    fontWeight: "700",
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "400",
    paddingHorizontal: 16,
  },
})


