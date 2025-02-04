"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, Menu, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"

async function fetchUserAndSubscription() {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  if (!session) return { user: null, subscription: null }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return { user: session.user, subscription }
}

const SIDEBAR_ITEMS = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start" },
      { id: "installation", label: "Installation" }
    ]
  },
  {
    title: "Features",
    items: [
      { id: "ai-integration", label: "AI Integration" },
      { id: "code-generation", label: "Code Generation" },
      { id: "debugging", label: "Debugging" }
    ]
  },
  {
    title: "Account & Billing",
    items: [
      { id: "subscription-plans", label: "Subscription Plans" },
      { id: "payment-methods", label: "Payment Methods" },
      { id: "billing-faq", label: "Billing FAQ" }
    ]
  }
]

interface NavContentProps {
  activeSection: string
  setActiveSection: (section: string) => void
  className?: string
}

function NavContent({
  activeSection,
  setActiveSection,
  className
}: NavContentProps) {
  const { data, isLoading: loading } = useQuery({
    queryKey: ["user-nav"],
    queryFn: fetchUserAndSubscription,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5
  })

  const user = data?.user
  const subscription = data?.subscription
  const isSubscribed = subscription?.status === "active"
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      await queryClient.invalidateQueries()
      queryClient.removeQueries()

      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  const renderAuthContent = () => {
    if (loading) {
      return null
    }

    if (!user) {
      return (
        <Link
          href="/signin"
          className="flex items-center gap-2 text-[#989898] hover:text-white transition-colors"
        >
          <Button variant="default" className="w-full">
            Sign in with Interview Coder
          </Button>
        </Link>
      )
    }

    const firstName = user.user_metadata?.first_name || ""
    const lastName = user.user_metadata?.last_name || ""

    return (
      <Link
        href="/settings"
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group"
      >
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-xs">
              {user.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isSubscribed && (
            <div className="absolute -top-1 -right-3 bg-primary text-black text-[10px] font-semibold px-1.5 rounded-full">
              PRO
            </div>
          )}
        </div>
        <span className="text-sm text-white group-hover:text-white/90">
          {firstName || lastName ? `${firstName} ${lastName}` : "View Settings"}{" "}
        </span>
      </Link>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative mb-6 ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documentation"
          className="w-full pl-9 pr-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
          <span className="bg-zinc-800 px-2 py-1 rounded text-[11px] leading-none text-zinc-400">
            {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}
          </span>
          <span className="bg-zinc-800 px-2 py-1 rounded text-[11px] leading-none text-zinc-400">
            K
          </span>
        </div> */}
      </div>

      <div className="mb-6">{renderAuthContent()}</div>

      <div className="space-y-6">
        {SIDEBAR_ITEMS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-[13px] font-medium text-muted-foreground px-3 mb-2">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors",
                  activeSection === item.id
                    ? "bg-zinc-800/50 text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface HelpNavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function HelpNavbar({
  activeSection,
  setActiveSection
}: HelpNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed hidden md:block w-72 h-screen top-0 left-0 border-r border-zinc-800/50 bg-black/20 backdrop-blur-xl overflow-y-auto">
        <div className="flex flex-col h-full p-4">
          <div className="mb-6">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="mb-4 rounded"
              />
            </Link>
          </div>
          <div className="flex-grow">
            <NavContent
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
          <div className="mt-auto pt-6">
            <div className="border-t border-zinc-800/50 pt-6">
              <p className="text-xs text-zinc-500 text-center">
                © 2025 Interview Coder.
                <br />
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed md:hidden w-full top-0 left-0 border-b border-zinc-800/50 bg-black/20 backdrop-blur-xl z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded"
            />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetTitle className="text-left">Documentation</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <NavContent
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    className="mt-8"
                  />
                </div>
                <div className="mt-auto pt-6">
                  <div className="border-t border-zinc-800/50 pt-6">
                    <p className="text-xs text-zinc-500 text-center">
                      © 2025 Interview Coder.
                      <br />
                      All rights reserved
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
