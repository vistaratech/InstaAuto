import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // 1. Get Access Token from Database
    const { data: user } = await supabase
      .from("users")
      .select("access_token")
      .eq("id", userId)
      .single()

    if (!user?.access_token) {
      return NextResponse.json({ error: "Instagram not connected or token missing" }, { status: 401 })
    }

    // 2. Fetch Profile Picture from Instagram Graph API
    const url = `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${user.access_token}`
    
    console.log("[v0] Fetching Profile Picture from:", url)

    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()

    if (data.error) {
      console.error("[v0] Instagram Profile Error:", data.error)
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      profilePictureUrl: data.profile_picture_url || null,
      username: data.username
    })

  } catch (error: any) {
    console.error("[v0] Profile picture route error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
