import React, { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
}

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange
}) => {
  const { t } = useLanguage()
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10 // Adding margin/padding if necessary
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible])

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setIsTooltipVisible(false)
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Question mark circle */}
      <div className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors flex items-center justify-center cursor-help z-10">
        <span className="text-xs text-white/70">?</span>
      </div>

      {/* Tooltip Content */}
      {isTooltipVisible && (
        <div ref={tooltipRef} className="absolute top-full right-0 mt-2 w-80">
          <div className="p-3 text-xs bg-gray-900 backdrop-blur-md rounded-lg border border-white/10 text-white/90 shadow-lg">
            <div className="space-y-4">
              <h3 className="font-medium truncate">{t('queueCommands.keyboardShortcuts')}</h3>
              <div className="space-y-3">
                {/* Toggle Command */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{t('queueCommands.toggleWindow')}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        ⌘
                      </span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        B
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/70 truncate">
                    {t('queueCommands.toggleWindowDesc')}
                  </p>
                </div>
                {/* Screenshot Command */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{t('queueCommands.takeScreenshot')}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        ⌘
                      </span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        H
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/70 truncate">
                    {t('queueCommands.takeScreenshotDesc')}
                  </p>
                </div>

                {/* Solve Command */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{t('queueCommands.solveProblem')}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        ⌘
                      </span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        ↵
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/70 truncate">
                    {t('queueCommands.solveProblemDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QueueCommands
