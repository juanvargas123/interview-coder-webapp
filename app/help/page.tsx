"use client"

import { useState } from "react"
import { HelpNavbar } from "@/components/sections/HelpNavbar"
import { DocsContent } from "@/components/docs/DocsContent"

export const SIDEBAR_ITEMS = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start Guide" }
    ]
  },
  {
    title: "Features",
    items: [
      { id: "ai-integration", label: "AI Integration" },
      { id: "code-generation", label: "Code Generation" }
    ]
  }
]

export default function HelpCenter() {
  const [activeSection, setActiveSection] = useState("introduction")

  return (
    <div className="min-h-screen bg-background">
      <HelpNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <DocsContent />
    </div>
  )
}
