import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { ReelScheduleItem } from "../types"
import * as ImagePicker from "expo-image-picker"
import {
  Film,
  Upload,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const PublisherScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const [queue, setQueue] = useState<ReelScheduleItem[]>([])
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [intervalHours, setIntervalHours] = useState("4")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadQueue = async () => {
    if (!user?.userId) return
    try {
      const data = await apiClient.getReelsPool(user.userId)
      setQueue(data)
    } catch (e) {
      console.error("Error loading reels pool", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [user?.userId])

  const pickVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert("Permission needed", "Access to gallery is required to select videos.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedVideoUri(result.assets[0].uri)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } catch (e) {
      Alert.alert("Error", "Could not pick video from gallery.")
    }
  }

  const handleAddToQueue = async () => {
    if (!selectedVideoUri) {
      Alert.alert("Video required", "Please select a video from your gallery first.")
      return
    }

    setUploading(true)
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      const newItem: ReelScheduleItem = {
        id: `reel_${Date.now()}`,
        video_url: selectedVideoUri,
        caption: caption.trim(),
        is_active: true,
        sequence_index: queue.length + 1,
        created_at: new Date().toISOString(),
        status: "PENDING",
      }
      setQueue([newItem, ...queue])
      setSelectedVideoUri(null)
      setCaption("")
      Alert.alert("Success", "Reel added to auto-publish pool!")
    } catch (e) {
      Alert.alert("Error", "Failed to queue Reel.")
    } finally {
      setUploading(false)
    }
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reels Auto-Scheduler</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Queue videos and automatically publish to Instagram Reels
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload Card */}
        <View style={[styles.uploadCard, getClayCardStyle(colors)]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Add Video to Publishing Pool</Text>

          <TouchableOpacity
            style={[styles.dropzone, getClayInsetBoxStyle(colors)]}
            onPress={pickVideo}
            activeOpacity={0.8}
          >
            {selectedVideoUri ? (
              <View style={styles.selectedVideoInfo}>
                <View style={[styles.videoIconBox, getClayIconBoxStyle(colors, colors.primary, 52)]}>
                  <Film size={26} color={colors.primaryLight} />
                </View>
                <Text style={[styles.videoSelectedText, { color: colors.success }]}>Video Selected Ready</Text>
                <Text style={[styles.videoUriText, { color: colors.textMuted }]} numberOfLines={1}>
                  {selectedVideoUri}
                </Text>
                <Text style={[styles.changeText, { color: colors.primaryLight }]}>Tap to change video</Text>
              </View>
            ) : (
              <View style={styles.emptyDropzone}>
                <View style={[styles.uploadIconBox, getClayIconBoxStyle(colors, colors.secondary, 52)]}>
                  <Upload size={26} color={colors.secondary} />
                </View>
                <Text style={[styles.dropzoneTitle, { color: colors.textPrimary }]}>Select Video from Phone</Text>
                <Text style={[styles.dropzoneSubtitle, { color: colors.textMuted }]}>
                  MP4 vertical format (9:16 recommended)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Caption Input */}
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Caption & Hashtags</Text>
          <TextInput
            style={[
              styles.captionInput,
              getClayInsetBoxStyle(colors),
              {
                color: colors.textPrimary,
              },
            ]}
            placeholder="Write your reel caption, keywords and hashtags..."
            placeholderTextColor={colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
          />

          {/* Interval */}
          <View style={[styles.intervalRow, getClayInsetBoxStyle(colors)]}>
            <View style={styles.intervalLeft}>
              <Clock size={17} color={colors.secondary} />
              <Text style={[styles.intervalLabel, { color: colors.textPrimary }]}>Auto-Post Interval</Text>
            </View>
            <View style={[styles.intervalPill, getClayPillStyle(colors, colors.secondary, true)]}>
              <Text style={[styles.intervalValue, { color: "#FFFFFF" }]}>Every {intervalHours} Hours</Text>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[
              styles.addBtn,
              getClayButtonStyle(colors, "primary"),
              !selectedVideoUri && styles.addBtnDisabled,
            ]}
            onPress={handleAddToQueue}
            disabled={!selectedVideoUri || uploading}
            activeOpacity={0.85}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Plus size={19} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Add to Scheduler Queue</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Schedule Queue Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Scheduled Queue ({queue.length})</Text>
        </View>

        {queue.map((item, index) => (
          <View
            key={item.id || index}
            style={[styles.queueItem, getClayCardStyle(colors)]}
          >
            <View style={[styles.queueIconBg, getClayIconBoxStyle(colors, colors.primary, 44)]}>
              <Film size={20} color={colors.primaryLight} />
            </View>
            <View style={styles.queueInfo}>
              <Text style={[styles.queueCaption, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.caption || "Untitled Reel"}
              </Text>
              <Text style={[styles.queueDate, { color: colors.textMuted }]}>
                Position #{item.sequence_index || index + 1} ·{" "}
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusPill, getClayPillStyle(colors, colors.success, false)]}>
              <Text style={[styles.statusText, { color: colors.success }]}>{item.status || "READY"}</Text>
            </View>
          </View>
        ))}

        {queue.length === 0 && (
          <View style={[styles.emptyQueue, getClayCardStyle(colors)]}>
            <View style={[styles.emptyIconBox, getClayIconBoxStyle(colors, colors.primary, 56)]}>
              <Calendar size={28} color={colors.primaryLight} />
            </View>
            <Text style={[styles.emptyQueueTitle, { color: colors.textPrimary }]}>No scheduled reels</Text>
            <Text style={[styles.emptyQueueSubtitle, { color: colors.textSecondary }]}>
              Select a video above to schedule automated publishing.
            </Text>
          </View>
        )}
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
  uploadCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },
  dropzone: {
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyDropzone: {
    alignItems: "center",
  },
  uploadIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  videoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  dropzoneSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: "500",
  },
  selectedVideoInfo: {
    alignItems: "center",
  },
  videoSelectedText: {
    fontSize: 14,
    fontWeight: "800",
  },
  videoUriText: {
    fontSize: 11,
    maxWidth: 220,
    marginTop: 4,
    fontWeight: "500",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  captionInput: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    marginBottom: 14,
    textAlignVertical: "top",
    fontWeight: "500",
  },
  intervalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 18,
  },
  intervalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  intervalLabel: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  intervalPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  intervalValue: {
    fontSize: 11.5,
    fontWeight: "800",
  },
  addBtn: {
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: "700",
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  queueIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  queueInfo: {
    flex: 1,
  },
  queueCaption: {
    fontSize: 13,
    fontWeight: "600",
  },
  queueDate: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "400",
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyQueue: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyQueueTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  emptyQueueSubtitle: {
    fontSize: 12.5,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "400",
  },
})

