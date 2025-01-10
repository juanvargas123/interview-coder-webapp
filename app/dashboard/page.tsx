"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserProfile {
  email: string
  subscription_status?: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/signin")
        return
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", session.user.id)
        .single()

      setProfile({
        email: session.user.email!,
        subscription_status: subscription?.status
      })
    }

    loadProfile()
  }, [router])

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <p>Email: {profile.email}</p>
        <p>Subscription: {profile.subscription_status || "None"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/billing")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}
