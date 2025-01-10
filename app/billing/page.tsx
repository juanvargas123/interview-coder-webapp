"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Subscription {
  status: string
  plan: string
  current_period_end: string
  trial_end: string | null
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadSubscription() {
      // Check if user is authenticated
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth")
        return
      }

      // Get user's subscription status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      setSubscription(sub)
      setLoading(false)
    }

    loadSubscription()
  }, [router])

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth")
        return
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email
        })
      })

      const { url } = await response.json()
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {subscription ? (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          <div className="space-y-2">
            <p>
              Status: <span className="capitalize">{subscription.status}</span>
            </p>
            <p>
              Plan: <span className="capitalize">{subscription.plan}</span>
            </p>
            <p>
              Renews:{" "}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
            {subscription.trial_end && (
              <p>
                Trial ends:{" "}
                {new Date(subscription.trial_end).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
          <p className="mb-6 text-gray-400">Subscribe to access all features</p>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Subscribe Now"}
          </button>
        </div>
      )}
    </div>
  )
}
