import "server-only"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          // @ts-expect-error cookies doesn't have this
          const cookieStore: ReadonlyRequestCookies = cookies()
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: any) {
          // @ts-expect-error cookies doesn't have this
          const cookieStore: ReadonlyRequestCookies = cookies()
          cookieStore.set(name, value, options)
        },
        async remove(name: string, options: any) {
          // @ts-expect-error cookies doesn't have this
          const cookieStore: ReadonlyRequestCookies = cookies()
          // @ts-expect-error cookies doesn't have this
          cookieStore.delete(name, options)
        }
      }
    }
  )
}

// Service role client for webhook operations
export const createAdminClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
