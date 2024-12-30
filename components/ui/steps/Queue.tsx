import React, { useState, useRef } from "react"
import QueueCommands from "./QueueCommands"

const Queue = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  return (
    <div ref={contentRef} className="bg-transparent w-full">
      <div className="px-4 py-3">
        <div className="space-y-3 w-fit">
          <div className="pt-2 w-fit">
            <div className="text-xs text-white/90 backdrop-blur-md bg-gray-900 rounded-full  py-2 px-4 flex items-center justify-center gap-4">
              {/* Show/Hide */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] leading-none">Show/Hide</span>
                <div className="flex gap-1">
                  <button className=" bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1.5 py-1 text-[11px] leading-none text-white/70">
                    ⌘
                  </button>
                  <button className=" bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1.5 py-1 text-[11px] leading-none text-white/70">
                    B
                  </button>
                </div>
              </div>

              {/* Screenshot */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] leading-none truncate">
                  Take first screenshot
                </span>
                <div className="flex gap-1">
                  <button className=" bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1.5 py-1 text-[11px] leading-none text-white/70">
                    ⌘
                  </button>
                  <button className=" bg-white/10 hover:bg-white/20 transition-colors rounded-[5px] px-1.5 py-1 text-[11px] leading-none text-white/70">
                    H
                  </button>
                </div>
              </div>

              <div className="mx-2 h-4 bg-white/20" />

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

export default Queue
