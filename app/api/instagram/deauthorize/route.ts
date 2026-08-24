import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import crypto from "crypto"

/**
 * Meta Deauthorization Callback
 * 
 * When a user removes your app from Instagram Settings → "Apps and Websites",
 * Meta sends a POST request to this endpoint with a signed_request.
 * 
 * This endpoint invalidates the user's tokens and marks them as disconnected.
 * The actual data deletion is handled by the separate /api/instagram/delete-data endpoint.
 * 
 * Meta docs: https://developers.facebook.com/docs/facebook-login/security/#deauthorize-callback
 */

function parseSignedRequest(signedRequest: string, appSecret: string): any | null {
  try {
    const [encodedSig, payload] = signedRequest.split(".")
    if (!encodedSig || !payload) return null

    const sig = Buffer.from(encodedSig.replace(/-/g, "+").replace(/_/g, "/"), "base64")
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    )

    const expectedSig = crypto
      .createHmac("sha256", appSecret)
      .update(payload)
      .digest()

    if (!crypto.timingSafeEqual(sig, expectedSig)) {
      console.error("[DMSpark] ❌ Deauthorize: Invalid signature")
      return null
    }

    return data
  } catch (e) {
    console.error("[DMSpark] ❌ Deauthorize: Failed to parse signed_request", e)
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

    console.log(`[DMSpark] 🔌 Deauthorization request for user: ${userId}`)

    const supabase = await getSupabaseServerClient()

    // Invalidate the user's access token (set to empty/null equivalent)
    // This stops all automations immediately
    const { error } = await supabase
      .from("users")
      .update({
        access_token: "REVOKED",
        token_expires_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("[DMSpark] ❌ Failed to revoke token:", error)
    } else {
      console.log(`[DMSpark] ✅ Token revoked for user: ${userId}`)
    }

    // Log the deauthorization event
    await supabase.from("webhook_events").insert({
      event_type: "deauthorize",
      user_id: userId,
      data: { deauthorized_at: new Date().toISOString(), source: "meta_callback" },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[DMSpark] ❌ Deauthorization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
