"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Menu, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { CommandDialog } from "../ui/command-dialog"

const HELP_SECTIONS = [
  {
    title: "General",
    items: [
      {
        id: "getting-started",
        title: "Getting Started",
        content: "Learn how to get started with Interview Coder"
      },
      {
        id: "configuration",
        title: "Language Configuration",
        content: "Configure Interview Coder for your needs"
      },
      {
        id: "undetectability",
        title: "Undetectability",
        content: "Understanding how Interview Coder remains undetectable"
      }
    ]
  },

  {
    title: "Account and Subscription",
    items: [
      {
        id: "cancel-subscription",
        title: "Cancel Subscription",
        content: "Cancel your subscription"
      },
      {
        id: "refund-policy",
        title: "Refund Policy",
        content: "Our refund policy"
      }
    ]
  },
  {
    title: "Troubleshooting",
    items: [
      {
        id: "out-of-credits",
        title: "Says out of credits",
        content: "Troubleshoot credit-related issues"
      },
      {
        id: "cant-see-screen",
        title: "Can't see screen",
        content: "Fix screen visibility issues"
      },
      {
        id: "shows-when-sharing",
        title: "Shows when I share screen",
        content: "Resolve screen sharing visibility problems"
      }
    ]
  }
]

// Flatten sections for easy lookup
const ALL_SECTIONS = HELP_SECTIONS.reduce((acc, section) => {
  section.items.forEach((item) => {
    acc[item.id] = item
  })
  return acc
}, {} as Record<string, { id: string; title: string; content: string }>)

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

interface NavContentProps {
  className?: string
}

function NavContent({ className }: NavContentProps) {
  const { data, isLoading: loading } = useQuery({
    queryKey: ["user-nav"],
    queryFn: fetchUserAndSubscription,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const activeSection = searchParams.get("section") || "getting-started"
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const user = data?.user
  const subscription = data?.subscription
  const isSubscribed = subscription?.status === "active"
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
      <div className="relative mb-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center"
        >
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documentation"
            className="w-full pl-8 sm:pl-9 pr-16 py-1.5 sm:py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            readOnly
          />
          <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="bg-zinc-800 px-1.5 py-1 rounded text-[9px] sm:text-[10px] leading-none text-zinc-400">
              ⌘
            </span>
            <span className="bg-zinc-800 px-1.5 py-1 rounded text-[9px] sm:text-[10px] leading-none text-zinc-400">
              K
            </span>
          </div>
        </button>
        <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      </div>

      <div className="mb-6">{renderAuthContent()}</div>

      <div className="space-y-6">
        {HELP_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-[13px] font-medium text-muted-foreground px-3 mb-2">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/help?section=${item.id}`)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors",
                  activeSection === item.id
                    ? "bg-zinc-800/50 text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HelpNavbar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 relative">
        <div className="h-screen sticky top-0 overflow-y-auto border-r border-zinc-800/50 bg-black/20 backdrop-blur-xl">
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
              <NavContent className="" />
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
            <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
              <SheetTitle className="text-left sticky top-0 bg-background/95 backdrop-blur-sm pb-4">
                Documentation
              </SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <NavContent className="mt-8" />
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
