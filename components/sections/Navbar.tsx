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

export default function Navbar() {
  const [stars, setStars] = useState("")
  const [isSilicon, setIsSilicon] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Detect Silicon Mac
    const platform = navigator.platform.toLowerCase()
    setIsSilicon(platform.includes("mac") && !platform.includes("intel"))

    // Fetch GitHub stars
    fetch("https://api.github.com/repos/ibttf/interview-coder")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Keep default value if fetch fails
      })

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

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 w-screen z-50 flex justify-center h-[72px] px-4 sm:px-6 md:px-8">
      <nav className="w-full mt-2 sm:mt-4 md:mt-6 h-fit rounded-[20px] border-[1px] border-white/30 bg-black/50 backdrop-blur-md shadow-lg shadow-black/10">
        <div className="h-12 sm:h-14 md:h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors flex items-center justify-center gap-4"
            >
              <Image
                src="/logo.svg"
                alt="Interview Coder"
                width={24}
                height={24}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full"
              />
              <span className="hidden lg:block text-xl font-extrabold tracking-tighter">
                Interview Coder
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link
              href="https://github.com/ibttf/interview-coder"
              target="_blank"
              className="flex items-center gap-1 sm:gap-2 bg-black/30 hover:bg-gray-900/20 transition-all px-3 sm:px-4 md:px-6 h-8 sm:h-10 md:h-11 rounded-full border border-white/20 hover:shadow-sm"
            >
              <Image
                src="/github.svg"
                alt="Github"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
              <span className="font-medium text-white/70 text-sm sm:text-base">
                {stars}
              </span>
            </Link>

            {!loading &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-white transition-all px-3 sm:px-4 md:px-6 h-8 sm:h-10 md:h-11 rounded-full border border-white/20 hover:shadow-sm">
                      <span className="font-medium text-sm sm:text-base">
                        {user.email}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-black border-white/20"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/billing" className="cursor-pointer">
                        Billing
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all px-3 sm:px-4 md:px-6 h-8 sm:h-10 md:h-11 rounded-full border border-white/20 hover:shadow-sm font-medium text-sm sm:text-base"
                >
                  Sign In
                </Link>
              ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-1 sm:gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black transition-all px-3 sm:px-4 md:px-6 h-8 sm:h-10 md:h-11 rounded-full border border-black/20 hover:shadow-sm font-semibold text-xs sm:text-sm md:text-base"
                >
                  <Image
                    src="/apple.svg"
                    alt="Apple"
                    width={16}
                    height={16}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  Download
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 sm:w-64 md:w-72 bg-black border-[#800020]/20"
              >
                <DropdownMenuItem
                  asChild
                  className="py-2 sm:py-3 cursor-pointer text-sm sm:text-base"
                >
                  <Link href="https://tinyurl.com/bdemcvx2">
                    Download for Intel Mac {!isSilicon && "(Detected)"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="py-2 sm:py-3 cursor-pointer text-sm sm:text-base"
                >
                  <Link href="https://tinyurl.com/yfsnn5dd">
                    Download for Silicon Mac {isSilicon && "(Detected)"}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  )
}
