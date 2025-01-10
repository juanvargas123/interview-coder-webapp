import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url)

  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code")

  if (code) {
    // Create a Supabase client
    const supabase = createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If successful, redirect to the 'next' path or home
      return NextResponse.redirect(`${origin}`)
    }
  }

  // If there's no code or an error occurred, redirect to signin
  return NextResponse.redirect(
    `${origin}/signin?error=${encodeURIComponent(
      "No authentication code received"
    )}`
  )
}
