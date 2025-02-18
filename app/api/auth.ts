import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function verifyAuth() {
  const headersList = await headers()
  const authorization = headersList.get("authorization")

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return {
      error: "No token provided",
      status: 401
    }
  }

  const token = authorization.split(" ")[1]

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        error: "Supabase configuration missing",
        status: 500
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return {
        error: "Invalid token",
        status: 401
      }
    }

    return { user }
  } catch (error) {
    return {
      error: "Invalid token",
      status: 401
    }
  }
}
