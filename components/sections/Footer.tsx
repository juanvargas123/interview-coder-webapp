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
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center justify-left gap-6">
              <Image
                src="/logo.svg"
                alt="Interview Coder"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
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

          {/* Middle Column - Support */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="text-neutral-400 font-semibold">Support</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/contact"
                className="text-neutral-500 hover:text-neutral-300 text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/policies"
                className="text-neutral-500 hover:text-neutral-300 text-sm"
              >
                Refund Policy
              </Link>
              <Link
                href="/policies"
                className="text-neutral-500 hover:text-neutral-300 text-sm"
              >
                Cancellation Policy
              </Link>
            </div>
          </div>

          {/* Right Column - Download */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="text-neutral-400 font-semibold">Download</h3>
            <div className="flex flex-col gap-4">
              <Link
                href="https://github.com/ibttf/interview-coder"
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
                  <Button className="text-black gap-2 text-sm font-medium px-6 h-10">
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
                    <Link href="https://tinyurl.com/bdemcvx2">
                      Download for Intel Mac
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 cursor-pointer">
                    <Link href="https://tinyurl.com/yfsnn5dd">
                      Download for Silicon Mac
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-neutral-800">
          <p className="text-neutral-500 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Interview Coder. All rights reserved.
          </p>
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
