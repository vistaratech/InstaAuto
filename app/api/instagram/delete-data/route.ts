import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import crypto from "crypto"

/**
 * Meta Data Deletion Request Callback
 * 
 * When a user removes your app from Instagram Settings → "Apps and Websites",
 * Meta sends a POST request to this endpoint with a signed_request.
 * 
 * We must:
 * 1. Parse and verify the signed_request
 * 2. Delete the user's data from our database
 * 3. Return a JSON response with a status URL and confirmation code
 * 
 * Meta docs: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */

function parseSignedRequest(signedRequest: string, appSecret: string): any | null {
  try {
    const [encodedSig, payload] = signedRequest.split(".")
    if (!encodedSig || !payload) return null

    // Decode signature
    const sig = Buffer.from(encodedSig.replace(/-/g, "+").replace(/_/g, "/"), "base64")

    // Decode payload
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    )

    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", appSecret)
      .update(payload)
      .digest()

    if (!crypto.timingSafeEqual(sig, expectedSig)) {
      console.error("[DMSpark] ❌ Data deletion: Invalid signature")
      return null
    }

    return data
  } catch (e) {
    console.error("[DMSpark] ❌ Data deletion: Failed to parse signed_request", e)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const appSecret = process.env.INSTAGRAM_APP_SECRET
    if (!appSecret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const body = await request.text()
    const params = new URLSearchParams(body)
    const signedRequest = params.get("signed_request")

    if (!signedRequest) {
      return NextResponse.json({ error: "Missing signed_request" }, { status: 400 })
    }

    const data = parseSignedRequest(signedRequest, appSecret)
    if (!data) {
      return NextResponse.json({ error: "Invalid signed_request" }, { status: 403 })
    }

    const userId = data.user_id?.toString()
    if (!userId) {
      return NextResponse.json({ error: "No user_id in signed_request" }, { status: 400 })
    }

    console.log(`[DMSpark] 🗑️ Data deletion request for user: ${userId}`)

    const supabase = await getSupabaseServerClient()

    // Delete all user data in order (respecting foreign key constraints)
    // 1. Delete messages (via conversations)
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_id", userId)

    if (conversations && Array.isArray(conversations)) {
      for (const conv of conversations) {
        await supabase.from("messages").delete().eq("conversation_id", conv.id)
      }
    }

    // 2. Delete conversations
    await supabase.from("conversations").delete().eq("user_id", userId)

    // 3. Delete automations
    await supabase.from("automations").delete().eq("user_id", userId)

    // 4. Delete ice breakers
    await supabase.from("ice_breakers").delete().eq("user_id", userId)

    // 5. Delete media cache
    await supabase.from("media_cache").delete().eq("user_id", userId)

    // 6. Delete content pool
    await supabase.from("content_pool").delete().eq("user_id", userId)

    // 7. Delete scheduler config
    await supabase.from("scheduler_config").delete().eq("user_id", userId)

    // 8. Delete reels posts
    await supabase.from("reels_posts").delete().eq("user_id", userId)

    // 9. Delete webhook events
    await supabase.from("webhook_events").delete().eq("user_id", userId)

    // 10. Delete user record
    await supabase.from("users").delete().eq("id", userId)

    console.log(`[DMSpark] ✅ All data deleted for user: ${userId}`)

    // Generate confirmation code
    const confirmationCode = crypto.randomUUID()

    // Meta expects this exact response format
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmspark.in"
    return NextResponse.json({
      url: `${baseUrl}/delete-data?confirmation=${confirmationCode}`,
      confirmation_code: confirmationCode,
    })
  } catch (error: any) {
    console.error("[DMSpark] ❌ Data deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
