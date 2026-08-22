import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AutomationCard } from "../components/common/AutomationCard"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { AutomationRule, TriggerSource, InstagramMediaItem } from "../types"
import { Plus, Search, Sparkles, Filter } from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

type FilterTab = "all" | TriggerSource | "post_specific"

export const AutomationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()

  // Instant 0ms cache initialization
  const [automations, setAutomations] = useState<AutomationRule[]>(() =>
    user?.userId ? apiClient.getCachedAutomations(user.userId) : []
  )
  const [mediaList, setMediaList] = useState<InstagramMediaItem[]>(() =>
    user?.userId ? apiClient.getCachedMedia(user.userId) : []
  )
  const [filteredList, setFilteredList] = useState<AutomationRule[]>([])
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const loadAutomations = useCallback(async (isManual = false) => {
    if (!user?.userId) return
    if (isManual) setRefreshing(true)

    try {
      const [rules, media] = await Promise.all([
        apiClient.getAutomations(user.userId),
        apiClient.getInstagramMedia(user.userId),
      ])
      setAutomations(rules)
      setMediaList(media)
    } catch (e) {
      console.warn("Background automations load error", e)
    } finally {
      setRefreshing(false)
    }
  }, [user?.userId])

  useEffect(() => {
    loadAutomations()
  }, [loadAutomations])

  useEffect(() => {
    let result = automations

    if (activeTab === "post_specific") {
      result = result.filter((item) => !!item.specific_media_id)
    } else if (activeTab !== "all") {
      result = result.filter((item) => item.trigger_source === activeTab)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.trigger_value.toLowerCase().includes(q)
      )
    }

    setFilteredList(result)
  }, [automations, activeTab, searchQuery])

  const handleToggle = async (id: string, active: boolean) => {
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: active } : item))
    )
    const target = automations.find((item) => item.id === id)
    if (!target) return
    try {
      await apiClient.updateAutomation({
        id: target.id,
        name: target.name,
        trigger_source: target.trigger_source,
        trigger_type: target.trigger_type,
        trigger_value: target.trigger_value,
        specific_media_id: target.specific_media_id,
        content: target.response_content,
      })
    } catch (e) {
      console.error("Toggle error", e)
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Automation",
      "Are you sure you want to delete this automation rule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.userId) return
            try {
              await apiClient.deleteAutomation(id, user.userId)
              setAutomations((prev) => prev.filter((item) => item.id !== id))
            } catch (e) {
              Alert.alert("Error", "Could not delete automation")
            }
          },
        },
      ]
    )
  }

  const handleEdit = (rule: AutomationRule) => {
    navigation.navigate("CreateModal", { editRule: rule })
  }

  const handleCreate = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {}
    navigation.navigate("CreateModal")
  }

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: `All (${automations.length})` },
    { id: "comment", label: "Comments" },
    { id: "dm", label: "DMs" },
    { id: "post_specific", label: "Reels" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
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
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>DM Automations</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {automations.length} auto-reply rules configured
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtnHeader, getClayButtonStyle(colors, "primary")]}
            onPress={handleCreate}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addBtnHeaderGradient}
            >
              <Plus size={15} color="#FFFFFF" />
              <Text style={styles.addBtnHeaderText}>New Rule</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, getClayInsetBoxStyle(colors)]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search keywords (e.g. link, dm, price)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                getClayPillStyle(colors, colors.primary, isActive),
              ]}
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                } catch {}
                setActiveTab(tab.id)
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textSecondary },
                  isActive && { color: "#FFFFFF", fontWeight: "700" },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Automations List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const mediaItem = mediaList.find((m) => m.id === item.specific_media_id)
          return (
            <AutomationCard
              automation={item}
              mediaItem={mediaItem}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAutomations(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={[styles.emptyContainer, getClayCardStyle(colors)]}>
            <View style={[styles.emptyIconBox, getClayIconBoxStyle(colors, colors.primary, 52)]}>
              <Sparkles size={28} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No rules found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Tap "+ New Rule" above to auto-reply to Instagram DMs or comments.
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
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
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
  addBtnHeader: {
    borderRadius: 14,
    overflow: "hidden",
    padding: 0,
    flexShrink: 0,
  },
  addBtnHeaderGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addBtnHeaderText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "400",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 110,
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
    width: 48,
    height: 48,
    borderRadius: 16,
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
  },
})

