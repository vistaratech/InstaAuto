import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import crypto from "crypto"

const WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || "your_verify_token"

type LlmProvider = { url: string; key: string; model: string; label: string; kind: "openai" | "litellm"; reasoningEffort?: string }

// Provider chain for AI replies. Primary = local litellm (gemma4:e4b). Optional
// backup = any OpenAI-compatible endpoint (e.g. Groq / OpenAI) via AI_BACKUP_* env.
function llmProviders(primaryModelOverride?: string, backupModelOverride?: string): LlmProvider[] {
  const list: LlmProvider[] = []
  const primaryKey = process.env.GATEWAY_SECRET
  if (primaryKey) {
    list.push({
      url: process.env.AI_PROXY_URL || "https://triderai.vercel.app/api/chat",
      key: primaryKey,
      model: (primaryModelOverride && primaryModelOverride.trim()) || process.env.AI_MODEL || "gemma4",
      label: "primary",
      kind: "litellm",
    })
  }
  // Backup model is configurable per-account in Settings (backupModelOverride);
  // falls back to the AI_BACKUP_MODEL env default. URL + key stay server-side.
  const backupModel = (backupModelOverride && backupModelOverride.trim()) || process.env.AI_BACKUP_MODEL
  if (process.env.AI_BACKUP_URL && process.env.AI_BACKUP_KEY && backupModel) {
    const backupUrl = process.env.AI_BACKUP_URL
    list.push({
      url: backupUrl,
      key: process.env.AI_BACKUP_KEY,
      model: backupModel,
      label: "backup",
      kind: backupUrl.includes("openai.com") ? "openai" : "litellm",
      reasoningEffort: process.env.AI_BACKUP_REASONING_EFFORT || "medium",
    })
  }
  return list
}

// Call the provider chain with a per-provider timeout (so a slow/cold local model
// can't hang forever). Returns the reply text, or "" if every provider fails/times
// out — the caller then sends a canned fallback so the user is never left silent.
async function callLLM(messages: any[], opts?: { maxTokens?: number; primaryModel?: string; backupModel?: string }): Promise<string> {
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 18000
  for (const p of llmProviders(opts?.primaryModel, opts?.backupModel)) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      // Shape the body per provider: OpenAI reasoning models reject temperature/think
      // and use max_completion_tokens + reasoning_effort; litellm/ollama use the old shape.
      const body: any = { model: p.model, messages }
      if (p.kind === "openai") {
        body.max_completion_tokens = 800 // room for reasoning tokens + a short reply
        if (p.reasoningEffort) body.reasoning_effort = p.reasoningEffort
      } else {
        body.max_tokens = opts?.maxTokens ?? 150
        body.temperature = 0.8
        body.think = false
      }
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer))
      if (!res.ok) { console.log(`[v0] ⚠️ LLM ${p.label}(${p.model}) http ${res.status}`); continue }
      const data = await res.json()
      const content = (data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.content || "")
        .toString().trim().replace(/^["']|["']$/g, "")
      if (content) { console.log(`[v0] 🤖 LLM reply via ${p.label}(${p.model})`); return content }
      console.log(`[v0] ⚠️ LLM ${p.label}(${p.model}) returned empty`)
    } catch (e: any) {
      console.log(`[v0] ⚠️ LLM ${p.label} failed: ${e?.name === "AbortError" ? "timeout" : (e?.message || e)}`)
    }
  }
  return ""
}

