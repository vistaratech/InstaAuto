import React from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { AutomationRule, InstagramMediaItem } from "../../types"
import { Badge } from "./Badge"
import { Trash2, Edit3, CornerDownRight, ExternalLink, Globe, Film } from "lucide-react-native"
import { getClayCardStyle, getClayIconBoxStyle, getClayInsetBoxStyle } from "../../theme/clayStyles"
import * as Haptics from "expo-haptics"

interface AutomationCardProps {
  automation: AutomationRule
  mediaItem?: InstagramMediaItem
  onToggle: (id: string, active: boolean) => void
  onEdit: (automation: AutomationRule) => void
  onDelete: (id: string) => void
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  mediaItem,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme()

  const handleToggle = (val: boolean) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {}
    onToggle(automation.id, val)
  }

  const handleDelete = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    } catch {}
    onDelete(automation.id)
  }

  const responseText =
    automation.response_content?.message ||
    automation.response_content?.text ||
    "Auto-response configured"

  const buttons = automation.response_content?.buttons || []
  const isPostSpecific = !!automation.specific_media_id

  return (
    <View
      style={[
        styles.card,
        getClayCardStyle(colors),
        {
          borderColor: automation.is_active ? colors.borderActive : colors.border,
          opacity: automation.is_active ? 1 : 0.7,
        },
      ]}
    >
      {/* Top row */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Badge type={automation.trigger_source} />
          {isPostSpecific ? (
            <View
              style={[
                styles.specificPostTag,
                {
                  backgroundColor: colors.isDark ? "rgba(255, 109, 0, 0.18)" : "rgba(255, 109, 0, 0.12)",
                  borderColor: colors.isDark ? "rgba(255, 109, 0, 0.3)" : "rgba(255, 109, 0, 0.2)",
                },
              ]}
            >
              <Film size={11} color={colors.accent} />
              <Text style={[styles.specificPostTagText, { color: colors.accent }]}>REEL SPECIFIC</Text>
            </View>
          ) : (
            <View
              style={[
                styles.globalTag,
                {
                  backgroundColor: colors.isDark ? "rgba(26, 115, 232, 0.18)" : "rgba(26, 115, 232, 0.12)",
                  borderColor: colors.isDark ? "rgba(26, 115, 232, 0.3)" : "rgba(26, 115, 232, 0.2)",
                },
              ]}
            >
              <Globe size={11} color={colors.primaryLight} />
              <Text style={[styles.globalTagText, { color: colors.primaryLight }]}>ALL POSTS</Text>
            </View>
          )}
        </View>

        <Switch
          value={automation.is_active}
          onValueChange={handleToggle}
          trackColor={{ false: colors.surfaceInset, true: colors.primary }}
          thumbColor={automation.is_active ? "#FFFFFF" : colors.textMuted}
        />
      </View>

      {/* Post Thumbnail info if attached to specific Reel/Post */}
      {isPostSpecific && mediaItem && (
        <View style={[styles.mediaAttachedRow, getClayInsetBoxStyle(colors)]}>
          {mediaItem.thumbnail_url || mediaItem.media_url ? (
            <Image
              source={{ uri: mediaItem.thumbnail_url || mediaItem.media_url }}
              style={styles.mediaThumbnail}
            />
          ) : (
            <View style={[styles.mediaIconPlaceholder, { backgroundColor: colors.surfaceElevated }]}>
              <Film size={14} color={colors.primaryLight} />
            </View>
          )}
          <Text style={[styles.mediaCaptionText, { color: colors.textSecondary }]} numberOfLines={1}>
            {mediaItem.caption || "Specific Instagram Reel / Post"}
          </Text>
        </View>
      )}

      {/* Automation Name */}
      <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
        {automation.name}
      </Text>

      {/* Trigger Keyword box */}
      <View style={styles.keywordBox}>
        <Text style={[styles.keywordLabel, { color: colors.textSecondary }]}>Keyword Trigger:</Text>
        <View style={[styles.keywordPill, getClayInsetBoxStyle(colors)]}>
          <Text style={[styles.keywordText, { color: colors.accent }]}>
            {automation.trigger_type === "reply_all"
              ? "All Comments (Instant)"
              : automation.trigger_value}
          </Text>
        </View>
      </View>

      {/* Response Preview */}
      <View style={[styles.responseBox, getClayInsetBoxStyle(colors)]}>
        <CornerDownRight size={15} color={colors.primaryLight} style={{ marginTop: 2 }} />
        <Text style={[styles.responseText, { color: colors.textPrimary }]} numberOfLines={3}>
          {responseText}
        </Text>
      </View>

      {/* Buttons Preview if any */}
      {buttons.length > 0 && (
        <View style={styles.buttonsContainer}>
          {buttons.map((btn, index) => (
            <View
              key={btn.id || index}
              style={[
                styles.buttonPill,
                {
                  backgroundColor: colors.isDark ? "rgba(225, 48, 108, 0.16)" : "rgba(225, 48, 108, 0.1)",
                  borderColor: colors.isDark ? "rgba(225, 48, 108, 0.3)" : "rgba(225, 48, 108, 0.2)",
                },
              ]}
            >
              <ExternalLink size={11} color={colors.secondary} />
              <Text style={[styles.buttonPillText, { color: colors.secondary }]}>{btn.title}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer / Actions */}
      <View style={[styles.footer, { borderTopColor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}>
        <Text style={[styles.dateText, { color: colors.textMuted }]}>
          Created: {new Date(automation.created_at).toLocaleDateString()}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, getClayIconBoxStyle(colors, colors.primary, 36)]}
            onPress={() => onEdit(automation)}
            activeOpacity={0.7}
          >
            <Edit3 size={15} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              getClayIconBoxStyle(colors, colors.danger, 36),
              { backgroundColor: colors.isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.12)" },
            ]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={15} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  specificPostTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  specificPostTagText: {
    fontSize: 9.5,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  globalTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  globalTagText: {
    fontSize: 9.5,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  mediaAttachedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  mediaThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  mediaIconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaCaptionText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 16,
  },
  name: {
    fontSize: 15.5,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 8,
    lineHeight: 20,
  },
  keywordBox: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  keywordLabel: {
    fontSize: 12,
    fontWeight: "400",
  },
  keywordPill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: "600",
  },
  responseBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  responseText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    fontWeight: "400",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  buttonPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  buttonPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "400",
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    flexShrink: 0,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
})

