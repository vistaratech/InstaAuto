import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
    try {
        const conversationId = request.nextUrl.searchParams.get("conversationId")
        const userId = request.nextUrl.searchParams.get("userId")
        if (!conversationId || !userId) return NextResponse.json({ error: "Missing conversationId or userId" }, { status: 400 })

        const supabase = await getSupabaseServerClient()

        // Verify the conversation belongs to this user
        const { data: conv } = await supabase
            .from("conversations")
            .select("id")
            .eq("id", conversationId)
            .eq("user_id", userId)
            .single()

        if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 })

        // Fetch messages for this conversation
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true })

        if (error) throw error

        return NextResponse.json(messages)
    } catch (error) {
        console.error("[Inbox] Messages GET error:", error)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}
