import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { apiClient } from "../api/apiClient"
import { Message } from "../types"
import { ArrowLeft, Send, User, Sparkles } from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayCardStyle,
  getClayIconBoxStyle,
  getClayInsetBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

export const ChatThreadScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const { conversationId, recipientId, recipientUsername } = route.params

  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const quickReplies = [
    "Here is the link 🚀",
    "Let me check that for you!",
    "Thanks for reaching out! ✨",
    "Check your DMs! 📩",
  ]

  const loadMessages = async () => {
    try {
      const data = await apiClient.getMessages(conversationId)
      setMessages(data)
    } catch (e) {
      console.error("Error loading chat messages", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text || !user?.userId) return

    setSending(true)
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      const optimisticMsg: Message = {
        id: `temp_${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.userId,
        sender_username: user.username,
        content: text,
        is_from_instagram: false,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, optimisticMsg])
      setInputText("")

      await apiClient.sendMessage(user.userId, recipientId, text)
      loadMessages()
    } catch (e) {
      console.error("Send message error", e)
    } finally {
      setSending(false)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = !item.is_from_instagram || item.sender_id === user?.userId

    return (
      <View style={[styles.msgRow, isMe ? styles.myMsgRow : styles.theirMsgRow]}>
        {!isMe && (
          <View style={[styles.senderAvatar, getClayIconBoxStyle(colors, colors.secondary, 36)]}>
            <Text style={[styles.senderAvatarText, { color: colors.secondary }]}>
              {(recipientUsername || "U")[0].toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.bubbleWrapper}>
          {isMe ? (
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bubble, styles.myBubble]}
            >
              <Text style={styles.myMsgText}>{item.content}</Text>
              <Text style={styles.myMsgTime}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.bubble, styles.theirBubble, getClayCardStyle(colors)]}>
              <Text style={[styles.msgText, { color: colors.textPrimary }]}>{item.content}</Text>
              <Text style={[styles.msgTime, { color: colors.textMuted }]}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top App Bar */}
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
          style={[styles.backBtn, getClayIconBoxStyle(colors, colors.textPrimary, 42)]}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.textPrimary }]}>@{recipientUsername}</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>Instagram DM Active</Text>
          </View>
        </View>
      </View>

      {/* Message List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Quick Replies Chips */}
      <View style={[styles.chipsContainer, { backgroundColor: colors.background }]}>
        {quickReplies.map((chip, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.chip, getClayPillStyle(colors, colors.primary, false)]}
            onPress={() => handleSend(chip)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, { color: colors.textSecondary }]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Input Bar */}
      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            paddingBottom: insets.bottom > 0 ? insets.bottom + 6 : 14,
          },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            getClayInsetBoxStyle(colors),
            {
              color: colors.textPrimary,
            },
          ]}
          placeholder="Type a direct message reply..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            getClayButtonStyle(colors, "primary"),
            !inputText.trim() && styles.sendBtnDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || sending}
          activeOpacity={0.85}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  chatList: {
    padding: 16,
    paddingBottom: 20,
  },
  msgRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    gap: 8,
  },
  myMsgRow: {
    justifyContent: "flex-end",
  },
  theirMsgRow: {
    justifyContent: "flex-start",
  },
  senderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  senderAvatarText: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  bubbleWrapper: {
    maxWidth: "80%",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubble: {
    borderBottomRightRadius: 3,
  },
  theirBubble: {
    borderBottomLeftRadius: 3,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  myMsgText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  msgTime: {
    fontSize: 9.5,
    marginTop: 4,
    alignSelf: "flex-end",
    fontWeight: "400",
  },
  myMsgTime: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 9.5,
    marginTop: 4,
    alignSelf: "flex-end",
    fontWeight: "400",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 90,
    fontSize: 13.5,
    fontWeight: "500",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

