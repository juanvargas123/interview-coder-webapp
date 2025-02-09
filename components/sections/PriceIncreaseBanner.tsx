import { useEffect, useState } from "react"
import { Clock, X } from "lucide-react"

export const BANNER_DISMISSED_KEY = "price-increase-banner-dismissed"

interface PriceIncreaseBannerProps {
  isVisible: boolean
  onDismiss: () => void
}

export const PriceIncreaseBanner = ({
  isVisible,
  onDismiss
}: PriceIncreaseBannerProps) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!isVisible) return

    const endTime = new Date("2025-02-10T14:00:00-05:00").getTime()

    const updateTime = () => {
      const now = new Date().getTime()
      const distance = endTime - now

      if (distance < 0) {
        setTimeLeft("00:00:00")
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 text-black py-2 shadow-sm">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 text-sm font-medium tracking-tight relative">
        <div className="flex items-center gap-2 bg-black/5 rounded-full px-3 py-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold font-mono">{timeLeft}</span>
        </div>
        <span>
          left before price increases to{" "}
          <span className="font-semibold">$40/month</span>
        </span>
        <button
          onClick={onDismiss}
          className="absolute right-4 hover:bg-black/5 rounded-full p-1 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
