/**
 * Instagram API Helper with Rate Limit Handling
 * 
 * Wraps fetch calls to Instagram Graph API with:
 * - Automatic retry on 429 (Too Many Requests)
 * - Exponential backoff
 * - X-Business-Use-Case-Usage header monitoring
 * - Logging for debugging
 */

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

interface InstagramApiResponse {
  data: any
  ok: boolean
  rateLimitInfo?: {
    callCount: number
    totalCpuTime: number
    totalTime: number
  }
}

/**
 * Makes a rate-limit-aware request to Instagram Graph API.
 * Automatically retries on 429 with exponential backoff.
 */
export async function instagramApiFetch(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<InstagramApiResponse> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options)

      // Parse rate limit headers
      let rateLimitInfo: any = undefined
      const usageHeader = res.headers.get("x-business-use-case-usage")
      if (usageHeader) {
        try {
          const usage = JSON.parse(usageHeader)
          const firstKey = Object.keys(usage)[0]
          if (firstKey && usage[firstKey]?.[0]) {
            rateLimitInfo = {
              callCount: usage[firstKey][0].call_count || 0,
              totalCpuTime: usage[firstKey][0].total_cputime || 0,
              totalTime: usage[firstKey][0].total_time || 0,
            }

            // Warn if approaching limits (>80%)
            if (rateLimitInfo.callCount > 80) {
              console.warn(
                `[DMSpark] ⚠️ Rate limit warning: ${rateLimitInfo.callCount}% used`
              )
            }
          }
        } catch (e) {
          // Ignore parsing errors for rate limit header
        }
      }

      // Handle rate limiting (429)
      if (res.status === 429) {
        if (attempt < retries) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500
          console.warn(
            `[DMSpark] ⚠️ Rate limited (429). Retry ${attempt + 1}/${retries} in ${Math.round(delay)}ms`
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        console.error("[DMSpark] ❌ Rate limit exceeded after all retries")
      }

      const data = await res.json()
      return { data, ok: res.ok, rateLimitInfo }
    } catch (error: any) {
      if (attempt < retries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt)
        console.warn(
          `[DMSpark] ⚠️ Network error. Retry ${attempt + 1}/${retries} in ${delay}ms:`,
          error.message
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }

  return { data: null, ok: false }
}

/**
 * Send a message via Instagram Graph API with rate limit protection.
 */
export async function sendInstagramMessage(
  accessToken: string,
  body: any
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const result = await instagramApiFetch(
      `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )

    if (result.ok && !result.data?.error) {
      return { success: true, data: result.data }
    }

    return { success: false, error: result.data?.error || result.data }
  } catch (error: any) {
    return { success: false, error: { message: error.message } }
  }
}

/**
 * Reply to a comment via Instagram Graph API with rate limit protection.
 */
export async function replyToComment(
  commentId: string,
  accessToken: string,
  message: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const result = await instagramApiFetch(
      `https://graph.instagram.com/v24.0/${commentId}/replies?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    )

    if (result.ok && !result.data?.error) {
      return { success: true, data: result.data }
    }

    return { success: false, error: result.data?.error || result.data }
  } catch (error: any) {
    return { success: false, error: { message: error.message } }
  }
}
