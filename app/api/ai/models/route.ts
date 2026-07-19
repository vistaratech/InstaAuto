import { NextResponse } from "next/server"

// Fetch chat model ids from an OpenAI-compatible /models endpoint.
async function listModels(chatUrl: string | undefined, key: string | undefined, exclude: RegExp) {
  if (!key || !chatUrl) return [] as string[]
  try {
    const modelsUrl = chatUrl.replace(/\/chat\/completions\/?$/, "").replace(/\/$/, "") + "/models"
    const res = await fetch(modelsUrl, { headers: { Authorization: `Bearer ${key}` } })
    if (!res.ok) return []
    const data = await res.json()
    const ids: string[] = (data?.data || []).map((m: any) => m.id)
    return ids.filter((id) => !exclude.test(id)).sort().reverse()
  } catch {
    return []
  }
}

// Lists chat models for BOTH providers so the Settings UI can offer dropdowns for
// the local litellm primary model and the OpenAI backup model.
export async function GET() {
  const [litellm, openai] = await Promise.all([
    // Local litellm: drop non-chat models (image/audio/embed/ocr/tts/whisper).
    listModels(
      process.env.AI_PROXY_URL || "http://localhost:4000/v1/chat/completions",
      process.env.GATEWAY_SECRET,
      /image|audio|embed|ocr|tts|whisper|orpheus|nomic|dall|z-image/i,
    ),
    // OpenAI: keep gpt-/o-series chat models only.
    listModels(
      process.env.AI_BACKUP_URL,
      process.env.AI_BACKUP_KEY,
      /image|audio|realtime|transcribe|tts|embedding|moderation|whisper|dall|search/i,
    ).then((ids) => ids.filter((id) => /^(gpt-|o[0-9]|chatgpt)/i.test(id))),
  ])
  return NextResponse.json({ litellm, openai })
}
