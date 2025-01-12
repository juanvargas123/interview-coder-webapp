"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect } from "react"

export interface ExtendedUser extends User {
  isSubscribed?: boolean
}

async function fetchUserAndSubscription(): Promise<{
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
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, cancel_at")
    .eq("user_id", session.user.id)
    .single()

  const isSubscribed =
    subscription?.status === "active" && !subscription?.cancel_at

  return {
    user: { ...session.user, isSubscribed },
    isSubscribed
  }
}

export function useUser() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserAndSubscription,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchInterval: 1000 * 60 * 5 // Refetch every 5 minutes
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
