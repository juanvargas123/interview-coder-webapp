import { NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      )
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete subscription data
    const { error: deleteError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", session.user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete subscription data" },
        { status: 500 }
      )
    }

    // Delete the user's auth account using admin client
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      session.user.id
    )

    if (deleteUserError) {
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    )
  }
}
