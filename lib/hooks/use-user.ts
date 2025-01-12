"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export interface ExtendedUser extends User {
  user_metadata: {
    avatar_url?: string
    full_name?: string
    name?: string
    picture?: string
    email?: string
  }
}

export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const checkSubscription = async (userId: string) => {
    try {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single()
      setIsSubscribed(!!sub)
    } catch (error) {
      console.error("Error checking subscription:", error)
      setIsSubscribed(false)
    }
  }

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user as ExtendedUser)
      if (user) {
        checkSubscription(user.id)
      }
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser((session?.user as ExtendedUser) ?? null)
      if (session?.user) {
        await checkSubscription(session.user.id)
      } else {
        setIsSubscribed(false)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, isSubscribed }
}
