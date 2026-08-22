export type TriggerSource = "dm" | "comment" | "story"
export type TriggerType = "keyword" | "postback" | "reply_all"

export interface ProButton {
  id: string
  type: "web_url" | "postback"
  title: string
  url?: string
  payload?: string
}

export interface InstagramMediaItem {
  id: string
  caption?: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp?: string
}

export interface AutomationRule {
  id: string
  user_id: string
  name: string
  trigger_source: TriggerSource
  trigger_type: TriggerType
  trigger_value: string
  is_active: boolean
  created_at: string
  specific_media_id?: string | null
  response_content: {
    message?: string
    text?: string
    buttons?: ProButton[]
    public_reply?: string
  }
}

export interface Conversation {
  id: string
  user_id: string
  recipient_id: string
  recipient_username: string
  last_message_at: string
  last_message?: string
  avatar_url?: string
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_username: string
  content: string
  is_from_instagram: boolean
  created_at: string
}

export interface DashboardStats {
  activeAutomations: number
  totalAutomations: number
  totalConversations: number
  totalMessagesToday: number
  groqAiEnabled: boolean
  aiContext: string
}

export interface ReelScheduleItem {
  id: string
  video_url: string
  thumbnail_url?: string
  caption?: string
  is_active: boolean
  sequence_index: number
  created_at: string
  status?: "PENDING" | "PUBLISHED" | "ERROR"
}

export interface UserSession {
  userId: string
  username: string
  profilePictureUrl?: string
  businessAccountId?: string
}
