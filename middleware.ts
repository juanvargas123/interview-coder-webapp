import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Create supabase client for auth state
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.delete({ name, ...options })
        }
      }
    }
  )

  // Get session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // If on checkout page and logged in, check subscription
  if (request.nextUrl.pathname === "/checkout" && session) {
    // Get subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status, cancel_at")
      .eq("user_id", session.user.id)
      .single()

    const isSubscribed =
      subscription?.status === "active" && !subscription?.cancel_at

    // If subscribed, redirect to settings
    if (isSubscribed) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Allow Stripe webhook without auth
  if (request.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
