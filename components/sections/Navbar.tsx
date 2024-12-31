"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [stars, setStars] = useState("")
  const [isSilicon, setIsSilicon] = useState(false)

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
  }, [])

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pt-6">
      <nav className="mx-6 w-full max-w-[90rem] rounded-[20px] border-[1px] border-white/30 bg-black/50 backdrop-blur-md shadow-lg shadow-black/10">
        <div className="px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors"
            >
              Interview Coder
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/ibttf/interview-coder"
              target="_blank"
              className="flex items-center gap-2 bg-black/30 hover:bg-gray-900/20 transition-all px-6 h-11 rounded-full border  border-white/20 hover:shadow-sm"
            >
              <Image
                src="/github.svg"
                alt="Github"
                width={20}
                height={20}
                className="w-6 h-6"
              />
              <span className="font-medium text-white/70 text-base">
                {stars}
              </span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#800020] text-white hover:bg-[#9A0025] gap-2 text-base font-semibold px-6 h-11">
                  <Image
                    src="/apple.svg"
                    alt="Apple"
                    width={16}
                    height={16}
                    className="w-5 h-5"
                  />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 bg-black border-[#800020]/20"
              >
                <DropdownMenuItem className="py-3 cursor-pointer text-base">
                  Download for Intel Mac {!isSilicon && "(Detected)"}
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 cursor-pointer text-base">
                  Download for Silicon Mac {isSilicon && "(Detected)"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  )
}
