"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, Lock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

export default function Navbar() {
  const [isSilicon, setIsSilicon] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const { user, loading, isSubscribed } = useUser()

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    // Detect Silicon Mac
    const platform = navigator.platform.toLowerCase()
    setIsSilicon(platform.includes("mac") && !platform.includes("intel"))

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const downloadUrl = isSilicon
    ? "https://tinyurl.com/yfsnn5dd"
    : "https://tinyurl.com/bdemcvx2"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const renderAuthSection = () => {
    if (loading) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )
    }

    if (user) {
      return (
        <>
          {!isSubscribed && (
            <Button
              onClick={() => router.push("/checkout")}
              className="bg-black hover:bg-black/90 text-primary border border-primary transition-all px-5 py-2 text-sm font-semibold h-9"
            >
              <Lock className="w-4 h-4 mr-2 text-primary" />
              Subscribe
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ChevronDown className="w-4 h-4 text-[#989898]" />
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
        </>
      )
    }

    return (
      <>
        <Link
          href="/signin"
          className="text-[#989898] hover:text-white transition-colors text-sm"
        >
          Sign in
        </Link>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-black transition-all px-4 py-1.5 text-sm font-medium"
        >
          <Link href={downloadUrl} className="flex items-center gap-2">
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
    )
  }

  const renderMobileAuthSection = () => {
    if (loading) {
      return (
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center gap-3 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
          <Skeleton className="h-9 w-full mt-2" />
        </div>
      )
    }

    if (user) {
      return (
        <>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-xs">
                {user.email?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-white">{user.email}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start text-[#989898] hover:text-white"
          >
            <Link href="/settings">Settings</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-[#FF4545] hover:text-red-400"
          >
            Log out
          </Button>
        </>
      )
    }

    return (
      <>
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start text-[#989898] hover:text-white mb-2"
        >
          <Link href="/signin">Sign in</Link>
        </Button>
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-black"
        >
          <Link
            href={downloadUrl}
            className="flex items-center gap-2 justify-center"
          >
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
        <Button asChild variant="secondary" className="w-full mt-2">
          <Link
            href="/waitlist"
            className="flex items-center gap-2 justify-center"
          >
            <Image
              src="/windows.svg"
              alt="Windows"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            Windows Waitlist
          </Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="fixed left-0 top-0 w-full z-50 flex justify-center px-4 pt-4">
        <nav
          className={cn(
            "w-full max-w-7xl h-14 transition-all duration-200 rounded-2xl border border-white/10",
            scrolled
              ? "bg-black/40 backdrop-blur-xl"
              : "bg-[#0A0A0A]/40 backdrop-blur-xl",
            mobileMenuOpen && "!rounded-b-none"
          )}
        >
          <div className="h-full flex items-center justify-between px-6">
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0"
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

            <div className="flex-1 flex items-center justify-center">
              <div className="hidden md:flex items-center gap-8">
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
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              {renderAuthSection()}
            </div>

            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors",
                mobileMenuOpen && "bg-white/5"
              )}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl rounded-b-2xl"
            >
              <div className="px-6 py-4 space-y-4">
                <Link
                  href="#how-to-use"
                  className="block text-[#989898] hover:text-white transition-colors text-sm"
                >
                  How to Use
                </Link>
                <Link
                  href="#pricing"
                  className="block text-[#989898] hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  className="block text-[#989898] hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>

                {!loading && (
                  <div className="pt-2 border-t border-white/10">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-primary text-xs">
                              {user.email?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm text-white">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <Link
                          href="/settings"
                          className="block text-[#989898] hover:text-white transition-colors text-sm py-2"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left text-[#FF4545] hover:text-red-400 text-sm py-2"
                        >
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/signin"
                          className="block text-[#989898] hover:text-white transition-colors text-sm py-2"
                        >
                          Sign in
                        </Link>
                        <div className="space-y-2 mt-2">
                          <Button
                            asChild
                            className="w-full bg-primary hover:bg-primary/90 text-black"
                          >
                            <Link
                              href={downloadUrl}
                              className="flex items-center gap-2 justify-center"
                            >
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
                          <Button
                            asChild
                            variant="secondary"
                            className="w-full"
                          >
                            <Link
                              href="/waitlist"
                              className="flex items-center gap-2 justify-center"
                            >
                              <Image
                                src="/windows.svg"
                                alt="Windows"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              Windows Waitlist
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}
