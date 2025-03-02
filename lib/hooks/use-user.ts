"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect } from "react"

export interface ExtendedUser extends User {
  isSubscribed?: boolean
  isOnWaitlist?: boolean
  preferred_language?: string
}

async function fetchUserAndStatus(): Promise<{
  user: ExtendedUser | null
  isSubscribed: boolean
  isOnWaitlist: boolean
}> {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return { user: null, isSubscribed: false, isOnWaitlist: false }
  }

  // Get subscription and waitlist status in parallel
  const [subscriptionResult, waitlistResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status, cancel_at, current_period_end, language")
      .eq("user_id", session.user.id)
      .single(),
    supabase
      .from("waitlist")
      .select("id")
      .or(`email.eq.${session.user.email},user_id.eq.${session.user.id}`)
      .maybeSingle()
  ])

  const subscription = subscriptionResult.data
  const isSubscribed =
    subscription?.status === "active" &&
    new Date(subscription.cancel_at) >= new Date()

  const isOnWaitlist = !!waitlistResult.data

  return {
    user: { ...session.user, isSubscribed, isOnWaitlist },
    isSubscribed,
    isOnWaitlist
  }
}

export function useUser() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserAndStatus,
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    refetchOnMount: false, // Don't refetch on every mount
    refetchOnWindowFocus: true, // Still refetch on window focus for important updates
    retry: 2 // Retry failed requests twice
  })

  useEffect(() => {
    // Set up auth state change listener
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user"] })
      }
    })

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  const joinWaitlist = async (email: string) => {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Invalid email format" }
    }

    // Check if email is already on waitlist
    const { data: existingEntry } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single()

    if (existingEntry) {
      return { success: true, message: "You're already on the waitlist!" }
    }

    const { error } = await supabase.from("waitlist").insert([
      {
        email,
        user_id: data?.user?.id || null
      }
    ])
    if (error) {
      // Check if it's a unique constraint violation (duplicate email)
      if (error.code === "23505" || error.message?.includes("duplicate")) {
        return { success: true, message: "You're already on the waitlist!" }
      }
      // For other errors, throw generic error
      throw new Error("Failed to join waitlist")
    }

    // Invalidate and refetch user data
    queryClient.invalidateQueries({ queryKey: ["user"] })
    return { success: true, message: null }
  }

  return {
    user: data?.user ?? null,
    isSubscribed: data?.isSubscribed ?? false,
    isOnWaitlist: data?.isOnWaitlist ?? false,
    loading: isLoading,
    joinWaitlist
  }
}
