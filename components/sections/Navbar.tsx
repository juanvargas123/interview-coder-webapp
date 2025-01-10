"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

export default function Navbar() {
  const [isSilicon, setIsSilicon] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    // Detect Silicon Mac
    const platform = navigator.platform.toLowerCase()
    setIsSilicon(platform.includes("mac") && !platform.includes("intel"))

    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 w-full z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "w-full max-w-7xl h-14 transition-all duration-200 rounded-2xl border border-white/10",
          scrolled
            ? "bg-black/95 backdrop-blur-md"
            : "bg-[#0A0A0A]/95 backdrop-blur-md"
        )}
      >
        <div className="h-full flex items-center justify-between px-6">
          <Link
            href="/"
            className="text-white hover:text-white/80 transition-colors flex items-center gap-2"
          >
            <Image
              src="/logo.svg"
              alt="Interview Coder"
              width={20}
              height={20}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold">Interview Coder</span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            <Link
              href="#how-to-use"
              className="text-[#989898] hover:text-white transition-colors text-sm"
            >
              How to Use
            </Link>
            <Link
              href="#pricing"
              className="text-[#989898] hover:text-white transition-colors text-sm"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-[#989898] hover:text-white transition-colors text-sm"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!loading &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <ChevronDown className="w-4 h-4 text-[#989898]" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-xs">
                          {user.email?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#1A1A1A] backdrop-blur-lg border-white/10 rounded-xl py-2 space-y-1"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings"
                        className="cursor-pointer text-[#ABABAB] hover:text-white px-3 py-2.5"
                      >
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px bg-white/10 mx-3 my-1" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-[#FF4545] hover:text-red-400 px-3 py-2.5"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-[#989898] hover:text-white transition-colors text-sm"
                  >
                    Sign in
                  </Link>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-black transition-all px-4 py-1.5 text-sm font-medium flex items-center gap-2"
                  >
                    <Link href="/signin">
                      <Image
                        src="/apple.svg"
                        alt="Apple"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Download
                    </Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </nav>
    </div>
  )
}
