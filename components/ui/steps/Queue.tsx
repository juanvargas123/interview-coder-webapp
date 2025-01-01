import React, { useState, useRef, useEffect } from "react"
import QueueCommands from "./QueueCommands"
import Image from "next/image"

export default function Queue() {
  const [isLoading, setIsLoading] = useState(false)
  const [solution, setSolution] = useState("")
  const [error, setError] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [hasScreenshot, setHasScreenshot] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isXHighlighted, setIsXHighlighted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  useEffect(() => {
    // Start immediately
    setIsHighlighted(true)
    setTimeout(() => {
      setIsHighlighted(false)
      setShowScreenshot(true)
    }, 1000)

    setTimeout(() => {
      setHasScreenshot(true)
    }, 2000)

    // Hover effect - delayed
    setTimeout(() => {
      setIsHovered(true)
    }, 4000)

    // X button highlight effect - delayed further
    setTimeout(() => {
      setIsXHighlighted(true)
    }, 5200)

    // Click and remove
    setTimeout(() => {
      setShowScreenshot(false)
      setIsHovered(false)
      setIsXHighlighted(false)
    }, 5600)

    const animationInterval = setInterval(() => {
      setIsHighlighted(true)
      setTimeout(() => {
        setIsHighlighted(false)
        setShowScreenshot(true)
      }, 1000)

      setTimeout(() => {
        setHasScreenshot(true)
      }, 2000)

      setTimeout(() => {
        setIsHovered(true)
      }, 4000)

      setTimeout(() => {
        setIsXHighlighted(true)
      }, 5200)

      setTimeout(() => {
        setShowScreenshot(false)
        setIsHovered(false)
        setIsXHighlighted(false)
      }, 5600)
    }, 8000)

    return () => clearInterval(animationInterval)
  }, [])

  return (
    <div
      ref={contentRef}
      className="bg-transparent w-full lg:w-full lg:pt-0 pt-24"
    >
      {showScreenshot && (
        <div
          className={`absolute left-2 lg:-top-28 top-0 w-[120px] lg:w-[150px] aspect-video bg-gray-800 rounded-lg shadow-2xl border border-white transition-opacity duration-200 ${
            isHovered ? "opacity-50" : "opacity-100"
          }`}
        >
          <Image
            src="/fake-screenshot.jpg"
            alt="Screenshot preview"
            fill
            className="w-[25%] rounded-lg"
          />
          {isHovered && (
            <div
              className={`absolute top-2 left-2 w-5 h-5 rounded-full ${
                isXHighlighted ? "bg-white/40" : "bg-black/60"
              } flex items-center justify-center cursor-pointer z-[90] transition-colors duration-150`}
            >
              <span
                className={`${
                  isXHighlighted ? "text-black" : "text-white/70"
                } text-xs transition-colors duration-150`}
              >
                ×
              </span>
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-3">
        <div className="space-y-3 w-full">
          <div className="pt-2 w-full">
            <div className="text-xs text-white/90 backdrop-blur-md bg-black/60 rounded-lg py-2 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-4 whitespace-nowrap">
              {/* Show/Hide */}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[9px] sm:text-[11px] leading-none">
                  Show/Hide
                </span>
                <div className="flex gap-0.5 sm:gap-1">
                  <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70">
                    ⌘
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70">
                    B
                  </button>
                </div>
              </div>

              {/* Screenshot */}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[9px] sm:text-[11px] leading-none truncate">
                  {showScreenshot ? "Screenshot" : "Take first screenshot"}
                </span>
                <div className="flex gap-0.5 sm:gap-1">
                  <button
                    className={`${
                      isHighlighted ? "bg-white/30" : "bg-white/10"
                    } transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70`}
                  >
                    ⌘
                  </button>
                  <button
                    className={`${
                      isHighlighted ? "bg-white/30" : "bg-white/10"
                    } transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70`}
                  >
                    H
                  </button>
                </div>
              </div>

              {/* Solve Command */}
              {showScreenshot && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[9px] sm:text-[11px] leading-none">
                    Solve
                  </span>
                  <div className="flex gap-0.5 sm:gap-1">
                    <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70">
                      ⌘
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1 sm:px-1.5 py-1 text-[9px] sm:text-[11px] leading-none text-white/70">
                      ↵
                    </button>
                  </div>
                </div>
              )}

              <div className="mx-1 sm:mx-2 h-4 bg-white/20" />

              <QueueCommands
                onTooltipVisibilityChange={handleTooltipVisibilityChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
