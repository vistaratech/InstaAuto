import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { AutomationRule, TriggerSource, TriggerType, ProButton, InstagramMediaItem } from "../types"
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  ChevronDown,
  Sparkles,
  Film,
  Image as ImageIcon,
  Globe,
} from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const CreateAutomationModal: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const editRule: AutomationRule | undefined = route.params?.editRule

  const [name, setName] = useState(editRule?.name || "")
  const [triggerSource, setTriggerSource] = useState<TriggerSource>(
    editRule?.trigger_source || "comment"
  )
  const [triggerType, setTriggerType] = useState<TriggerType>(
    editRule?.trigger_type || "keyword"
  )
  const [keywordInput, setKeywordInput] = useState("")
  const [keywords, setKeywords] = useState<string[]>(() => {
    if (editRule?.trigger_value && editRule.trigger_value !== "reply_all") {
      return editRule.trigger_value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    }
    return ["link"]
  })

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    editRule?.specific_media_id || null
  )
  const [mediaList, setMediaList] = useState<InstagramMediaItem[]>(() =>
    user?.userId ? apiClient.getCachedMedia(user.userId) : []
  )
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const [message, setMessage] = useState(
    editRule?.response_content?.message || editRule?.response_content?.text || ""
  )
  const [publicReply, setPublicReply] = useState(
    editRule?.response_content?.public_reply || ""
  )
  const [buttons, setButtons] = useState<ProButton[]>(
    editRule?.response_content?.buttons || []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick keyword suggestions
  const keywordSuggestions = ["link", "dm", "price", "info", "send", "details"]

  // Load Instagram posts & reels
  useEffect(() => {
    if (!user?.userId) return
    const fetchMedia = async () => {
      setLoadingMedia(true)
      try {
        const items = await apiClient.getInstagramMedia(user.userId)
        setMediaList(items)
      } catch (e) {
        console.error("Error fetching media", e)
      } finally {
        setLoadingMedia(false)
      }
    }
    fetchMedia()
  }, [user?.userId])

  const addKeyword = (kw: string) => {
    const clean = kw.trim().toLowerCase()
    if (!clean) return
    if (!keywords.includes(clean)) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } catch {}
      setKeywords([...keywords, clean])
    }
    setKeywordInput("")
  }

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw))
  }

  const addButton = () => {
    if (buttons.length >= 3) {
      Alert.alert("Limit reached", "Instagram supports up to 3 action buttons.")
      return
    }
    setButtons([
      ...buttons,
      {
        id: `btn_${Date.now()}`,
        type: "web_url",
        title: "Visit Link",
        url: "https://",
      },
    ])
  }

  const updateButton = (index: number, field: keyof ProButton, value: string) => {
    const updated = [...buttons]
    updated[index] = { ...updated[index], [field]: value }
    setButtons(updated)
  }

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (triggerType === "keyword" && keywords.length === 0) {
      Alert.alert("Keyword Required", "Please add at least one trigger keyword (e.g. link).")
      return
    }
    if (!message.trim()) {
      Alert.alert("Message Required", "Please enter an auto-reply message.")
      return
    }
    if (!user?.userId) return

    const finalTriggerValue = triggerType === "reply_all" ? "reply_all" : keywords.join(",")
    const ruleName = name.trim() || `${keywords[0] || "Keyword"} → Auto Reply`

    setIsSubmitting(true)
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      const contentPayload: any = {
        message: message.trim(),
        text: message.trim(),
        buttons: buttons.filter((b) => b.title.trim()),
      }
      if (triggerSource === "comment" && publicReply.trim()) {
        contentPayload.public_reply = publicReply.trim()
      }

      if (editRule) {
        await apiClient.updateAutomation({
          id: editRule.id,
          name: ruleName,
          trigger_source: triggerSource,
          trigger_type: triggerType,
          trigger_value: finalTriggerValue,
          specific_media_id: selectedMediaId,
          content: contentPayload,
        })
      } else {
        await apiClient.createAutomation({
          userId: user.userId,
          name: ruleName,
          trigger_source: triggerSource,
          trigger_type: triggerType,
          trigger_value: finalTriggerValue,
          specific_media_id: selectedMediaId,
          content: contentPayload,
        })
      }

      navigation.goBack()
    } catch (e) {
      console.error("Save automation error", e)
      Alert.alert("Error", "Could not save automation rule. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMediaItem = mediaList.find((m) => m.id === selectedMediaId)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
            borderBottomColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.closeBtn, getClayIconBoxStyle(colors, colors.textSecondary, 38)]}
        >
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>
          {editRule ? "Edit Automation" : "New Automation"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          style={[styles.saveBtn, getClayButtonStyle(colors, "primary")]}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Step 1: Trigger Platform Selection */}
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Trigger Platform</Text>
        <View style={styles.sourceSelector}>
          {[
            { id: "comment", label: "Comments" },
            { id: "dm", label: "Direct Messages" },
            { id: "story", label: "Story Replies" },
          ].map((src) => {
            const isSelected = triggerSource === src.id
            return (
              <TouchableOpacity
                key={src.id}
                style={[
                  styles.sourceOption,
                  getClayPillStyle(colors, colors.primary, isSelected),
                  { flex: 1, alignItems: "center", justifyContent: "center" },
                ]}
                onPress={() => setTriggerSource(src.id as TriggerSource)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.sourceOptionText,
                    { color: colors.textSecondary },
                    isSelected && { color: "#FFFFFF", fontWeight: "800" },
                  ]}
                >
                  {src.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Step 2: When to reply? Reply to all vs Keyword Match */}
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>When to reply?</Text>
        <Text style={[styles.sectionSubtext, { color: colors.textSecondary }]}>
          Auto-reply when someone comments or messages these keywords.
        </Text>

        <TouchableOpacity
          style={[
            styles.replyAllCard,
            getClayCardStyle(colors),
            triggerType === "reply_all" && {
              borderColor: colors.primary,
              backgroundColor: colors.isDark ? "rgba(26, 115, 232, 0.12)" : "rgba(26, 115, 232, 0.08)",
            },
          ]}
          onPress={() => setTriggerType(triggerType === "reply_all" ? "keyword" : "reply_all")}
          activeOpacity={0.8}
        >
          <View style={styles.replyAllLeft}>
            <View style={[styles.replyAllIcon, getClayIconBoxStyle(colors, colors.primary, 38)]}>
              <Sparkles size={16} color={triggerType === "reply_all" ? colors.primaryLight : colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.replyAllTitle, { color: colors.textPrimary }]}>Reply to All Comments</Text>
              <Text style={[styles.replyAllSubtext, { color: colors.textSecondary }]}>
                Auto-reply to every comment on a post without checking keywords
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.radioDot,
              { borderColor: colors.textMuted },
              triggerType === "reply_all" && { borderColor: colors.primary },
            ]}
          >
            {triggerType === "reply_all" && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
          </View>
        </TouchableOpacity>

        {/* Keyword Tags Input (if not reply all) */}
        {triggerType === "keyword" && (
          <View style={[styles.keywordsBox, getClayCardStyle(colors)]}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>KEYWORDS</Text>
            <View style={[styles.tagsContainer, getClayInsetBoxStyle(colors)]}>
              {keywords.map((kw) => (
                <View
                  key={kw}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: colors.primary,
                      borderBottomWidth: 2,
                      borderBottomColor: "#0F4DA8",
                    },
                  ]}
                >
                  <Text style={styles.tagText}>{kw}</Text>
                  <TouchableOpacity onPress={() => removeKeyword(kw)} style={styles.tagClose}>
                    <X size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}

              <TextInput
                style={[styles.tagInput, { color: colors.textPrimary }]}
                placeholder={keywords.length === 0 ? "Type keyword (e.g. link) & press Enter..." : "Add keyword..."}
                placeholderTextColor={colors.textMuted}
                value={keywordInput}
                onChangeText={setKeywordInput}
                onSubmitEditing={() => addKeyword(keywordInput)}
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>

            {/* Keyword Quick Chips */}
            <View style={styles.suggestionsRow}>
              <Text style={[styles.quickLabel, { color: colors.textMuted }]}>Popular:</Text>
              {keywordSuggestions.map((kw) => (
                <TouchableOpacity
                  key={kw}
                  style={[
                    styles.suggestionChip,
                    getClayPillStyle(colors, colors.primary, false),
                  ]}
                  onPress={() => addKeyword(kw)}
                >
                  <Text style={[styles.suggestionText, { color: colors.primaryLight }]}>+{kw}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: POST / REEL PICKER (OPTIONAL) */}
        <Text style={[styles.sectionHeading, { marginTop: 18, color: colors.textPrimary }]}>
          POST / REEL (OPTIONAL)
        </Text>

        <TouchableOpacity
          style={[styles.mediaPickerBtn, getClayCardStyle(colors)]}
          onPress={() => setIsPickerOpen(true)}
          activeOpacity={0.8}
        >
          {selectedMediaItem ? (
            <View style={styles.selectedMediaRow}>
              {selectedMediaItem.thumbnail_url || selectedMediaItem.media_url ? (
                <Image
                  source={{ uri: selectedMediaItem.thumbnail_url || selectedMediaItem.media_url }}
                  style={styles.selectedThumbnail}
                />
              ) : (
                <View style={[styles.mediaIconPlaceholder, getClayIconBoxStyle(colors, colors.secondary, 44)]}>
                  <Film size={18} color={colors.secondary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.selectedMediaCaption, { color: colors.textPrimary }]} numberOfLines={2}>
                  {selectedMediaItem.caption || "Instagram Reel/Post"}
                </Text>
                <Text style={[styles.selectedMediaType, { color: colors.primaryLight }]}>
                  {selectedMediaItem.media_type === "VIDEO" ? "REEL SPECIFIC" : "POST SPECIFIC"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation?.()
                  setSelectedMediaId(null)
                }}
                style={[styles.clearMediaBtn, getClayIconBoxStyle(colors, colors.textMuted, 30)]}
              >
                <X size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.unselectedMediaRow}>
              <Globe size={18} color={colors.primaryLight} />
              <Text style={[styles.unselectedMediaText, { color: colors.textSecondary }]}>
                Optional — applies to all posts & Reels (tap to pick specific Reel)
              </Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </View>
          )}
        </TouchableOpacity>

        {/* Step 4: Auto-Response Message */}
        <Text style={[styles.sectionHeading, { marginTop: 18, color: colors.textPrimary }]}>
          Auto-Response DM Message
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textarea,
            getClayInsetBoxStyle(colors),
            {
              color: colors.textPrimary,
            },
          ]}
          placeholder="Hey! Here is the link you requested: https://..."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Public comment reply (if comment trigger) */}
        {triggerSource === "comment" && (
          <View style={{ marginTop: 14 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Public Comment Reply (Under their comment)
            </Text>
            <TextInput
              style={[
                styles.input,
                getClayInsetBoxStyle(colors),
                {
                  color: colors.textPrimary,
                },
              ]}
              placeholder="e.g., Check your DMs! 📩"
              placeholderTextColor={colors.textMuted}
              value={publicReply}
              onChangeText={setPublicReply}
            />
          </View>
        )}

        {/* Action Button Links */}
        <View style={styles.buttonHeaderRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Link Buttons (Optional)</Text>
          {buttons.length === 0 && (
            <TouchableOpacity onPress={addButton} style={styles.addBtnSmall}>
              <Plus size={14} color={colors.primaryLight} />
              <Text style={[styles.addBtnText, { color: colors.primaryLight }]}>+ Add Link Button</Text>
            </TouchableOpacity>
          )}
        </View>

        {buttons.map((btn, index) => (
          <View
            key={btn.id || index}
            style={[styles.buttonCard, getClayCardStyle(colors)]}
          >
            <View style={styles.buttonCardTop}>
              <Text style={[styles.buttonCardIndex, { color: colors.textSecondary }]}>Button #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeButton(index)}>
                <Trash2 size={15} color={colors.danger} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.inputSmall,
                getClayInsetBoxStyle(colors),
                { color: colors.textPrimary },
              ]}
              placeholder="Button Title (e.g. Open Website)"
              placeholderTextColor={colors.textMuted}
              value={btn.title}
              onChangeText={(val) => updateButton(index, "title", val)}
            />
            <TextInput
              style={[
                styles.inputSmall,
                getClayInsetBoxStyle(colors),
                { marginTop: 8, color: colors.textPrimary },
              ]}
              placeholder="URL (e.g. https://dmspark.app)"
              placeholderTextColor={colors.textMuted}
              value={btn.url}
              onChangeText={(val) => updateButton(index, "url", val)}
              autoCapitalize="none"
            />
          </View>
        ))}

        {/* Live DM Preview */}
        <View style={[styles.previewContainer, getClayCardStyle(colors)]}>
          <View style={styles.previewHeader}>
            <Eye size={16} color={colors.accent} />
            <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>Live Instagram DM Simulator</Text>
            <View style={styles.simulatorLivePill}>
              <View style={styles.simulatorLiveDot} />
              <Text style={styles.simulatorLiveText}>PREVIEW</Text>
            </View>
          </View>
          <View style={[styles.dmBubble, getClayInsetBoxStyle(colors)]}>
            <View style={styles.dmHeaderRow}>
              <Text style={[styles.dmSender, { color: colors.accent }]}>@{user?.username || "creator"}</Text>
              <Text style={[styles.dmTime, { color: colors.textMuted }]}>Just now</Text>
            </View>
            <Text style={[styles.dmText, { color: colors.textPrimary }]}>
              {message.trim() || "Type your response message above to see how it looks to followers..."}
            </Text>
            {buttons.map((b, i) => (
              <View
                key={i}
                style={[
                  styles.dmButton,
                  getClayCardStyle(colors),
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.dmButtonText, { color: colors.primaryLight }]}>{b.title || "Button Link"}</Text>
                <ExternalLink size={12} color={colors.primaryLight} />
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Save Button */}
        <TouchableOpacity
          style={[styles.bottomSaveBtn, getClayButtonStyle(colors, "primary")]}
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.bottomSaveBtnText}>Save & Activate Automation</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ─── POST / REEL PICKER MODAL ─── */}
      <Modal
        visible={isPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: colors.surface, paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={[styles.pickerHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.pickerTitle, { color: colors.textPrimary }]}>Select Instagram Post / Reel</Text>
              <TouchableOpacity onPress={() => setIsPickerOpen(false)} style={styles.pickerClose}>
                <X size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Global Any Post Option */}
            <TouchableOpacity
              style={[
                styles.mediaItem,
                getClayCardStyle(colors),
                selectedMediaId === null && { borderColor: colors.primary, backgroundColor: colors.primaryGlow },
              ]}
              onPress={() => {
                setSelectedMediaId(null)
                setIsPickerOpen(false)
              }}
            >
              <View style={[styles.globalIconBox, getClayIconBoxStyle(colors, colors.primary, 44)]}>
                <Globe size={20} color={colors.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.mediaItemCaption, { color: colors.textPrimary }]}>All Posts & Reels (Global)</Text>
                <Text style={[styles.mediaItemType, { color: colors.textSecondary }]}>
                  Trigger when anyone comments on ANY of your posts
                </Text>
              </View>
              {selectedMediaId === null && <Check size={18} color={colors.primaryLight} />}
            </TouchableOpacity>

            {loadingMedia ? (
              <View style={styles.mediaLoadingBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.mediaLoadingText, { color: colors.textSecondary }]}>
                  Fetching your Instagram Posts & Reels...
                </Text>
              </View>
            ) : (
              <FlatList
                data={mediaList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedMediaId === item.id
                  const isVideo = item.media_type === "VIDEO"

                  return (
                    <TouchableOpacity
                      style={[
                        styles.mediaItem,
                        getClayCardStyle(colors),
                        isSelected && { borderColor: colors.primary, backgroundColor: colors.primaryGlow },
                      ]}
                      onPress={() => {
                        setSelectedMediaId(item.id)
                        setIsPickerOpen(false)
                      }}
                      activeOpacity={0.7}
                    >
                      {item.thumbnail_url || item.media_url ? (
                        <Image
                          source={{ uri: item.thumbnail_url || item.media_url }}
                          style={styles.mediaItemThumbnail}
                        />
                      ) : (
                        <View style={[styles.mediaIconPlaceholder, getClayIconBoxStyle(colors, colors.primary, 44)]}>
                          {isVideo ? (
                            <Film size={18} color={colors.primaryLight} />
                          ) : (
                            <ImageIcon size={18} color={colors.textMuted} />
                          )}
                        </View>
                      )}

                      <View style={{ flex: 1 }}>
                        <Text style={[styles.mediaItemCaption, { color: colors.textPrimary }]} numberOfLines={2}>
                          {item.caption || "Untitled Instagram post"}
                        </Text>
                        <View style={styles.mediaTagRow}>
                          <View style={[styles.mediaTypePill, getClayPillStyle(colors, colors.primary, true)]}>
                            <Text style={[styles.mediaTypePillText, { color: "#FFFFFF" }]}>
                              {isVideo ? "REEL" : "POST"}
                            </Text>
                          </View>
                          {item.timestamp && (
                            <Text style={[styles.mediaTimestamp, { color: colors.textMuted }]}>
                              {new Date(item.timestamp).toLocaleDateString()}
                            </Text>
                          )}
                        </View>
                      </View>

                      {isSelected && <Check size={18} color={colors.primaryLight} />}
                    </TouchableOpacity>
                  )
                }}
                ListEmptyComponent={
                  <View style={styles.emptyMediaBox}>
                    <Text style={[styles.emptyMediaText, { color: colors.textMuted }]}>No Instagram posts found.</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12.5,
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: "700",
    marginBottom: 3,
  },
  sectionSubtext: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "400",
  },
  sourceSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  sourceOption: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
  },
  sourceOptionText: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  replyAllCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  replyAllLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  replyAllIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  replyAllTitle: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  replyAllSubtext: {
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: "400",
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  keywordsBox: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 14,
    padding: 8,
    gap: 6,
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tagClose: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tagInput: {
    flex: 1,
    minWidth: 120,
    fontSize: 13,
    paddingVertical: 4,
    fontWeight: "600",
  },
  suggestionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: "700",
  },
  mediaPickerBtn: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
  },
  unselectedMediaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  unselectedMediaText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  selectedMediaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  mediaIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMediaCaption: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
  selectedMediaType: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  clearMediaBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    fontWeight: "500",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 6,
  },
  addBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  buttonCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  buttonCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonCardIndex: {
    fontSize: 11,
    fontWeight: "800",
  },
  inputSmall: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "500",
  },
  previewContainer: {
    borderRadius: 22,
    padding: 16,
    marginTop: 18,
    borderWidth: 1.5,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: "900",
    flex: 1,
  },
  simulatorLivePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  simulatorLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  simulatorLiveText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  dmBubble: {
    borderRadius: 20,
    padding: 14,
  },
  dmHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dmSender: {
    fontSize: 12,
    fontWeight: "700",
  },
  dmTime: {
    fontSize: 10.5,
    fontWeight: "400",
  },
  dmText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  dmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 8,
  },
  dmButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bottomSaveBtn: {
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 22,
  },
  bottomSaveBtnText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "80%",
    padding: 18,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  pickerClose: {
    padding: 4,
  },
  globalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1.5,
  },
  mediaItemThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  mediaItemCaption: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
  mediaItemType: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  mediaTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  mediaTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  mediaTypePillText: {
    fontSize: 9.5,
    fontWeight: "800",
  },
  mediaTimestamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  mediaLoadingBox: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  mediaLoadingText: {
    fontSize: 12,
  },
  emptyMediaBox: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyMediaText: {
    fontSize: 13,
  },
})

