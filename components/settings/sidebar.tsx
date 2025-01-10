"use client"

import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "account", label: "Account" },
    { id: "profile", label: "Profile" },
    { id: "organization", label: "Organization" },
    { id: "affiliate", label: "Affiliate Program" }
  ]

  return (
    <div className="w-72 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "w-full text-left px-4 py-2.5 rounded-xl text-[15px] transition-colors",
            activeTab === tab.id
              ? "bg-[#2A2A2A] text-white font-medium"
              : "text-[#989898] hover:text-white hover:bg-[#1A1A1A]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