// Generate a short reply via the provider chain. Returns "" on total failure so
// callers can fall back to a canned message.
async function aiGenerate(params: {
  userText: string
  goal: string
  username: string
  aiContext?: string | null
  maxTokens?: number
  primaryModel?: string
  backupModel?: string
}): Promise<string> {
  const accountContext = params.aiContext
    ? `\n\nAbout FECO (@${params.username}): ${params.aiContext}`
    : `\n\nYou represent FECO (@${params.username}).`
  const system = `You are FECO's assistant on Instagram.${accountContext}

${params.goal}

RULES:
- You are FECO's assistant. Do NOT claim to be a human or a specific person.
- NEVER give prices, quotes or cost estimates — say the team will put together a quote.
- Keep it SHORT. Warm, casual, professional. Reply in English.
- No hashtags, no bullet points, no formal formatting. No quotation marks around your reply.`
  return callLLM(
    [
      { role: "system", content: system },
      { role: "user", content: params.userText },
    ],
    { maxTokens: params.maxTokens ?? 100, primaryModel: params.primaryModel, backupModel: params.backupModel },
  )
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: "Invalid token" }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    // Verify Meta webhook signature
    const signature = request.headers.get("x-hub-signature-256")
    const appSecret = process.env.INSTAGRAM_APP_SECRET
    const rawBody = await request.text()
    if (appSecret && signature) {
      const expectedSig = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")
      if (signature !== expectedSig) {
        console.error("[v0] ❌ Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
      }
    }

    const body = JSON.parse(rawBody)
    if (!body.entry) return NextResponse.json({ ok: true })
    const supabase = await getSupabaseServerClient()

    for (const entry of body.entry) {
      // ============================================================
      // 🔇 ECHO SILENCER (The Fix for "ID Not Found" logs)
      // ============================================================
      // If the incoming event is just a "Read Receipt", "Delivery Status",
      // or "Echo" (the bot's own reply), we skip it immediately.
      // This prevents the code from trying to find a User ID for a system event.
      if (entry.messaging) {
        const isSystemEvent = entry.messaging.every(
          (event: any) => event.read || event.delivery || (event.message && event.message.is_echo),
        )
        if (isSystemEvent) {
          // console.log("[v0] 🔇 Skipped System Event (Echo/Read/Delivery)")
          continue
        }
      }
      // ============================================================

      const webhookId = entry.id

      // 1. DUAL ID LOOKUP
      let { data: user } = await supabase
        .from("users")
        .select("*")
        .or(`business_account_id.eq.${webhookId},page_id.eq.${webhookId}`)
        .single()

      // ============================================================
      // 🔍 FALLBACK 1: Extract actual IG ID from payload
      // ============================================================
      if (!user) {
        console.log(`[v0] ⚠️ ID ${webhookId} not found in DB. Trying payload fallback...`)

        const candidateIds = new Set<string>()

        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.value?.media?.owner?.id) candidateIds.add(String(change.value.media.owner.id))
          }
        }
        if (entry.messaging) {
          for (const event of entry.messaging) {
            if (event.recipient?.id) candidateIds.add(String(event.recipient.id))
          }
        }

        for (const candidateId of candidateIds) {
          if (candidateId === webhookId) continue
          const { data: fallbackUser } = await supabase
            .from("users")
            .select("*")
            .or(`business_account_id.eq.${candidateId},page_id.eq.${candidateId}`)
            .single()

          if (fallbackUser) {
            console.log(`[v0] ✅ Payload fallback matched! ${candidateId} → ${fallbackUser.username}`)
            await supabase.from("users").update({ page_id: webhookId }).eq("id", fallbackUser.id)
            user = fallbackUser
            break
          }
        }
      }

      // ============================================================
      // 🔍 FALLBACK 2: Token verification (tests ALL users)
      // Only runs once per unknown ID, then saves the mapping forever
      // ============================================================
      if (!user) {
        console.log(`[v0] 🔎 Trying token verification for ${webhookId}...`)
        const { data: allUsers } = await supabase.from("users").select("*")

        if (allUsers) {
          for (const candidate of allUsers) {
            if (!candidate.access_token) continue
            try {
              const testRes = await fetch(
                `https://graph.instagram.com/v24.0/${webhookId}?fields=id&access_token=${candidate.access_token}`
              )
              if (testRes.ok) {
                console.log(`[v0] ✅ Token verified! ${webhookId} belongs to ${candidate.username}. Saving permanently.`)
                await supabase
                  .from("users")
                  .update({ page_id: webhookId })
                  .eq("id", candidate.id)
                user = candidate
                break
              }
            } catch (e) {
              // Network error, skip this user
            }
          }
        }
      }
      // ============================================================

      if (!user) {
        console.log(`[v0] ❌ Could not resolve User for ID ${webhookId}`)
        continue
      }

      const { data: automations } = await supabase
        .from("automations")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)

      if (!automations?.length) continue

      // ============================================================
      //  PART A: COMMENTS
      // ============================================================
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === "comments" && change.value?.text) {
            const commentId = change.value.id
            const commentText = change.value.text.toLowerCase().trim()
            const senderId = change.value.from.id

            const mediaId = change.value.media.id

            // Safety check for self-reply
            if (senderId === webhookId || senderId === user.business_account_id || senderId === user.page_id) continue

            // ============================================================
            // 🧠 SMART MATCHING LOGIC
            // ============================================================
            // Filter to comment-only automations first
            const commentAutomations = automations.filter((a: any) => a.trigger_source === 'comment')

            // Priority 1: Reply-All (Specific post, ALL comments).
            // Accept trigger_type "reply_all" OR the all_comments sentinel value —
            // the create flow has stored this both ways.
            let match = commentAutomations.find(
              (a: any) =>
                a.specific_media_id === mediaId &&
                (a.trigger_type === "reply_all" || String(a.trigger_value).toLowerCase() === "all_comments"),
            )

            // Priority 2: Specific Post + Keyword Match
            if (!match) {
              match = commentAutomations.find(
                (a: any) =>
                  a.specific_media_id === mediaId &&
                  a.trigger_type === "keyword" &&
                  a.trigger_value
                    .split(",")
                    .some((k: string) => new RegExp(`\\b${k.trim()}\\b`, "i").test(commentText)),
              )
            }

            // Priority 3: Global Keyword Match (Only if no specific match found).
            // MUST stay within comment automations — otherwise DM keyword rules
            // (e.g. "hi") leak in and fire on comments.
            if (!match) {
              match = commentAutomations.find(
                (a: any) =>
                  !a.specific_media_id && // Must be global
                  a.trigger_type === "keyword" &&
                  a.trigger_value
                    .split(",")
                    .some((k: string) => new RegExp(`\\b${k.trim()}\\b`, "i").test(commentText)),
              )
            }

            if (match) {
              console.log(`[v0] ✅ Comment Match: "${match.name}" (ID: ${match.id})`)
              const content = match.response_content
              const replies = ["Check your DMs! 📥", "Sent! 🔥", "Check inbox! ✨"]
              let publicReply = replies[Math.floor(Math.random() * replies.length)]

              // AI-personalised public reply (reacts to their actual comment). Falls back to a canned line.
              if (user.groq_auto_reply_enabled) {
                const aiPub = await aiGenerate({
                  userText: `Someone left this public comment on our Instagram post: "${change.value.text}". Reply publicly in one very short friendly line (max ~8 words) that reacts to their comment and tells them to check their DMs.`,
                  goal: "Write ONE very short PUBLIC comment reply that reacts to them and nudges them to check their DMs.",
                  username: user.username,
                  aiContext: (user as any).ai_context,
                  maxTokens: 40,
                  primaryModel: (user as any).primary_model,
                  backupModel: (user as any).backup_model,
                })
                if (aiPub) publicReply = aiPub
                console.log(`[v0] 💬 Public comment reply: "${publicReply}"`)
              }

              // Public Reply
              try {
                const pubRes = await fetch(
                  `https://graph.instagram.com/v24.0/${commentId}/replies?access_token=${encodeURIComponent(user.access_token)}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: publicReply }),
                  },
                )
                const pubJson = await pubRes.json()
                if (pubJson.error) console.error("[v0] 🔴 Public Reply Failed:", JSON.stringify(pubJson.error))
                else console.log("[v0] 🟢 Public Reply Sent!", pubJson)
              } catch (e) {
                console.error("[v0] 🔴 Public Reply Network Error:", e)
              }

              // Private Reply (DM)
              const apiBody: any = { recipient: { comment_id: commentId } }

              // AI-personalised opening DM: reacts to their actual comment and asks for contact. Falls back to the canned message.
              let dmText = content.message
              if (user.groq_auto_reply_enabled && content.message) {
                const aiDm = await aiGenerate({
                  userText: `Someone commented "${change.value.text}" on our Instagram post, so we're opening a DM with them. Write a short friendly opening DM that reacts to their comment and asks for the best email or phone number so the FECO team can follow up.`,
                  goal: "Write ONE short opening DM to a commenter. TOP PRIORITY: naturally ask for their email or phone number so the team can follow up.",
                  username: user.username,
                  aiContext: (user as any).ai_context,
                  maxTokens: 90,
                  primaryModel: (user as any).primary_model,
                  backupModel: (user as any).backup_model,
                })
                if (aiDm) dmText = aiDm
                console.log(`[v0] 💬 Comment→DM opener: "${dmText}"`)
              }

              if (content.message) {
                // Plain Text
                apiBody.message = { text: dmText }
              } else if (content.card) {
                // Rich Card / Generic Template
                const card = content.card
                const apiButtons = card.buttons.map((b: any) => ({
                  type: b.type,
                  title: b.title,
                  url: b.url || undefined,
                  payload: b.payload || undefined,
                }))
                const element: any = { title: card.title, buttons: apiButtons }
                if (card.subtitle) element.subtitle = card.subtitle
                if (card.image_url && card.image_url.startsWith("http")) element.image_url = card.image_url

                apiBody.message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "generic",
                      elements: [element],
                    },
                  },
                }
              }
              // Handle delay_seconds if present
              if (content.delay_seconds && content.delay_seconds > 0) {
                console.log(`[v0] ⏳ Delaying comment DM by ${content.delay_seconds} seconds...`)
                await new Promise((resolve) => setTimeout(resolve, content.delay_seconds * 1000))
              }

              try {
                const dmRes = await fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(apiBody) },
                )
                const dmJson = await dmRes.json()
                if (dmJson.error) {
                  console.error("[v0] 🔴 Private DM Failed:", JSON.stringify(dmJson.error))
                } else {
                  console.log("[v0] 🟢 Private DM Sent!", dmJson)

                  // Save comment trigger and DM reply to DB
                  try {
                    let { data: conv } = await supabase
                      .from("conversations")
                      .select("id")
                      .eq("user_id", user.id)
                      .eq("recipient_id", senderId)
                      .single()

                    if (!conv) {
                      let realUsername = `cnt_${senderId.slice(0, 5)}...`
                      try {
                        const profileUrl = `https://graph.instagram.com/v24.0/${senderId}?fields=username&access_token=${user.access_token}`
                        const profileRes = await fetch(profileUrl)
                        const profileData = await profileRes.json()
                        if (profileData.username) {
                          realUsername = profileData.username
                        }
                      } catch (e) {
                        console.error("[v0] Failed to fetch username in comment DM log", e)
                      }

                      const { data: newConv } = await supabase
                        .from("conversations")
                        .insert({
                          user_id: user.id,
                          recipient_id: senderId,
                          recipient_username: realUsername,
                          last_message_at: new Date().toISOString(),
                        })
                        .select("id")
                        .single()
                      conv = newConv
                    } else {
                      await supabase
                        .from("conversations")
                        .update({ last_message_at: new Date().toISOString() })
                        .eq("id", conv.id)
                    }

                    if (conv) {
                      // Save comment trigger as incoming message
                      await supabase.from("messages").insert({
                        id: `mid_cmt_trig_${Date.now()}_${Math.random()}`,
                        conversation_id: conv.id,
                        user_id: user.id,
                        sender_id: senderId,
                        sender_username: "User",
                        content: `💬 Commented: "${change.value.text}"`,
                        is_from_instagram: true,
                      })

                      // Save outgoing DM reply
                      await supabase.from("messages").insert({
                        id: dmJson.message_id || `mid_cmt_reply_${Date.now()}_${Math.random()}`,
                        conversation_id: conv.id,
                        user_id: user.id,
                        sender_id: user.business_account_id,
                        sender_username: user.username,
                        content: dmText || content.message || `[Sent rich card: "${content.card?.title || 'Card'}"]`,
                        is_from_instagram: false,
                      })
                    }
                  } catch (dbErr) {
                    console.error("[v0] Failed to log comment automation to DB:", dbErr)
                  }
                }
              } catch (e) {
                console.error("[v0] 🔴 Private DM Network Error:", e)
              }
            }
          }
        }
      }

      // ============================================================
      //  PART A.5: STORY AUTOMATION HANDLING
      // ============================================================
      if (entry.messaging) {
        for (const event of entry.messaging) {
          const senderId = event.sender.id
          const recipientId = event.recipient.id

          // Skip system events
          if (event.read || event.delivery || event.message?.is_echo || senderId === recipientId) continue

          // Filter story automations only
          const storyAutomations = automations.filter((a: any) => a.trigger_source === 'story')
          if (storyAutomations.length === 0) continue

          let match = null
          let storyMediaId: string | null = null

          // 1️⃣ Story Mention Handler
          if (event.message?.attachments?.[0]?.type === 'story_mention') {
            const attachment = event.message.attachments[0]
            storyMediaId = attachment.payload?.url || null

            match = storyAutomations.find((a: any) =>
              a.trigger_type === 'mention' &&
              (!a.specific_media_id || a.specific_media_id === storyMediaId)
            )
          }

          // 2️⃣ Story Reaction Handler  
          else if (event.reaction) {
            const reactionEmoji = event.reaction.emoji
            storyMediaId = event.reaction.mid || null

            match = storyAutomations.find((a: any) => {
              if (a.trigger_type !== 'reaction') return false
              if (a.specific_media_id && a.specific_media_id !== storyMediaId) return false

              const triggers = a.trigger_value?.split(',').map((t: string) => t.trim()) || []
              if (triggers.length > 0 && triggers[0] !== 'ALL' && triggers[0] !== '') {
                return triggers.includes(reactionEmoji)
              }
              return true
            })
          }

          // 3️⃣ Story Reply Handler
          else if (event.message?.reply_to?.story) {
            const messageText = event.message.text || ''
            storyMediaId = event.message.reply_to.story.id || null

            match = storyAutomations.find((a: any) => {
              if (a.trigger_type !== 'reply') return false
              if (a.specific_media_id && a.specific_media_id !== storyMediaId) return false

              const triggers = a.trigger_value?.split(',').map((t: string) => t.trim()) || []
              if (triggers.length > 0 && triggers[0] !== 'ALL' && triggers[0] !== 'ALL_MENTIONS' && triggers[0] !== '') {
                return triggers.some((keyword: string) =>
                  new RegExp(`\\b${keyword}\\b`, 'i').test(messageText)
                )
              }
              return true
            })
          }

          // Send response if match found
          if (match) {
            console.log(`✨ Story automation matched: ${match.name}`)

            try {
              const content = match.response_content
              const apiBody: any = { recipient: { id: senderId } }

              if (content.message) {
                apiBody.message = { text: content.message }
              } else if (content.card) {
                const card = content.card
                const apiButtons = card.buttons.map((b: any) => ({
                  type: b.type,
                  title: b.title,
                  url: b.url || undefined,
                  payload: b.payload || undefined,
                }))
                const element: any = { title: card.title, buttons: apiButtons }
                if (card.subtitle) element.subtitle = card.subtitle
                if (card.image_url && card.image_url.startsWith("http")) element.image_url = card.image_url

                apiBody.message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "generic",
                      elements: [element],
                    },
                  },
                }
              }

              // Handle delay_seconds if present
              if (content.delay_seconds && content.delay_seconds > 0) {
                console.log(`[v0] ⏳ Delaying story DM by ${content.delay_seconds} seconds...`)
                await new Promise((resolve) => setTimeout(resolve, content.delay_seconds * 1000))
              }

              await fetch(
                `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(apiBody) },
              )

              console.log(`✅ Story automation sent: ${match.name}`)
            } catch (err) {
              console.error('❌ Story automation error:', err)
            }
          }
        }
      }

      // ============================================================
      //  PART B: MESSAGES (DMs)
      // ============================================================
      if (entry.messaging) {
        for (const event of entry.messaging) {
          if (event.read || event.delivery || event.reaction || event.message?.is_echo) continue

          const senderId = event.sender.id
          if (senderId === webhookId || senderId === user.business_account_id || senderId === user.page_id) continue

          let triggerType = "",
            triggerValue = ""

          if (event.message?.text) {
            triggerType = "keyword"
            triggerValue = event.message.text.toLowerCase().trim()
          } else if (event.postback?.payload) {
            triggerType = "postback"
            triggerValue = event.postback.payload
          } else {
            continue
          }

          console.log(`[v0] 📩 DM from ${senderId}: "${triggerValue}"`)

          // ============================================================
          // 💾 1. SAVE INCOMING MESSAGE (Live Inbox Logic)
          // ============================================================
          try {
            // A. Upsert Conversation
            // We try to find an existing conv first to get the ID
            let { data: conv } = await supabase
              .from("conversations")
              .select("id")
              .eq("user_id", user.id)
              .eq("recipient_id", senderId)
              .single()

            if (!conv) {
              // Create new conversation

              // 1. Try to fetch real username first
              let realUsername = `cnt_${senderId.slice(0, 5)}...`
              try {
                const profileUrl = `https://graph.instagram.com/v24.0/${senderId}?fields=username&access_token=${user.access_token}`
                const profileRes = await fetch(profileUrl)
                const profileData = await profileRes.json()
                if (profileData.username) {
                  realUsername = profileData.username
                }
              } catch (e) {
                console.error("[v0] Failed to fetch username", e)
              }

              const { data: newConv } = await supabase
                .from("conversations")
                .insert({
                  user_id: user.id,
                  recipient_id: senderId,
                  recipient_username: realUsername,
                  last_message_at: new Date().toISOString(),
                })
                .select("id")
                .single()
              conv = newConv
            } else {
              // Update timestamp
              await supabase
                .from("conversations")
                .update({ last_message_at: new Date().toISOString() })
                .eq("id", conv.id)
            }

            if (conv) {
              // B. Save User Message
              await supabase.from("messages").insert({
                id: event.message?.mid || `mid_${Date.now()}_${Math.random()}`,
                conversation_id: conv.id,
                user_id: user.id,
                sender_id: senderId,
                sender_username: "User", // We don't have their username easily here
                content: triggerValue,
                is_from_instagram: true, // True = FROM the user TO us
              })
            }
          } catch (err) {
            console.error("[v0] Failed to save incoming message DB", err)
          }
          // ============================================================

          let match = null
          if (triggerType === "postback") {
            if (triggerValue.startsWith("UNLOCK_CONTENT_")) {
              const ruleId = triggerValue.replace("UNLOCK_CONTENT_", "")
              match = automations.find((a) => a.id === ruleId)
            } else if (triggerValue.startsWith("ICE_BREAKER_")) {
              // Handle Ice Breaker
              const iceBreakerId = triggerValue.replace("ICE_BREAKER_", "")
              const { data: ibMatches } = await supabase
                .from("ice_breakers")
                .select("*")
                .eq("id", iceBreakerId)
                .eq("user_id", user.id)
                .single()

              if (ibMatches) {
                // Construct a temporary match object to reuse the sending logic
                match = {
                  name: "Ice Breaker: " + ibMatches.question,
                  response_content: { message: ibMatches.response },
                }
              }
            } else {
              match = automations.find((a) => a.trigger_type === "postback" && a.trigger_value === triggerValue)
            }
          } else {
            // Filter to DM-only automations (exclude comment/story triggers)
            const dmAutomations = automations.filter(
              (a: any) => a.trigger_source === 'dm' || !a.trigger_source
            )
            match = dmAutomations.find(
              (a: any) =>
                a.trigger_type === "keyword" &&
                a.trigger_value.split(",").some((k: string) => new RegExp(`\\b${k.trim()}\\b`, "i").test(triggerValue)),
            )
          }

          if (!match) {
            // ============================================================
            // 🤖 GROQ AI AUTO-REPLY FALLBACK
            // ============================================================
            if (user.groq_auto_reply_enabled && triggerType === "keyword") {
              console.log(`[v0] 🤖 No keyword match — trying AI for ${senderId}`)
              try {
                const gatewaySecret = process.env.GATEWAY_SECRET
                if (!gatewaySecret) {
                  console.log("[v0] ❌ GATEWAY_SECRET not set")
                  continue
                }

                // Fetch recent conversation history to match tone
                let chatHistory: { role: string; content: string }[] = []
                const { data: convData } = await supabase
                  .from("conversations")
                  .select("id")
                  .eq("user_id", user.id)
                  .eq("recipient_id", senderId)
                  .single()

                if (convData?.id) {
                  const { data: recentMsgs } = await supabase
                    .from("messages")
                    .select("content, sender_id, is_from_instagram")
                    .eq("conversation_id", convData.id)
                    .order("created_at", { ascending: false })
                    .limit(10)

                  if (recentMsgs && recentMsgs.length > 0) {
                    chatHistory = recentMsgs
                      .reverse()
                      .map((m: any) => ({
                        role: m.is_from_instagram ? "user" : "assistant",
                        content: m.content,
                      }))
                  }
                }

                // Cap how many times the bot messages so it doesn't nag the lead.
                // Counts ALL prior bot replies (keyword welcome + AI) across the WHOLE
                // conversation — NOT just the recent 10-message window — then sends ONE
                // handoff and stays silent. Using the windowed chatHistory here was a bug:
                // the count kept sliding back onto MAX as new DMs pushed old bot messages
                // out of the window, re-firing the handoff on every message. The handoff
                // is also de-duped by its text so it can never be sent twice.
                const MAX_BOT_MESSAGES = 4 // tune this: ~3 exchanges then handoff
                const HANDOFF_TEXT = "Perfect — that's everything I need for now! 🙌 I've passed your details to the FECO team and a real person will follow up with you right here soon. I'll step back so you're chatting with the team from here. 💬"

                let totalBotMsgs = chatHistory.filter(m => m.role === "assistant").length
                let handoffAlreadySent = false
                if (convData?.id) {
                  const { count } = await supabase
                    .from("messages")
                    .select("id", { count: "exact", head: true })
                    .eq("conversation_id", convData.id)
                    .eq("is_from_instagram", false)
                  totalBotMsgs = count ?? totalBotMsgs
                  const { data: priorHandoff } = await supabase
                    .from("messages")
                    .select("id")
                    .eq("conversation_id", convData.id)
                    .eq("is_from_instagram", false)
                    .eq("content", HANDOFF_TEXT)
                    .limit(1)
                  handoffAlreadySent = !!priorHandoff?.length
                }

                if (totalBotMsgs >= MAX_BOT_MESSAGES) {
                  if (!handoffAlreadySent && convData?.id) {
                    await fetch(
                      `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: senderId }, message: { text: HANDOFF_TEXT } }) },
                    ).catch(() => {})
                    await supabase.from("messages").insert({
                      id: `mid_ai_${Date.now()}_${Math.random()}`,
                      conversation_id: convData.id,
                      user_id: user.id,
                      sender_id: user.business_account_id,
                      sender_username: user.username,
                      content: HANDOFF_TEXT,
                      is_from_instagram: false,
                    })
                    console.log(`[v0] 🛑 Q-limit (${totalBotMsgs}) reached — sent handoff, going silent`)
                  } else {
                    console.log(`[v0] 🤫 Past Q-limit (${totalBotMsgs}) — staying silent`)
                  }
                  continue
                }

                // Build dynamic system prompt based on history
                const hasHistory = chatHistory.length > 0
                const userMsgs = chatHistory.filter(m => m.role === "user").map(m => m.content).join(" ")

                const accountContext = (user as any).ai_context
                  ? `\n\nAbout this account (@${user.username}): ${(user as any).ai_context}`
                  : `\n\nYou manage the Instagram account @${user.username}.`

                const systemPrompt = `You are the assistant for FECO's Instagram DMs (@${user.username}).${accountContext}

YOUR GOAL — this is the ONLY thing that matters:
- TOP PRIORITY: get their EMAIL or PHONE NUMBER as early as possible — ideally in your very first or second reply. Ask for it naturally, e.g. "What's the best email or number for the team to reach you on?". Once you have their contact, you've done the most important part.
- Then learn a bit about what they need: their name, their business, and what they're looking to build. You are qualifying a lead, NOT helping them.
- Ask ONE short question at a time. Do NOT interrogate — you only have a few messages, so keep it light and don't drag it out.
- Do NOT try to solve their problem, give advice, or explain things in depth. Gently steer back to getting their contact + what they need.

RULES:
- You are FECO's assistant. You may say you're the assistant for FECO. Do NOT pretend to be a specific person and do NOT claim to be human.
- NEVER give prices, quotes, or cost estimates. If they ask about pricing/cost/quotes, tell them the team will put together a quote and that you just need a few details so someone can follow up — then get their contact.
- Keep replies SHORT — 1-2 warm, casual-but-professional sentences. Reply in English.
- No hashtags, no bullet points, no formal formatting. Never make promises or commitments on FECO's behalf.
${hasHistory ? `- Continue naturally and don't repeat questions already asked. Recent messages from them: ${userMsgs.slice(0, 120)}` : `- This is the start of the conversation — open warmly and start learning who they are and what they need.`}`

                const aiMessages = [
                  { role: "system", content: systemPrompt },
                  ...chatHistory.slice(-6),
                  { role: "user", content: triggerValue },
                ]

                // Mark message as seen (read receipt)
                fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: senderId }, sender_action: "mark_seen" }) },
                ).catch(() => {})

                // Random human-like delay before typing (1.5s - 5s)
                const preDelay = Math.floor(Math.random() * 3500) + 1500
                await new Promise(r => setTimeout(r, preDelay))

                // Send typing indicator before AI generates reply
                const typingBody = {
                  recipient: { id: senderId },
                  sender_action: "typing_on",
                }
                fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(typingBody) },
                ).catch(() => {})

                // Timeout-guarded call across the provider chain (local gemma4 → optional backup).
                const aiReply0 = await callLLM(aiMessages, { maxTokens: 150, primaryModel: (user as any).primary_model, backupModel: (user as any).backup_model })

                // Turn off typing indicator after AI responds
                fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: senderId }, sender_action: "typing_off" }) },
                ).catch(() => {})

                const aiData: any = null
                let aiReply = (aiReply0 || "").trim()

                if (!aiReply) {
                  console.log(`[v0] ❌ AI returned empty reply. finish_reason: ${aiData?.choices?.[0]?.finish_reason}`)
                  // Fallback: send a generic reply instead of nothing
                  const fallbackReplies = [
                    "Hey! Thanks for the message — mind telling me a bit about what you're after?",
                    "Hi! Who am I chatting with, and what are you looking to build?",
                    "Thanks for reaching out! What's your name, and what kind of project do you have in mind?",
                    "Hey there! Tell me a little about what you need and I'll get the right person onto it.",
                  ]
                  aiReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)]
                  console.log(`[v0] 🔄 Using fallback reply: "${aiReply}"`)
                }

                console.log(`[v0] 🤖 AI Reply: "${aiReply}"`)

                // Send AI reply via Instagram
                const aiApiBody = {
                  recipient: { id: senderId },
                  message: { text: aiReply },
                }

                const sendRes = await fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aiApiBody) },
                )
                const sendJson = await sendRes.json()
                if (sendJson.error) {
                  console.error("[v0] 🔴 AI Reply Send Failed:", sendJson.error)
                } else {
                  console.log("[v0] 🟢 AI Reply Sent!")

                  // Save AI reply to DB
                  const { data: aiConv } = await supabase
                    .from("conversations")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("recipient_id", senderId)
                    .single()

                  if (aiConv) {
                    await supabase.from("messages").insert({
                      id: `mid_ai_${Date.now()}_${Math.random()}`,
                      conversation_id: aiConv.id,
                      user_id: user.id,
                      sender_id: user.business_account_id,
                      sender_username: user.username,
                      content: aiReply,
                      is_from_instagram: false,
                    })
                  }
                }
              } catch (groqErr) {
                console.error("[v0] 🔴 Groq AI Error:", groqErr)
                // Never leave the user hanging on an unexpected error
                await fetch(
                  `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
                  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: senderId }, message: { text: "Thanks for your message! 🙌 One of the FECO team will get back to you shortly." } }) },
                ).catch(() => {})
              }
              continue
            }

            console.log(`[v0] ❌ No match.`)
            continue
          }

          console.log(`[v0] ✅ Match: "${match.name}"`)
          const content = match.response_content
          const apiBody: any = { recipient: { id: senderId } }

          let replyTextLog = ""

          if (content.message) {
            apiBody.message = { text: content.message }
            replyTextLog = content.message
          } else if (content.card) {
            const card = content.card
            replyTextLog = `[Card] ${card.title}`
            const apiButtons = card.buttons.map((b: any) => ({
              type: b.type,
              title: b.title,
              url: b.url || undefined,
              payload: b.payload || undefined,
            }))
            const element: any = { title: card.title, buttons: apiButtons }
            if (card.subtitle) element.subtitle = card.subtitle
            if (card.image_url && card.image_url.startsWith("http")) element.image_url = card.image_url
            apiBody.message = {
              attachment: { type: "template", payload: { template_type: "generic", elements: [element] } },
            }
          }

          // Follow Gate Logic
          const isUnlockEvent = triggerType === "postback" && triggerValue.startsWith("UNLOCK_CONTENT_")
          if (content.check_follow === true && !isUnlockEvent) {
            replyTextLog = "[Locked Content Gate]"
            apiBody.message = {
              attachment: {
                type: "template",
                payload: {
                  template_type: "generic",
                  elements: [
                    {
                      title: "🔒 Content Locked",
                      subtitle: `Please follow @${user.username} to see this!`,
                      buttons: [
                        { type: "web_url", url: `https://instagram.com/${user.username}`, title: "Follow Us" },
                        { type: "postback", title: "I Followed! ✅", payload: `UNLOCK_CONTENT_${match.id}` },
                      ],
                    },
                  ],
                },
              },
            }
          }

          // Handle delay_seconds if present
          if (content.delay_seconds && content.delay_seconds > 0) {
            console.log(`[v0] ⏳ Delaying reply DM by ${content.delay_seconds} seconds...`)
            await new Promise((resolve) => setTimeout(resolve, content.delay_seconds * 1000))
          }

          // SEND REPLY
          try {
            const res = await fetch(
              `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`,
              { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(apiBody) },
            )
            const json = await res.json()
            if (json.error) console.error("[v0] 🔴 Reply Failed:", json.error)
            else {
              console.log("[v0] 🟢 Reply Sent!")

              // ============================================================
              // 💾 2. SAVE OUTGOING REPLY (Live Inbox Logic)
              // ============================================================
              // We need to find the conversation ID again (or pass it down)
              // For safety, we just re-query or use the one if we scoped it.
              // Doing a quick localized lookup for robustness:
              const { data: conv } = await supabase
                .from("conversations")
                .select("id")
                .eq("user_id", user.id)
                .eq("recipient_id", senderId)
                .single()

              if (conv) {
                await supabase.from("messages").insert({
                  id: `mid_reply_${Date.now()}_${Math.random()}`,
                  conversation_id: conv.id,
                  user_id: user.id,
                  sender_id: user.business_account_id, // It's us
                  sender_username: user.username,
                  content: replyTextLog,
                  is_from_instagram: false, // False = FROM US
                })
              }
              // ============================================================
            }
          } catch (e) {
            console.error("[v0] Network Error:", e)
          }
        }
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Webhook Error", error)
    return NextResponse.json({ ok: true })
  }
}
