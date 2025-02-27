"use client"
import { useState } from "react"
import Link from "next/link"

const SubscribePage = () => {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="rounded-md py-8 sm:py-12 bg-black flex items-center justify-center">
      <div className="w-full px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Welcome to Interview Coder
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 mb-4 sm:mb-6">
            To continue using Interview Coder, you'll need to subscribe
            ($60/month)
          </p>

          {/* Keyboard Shortcuts */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2 sm:p-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-white/70 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white/40">Toggle Visibility</span>
                <div className="flex gap-1">
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] leading-none text-white/60">
                    ⌘
                  </kbd>
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] leading-none text-white/60">
                    B
                  </kbd>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white/40">Quit App</span>
                <div className="flex gap-1">
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] leading-none text-white/60">
                    ⌘
                  </kbd>
                  <kbd className="bg-white/[0.07] border border-white/[0.1] rounded-md px-1 sm:px-1.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] leading-none text-white/60">
                    Q
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <Link
            href="/settings"
            className="w-full px-4 py-2.5 sm:py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mb-4 sm:mb-6"
          >
            Subscribe
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-3.5 sm:h-3.5"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>

          {/* Logout Section */}
          <div className="border-t border-white/[0.06] pt-4">
            <button className="flex items-center justify-center gap-1.5 text-[11px] text-red-400/80 hover:text-red-400 transition-colors w-full group">
              <div className="w-3.5 h-3.5 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              Log Out
            </button>
          </div>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscribePage
