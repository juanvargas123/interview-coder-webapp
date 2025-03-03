"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect } from "react"

export interface ExtendedUser extends User {
  isSubscribed?: boolean
  preferred_language?: string
}

async function fetchUserAndStatus(): Promise<{
  user: ExtendedUser | null
  isSubscribed: boolean
}> {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return { user: null, isSubscribed: false }
  }

  // Get subscription status
  const subscriptionResult = await supabase
    .from("subscriptions")
    .select("status, cancel_at, current_period_end, language")
    .eq("user_id", session.user.id)
    .single()

  const subscription = subscriptionResult.data
  const isSubscribed =
    subscription?.status === "active" &&
    new Date(subscription.cancel_at) >= new Date()

  return {
    user: { ...session.user, isSubscribed },
    isSubscribed
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

  return {
    user: data?.user ?? null,
    isSubscribed: data?.isSubscribed ?? false,
    loading: isLoading
  }
}
