"use client"

import { useState } from "react"
import { useUser } from "@/lib/hooks/use-user"
import Navbar from "@/components/sections/Navbar"
import { UserHeader } from "@/components/settings/user-header"
import { Sidebar } from "@/components/settings/sidebar"
import { AccountDetails } from "@/components/settings/account-details"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="flex gap-12">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 max-w-2xl">
            <UserHeader user={user} />
            <div className="space-y-10">
              {activeTab === "account" && <AccountDetails user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
