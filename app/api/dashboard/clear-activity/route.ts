import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userId")
        if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

        const supabase = await getSupabaseServerClient()

        // Delete recent activity message logs for this user
        const { error } = await supabase
            .from("messages")
            .delete()
            .eq("user_id", userId)

        if (error) {
            console.error("Supabase clear activity error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Clear activity error:", error)
        return NextResponse.json({ error: "Failed to clear activity" }, { status: 500 })
    }
}
