import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

// GET /api/instagram/users - List all connected Instagram accounts
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, username, business_account_id, updated_at")
      .order("updated_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      users: (data || []).map((u: any) => ({
        userId: u.id,
        username: u.username,
        businessAccountId: u.business_account_id,
        updatedAt: u.updated_at,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
