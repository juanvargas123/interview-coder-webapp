"use client"

import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "account", label: "Account" },
    { id: "billing", label: "Billing" }
  ]

  return (
    <div className="lg:w-72 w-full space-y-1 flex flex-col lg:h-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-[13px] lg:text-[15px] transition-colors",
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
