import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-left">
              <Image
                src="/logo.svg"
                alt="Interview Coder"
                width={24}
                height={24}
                className="w-24 h-24"
              />
              <span className="text-neutral-400 font-bold text-xl">
                INTERVIEW CODER
              </span>
            </div>

            <div className="text-neutral-500 text-sm">
              Interview Coder is an undetectable desktop application to help you
              pass your Leetcode interviews.
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 flex items-center gap-2 w-fit">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-neutral-400 text-sm">
                All systems online
              </span>
            </div>
          </div>

          {/* Middle Column */}
          <div
            className="md:col-span-4 flex flex-col justify-center"
            style={{ marginTop: "28px" }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-neutral-500 text-sm mb-1">
                Talk to a creator
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/roy-lee-cs123",
                      "_blank"
                    )
                  }
                  className="text-neutral-400 hover:text-neutral-300"
                >
                  Roy
                </button>
                <span className="text-neutral-500">n'</span>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/neel-shanmugam/",
                      "_blank"
                    )
                  }
                  className="text-neutral-400 hover:text-neutral-300"
                >
                  Neel
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="md:col-span-3 flex flex-col justify-center"
            style={{ marginTop: "28px" }}
          >
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/roylee0912/interview-coder"
                target="_blank"
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300 text-sm"
              >
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="opacity-70"
                />
                View on GitHub
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className=" text-white gap-2 text-sm font-medium px-6 h-10">
                    <Image
                      src="/apple.svg"
                      alt="Apple"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-black border-[#800020]/20"
                >
                  <DropdownMenuItem asChild className="py-2 cursor-pointer">
                    <Link href="https://github.com/ibttf/interview-coder/releases/download/v1.0.3/Interview.Coder-1.0.0-arm64.dmg">
                      Download for Intel Mac
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 cursor-pointer">
                    <Link href="https://github.com/ibttf/interview-coder/releases/download/v1.0.3/Interview.Coder-1.0.0-arm64.dmg">
                      Download for Silicon Mac
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Twitter icon in bottom right */}
        <div className="flex justify-end mt-8">
          <Link href="https://twitter.com/interviewcoder" target="_blank">
            <Image
              src="/twitter.svg"
              alt="Twitter"
              width={20}
              height={20}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}
