import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Enforce HTTPS in production only, and never for localhost
  const host = request.headers.get("host") || ""
  if (
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(
      `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
      307
    )
  }

  const response = NextResponse.next()

  // Add security headers to help prevent various attacks
  const securityHeaders = {
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-XSS-Protection": "1; mode=block",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    // Helps prevent browser fingerprinting and adds privacy
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  }

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add caching headers for static assets to improve performance
  if (request.nextUrl.pathname.match(/\.(jpe?g|png|gif|svg|webp|css|js)$/)) {
    response.headers.set("Cache-Control", "public, max-age=86400, immutable")
  }

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

  // Optional - add custom headers that could make IP-based blocking more difficult
  // by masking some identifying information or adding "noise"
  response.headers.set("Server", "Unknown")
  response.headers.delete("x-powered-by") // Remove if exists

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

  // Redirect to home if trying to access settings while not logged in
  if (request.nextUrl.pathname === "/settings" && !session) {
    return NextResponse.redirect(new URL("/", request.url))
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
