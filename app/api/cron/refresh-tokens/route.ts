import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

/**
 * Token Refresh Cron Job
 * 
 * Instagram long-lived tokens expire after 60 days.
 * This endpoint refreshes tokens that are expiring within the next 7 days.
 * 
 * Setup: Configure as a Vercel Cron Job to run daily
 * Add to vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/refresh-tokens", "schedule": "0 3 * * *" }]
 * }
 * 
 * Or call manually / via external cron service with the API_SECRET_KEY header.
 * 
 * Instagram token refresh docs:
 * https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login#refresh-tokens
 */

export async function GET(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron sends CRON_SECRET, or use API_SECRET_KEY)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    const apiSecret = process.env.API_SECRET_KEY

    const isVercelCron = cronSecret && authHeader === `Bearer ${cronSecret}`
    const isManualCall = apiSecret && authHeader === `Bearer ${apiSecret}`

    if (!isVercelCron && !isManualCall) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    // Find tokens expiring within the next 7 days
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: expiringUsers } = await supabase
      .from("users")
      .select("id, username, access_token, token_expires_at")
      .lte("token_expires_at", sevenDaysFromNow)

    if (!expiringUsers || expiringUsers.length === 0) {
      console.log("[DMSpark] ✅ No tokens need refreshing")
      return NextResponse.json({ refreshed: 0, message: "No tokens expiring soon" })
    }

    console.log(`[DMSpark] 🔄 Found ${expiringUsers.length} tokens to refresh`)

    let refreshed = 0
    let failed = 0
    const results: any[] = []

    for (const user of expiringUsers) {
      // Skip revoked tokens
      if (!user.access_token || user.access_token === "REVOKED") {
        results.push({ user: user.username, status: "skipped", reason: "token revoked" })
        continue
      }

      try {
        const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(user.access_token)}`

        const res = await fetch(refreshUrl)
        const data = await res.json()

        if (data.access_token) {
          const expiresIn = data.expires_in || 5184000 // 60 days default

          await supabase
            .from("users")
            .update({
              access_token: data.access_token,
              token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)

          refreshed++
          console.log(`[DMSpark] ✅ Token refreshed for @${user.username}`)
          results.push({ user: user.username, status: "refreshed" })
        } else {
          failed++
          console.error(`[DMSpark] ❌ Token refresh failed for @${user.username}:`, data.error || data)
          results.push({ user: user.username, status: "failed", error: data.error?.message || "Unknown error" })
        }
      } catch (err: any) {
        failed++
        console.error(`[DMSpark] ❌ Network error refreshing @${user.username}:`, err.message)
        results.push({ user: user.username, status: "error", error: err.message })
      }
    }

    console.log(`[DMSpark] 🔄 Token refresh complete: ${refreshed} refreshed, ${failed} failed`)

    return NextResponse.json({
      refreshed,
      failed,
      total: expiringUsers.length,
      results,
    })
  } catch (error: any) {
    console.error("[DMSpark] ❌ Token refresh cron error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
