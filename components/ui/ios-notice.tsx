"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { X, Mail, Repeat } from "lucide-react"
import { track, ANALYTICS_EVENTS, getUserProperties } from "@/lib/mixpanel"
import { motion, AnimatePresence } from "framer-motion"

export function IOSNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is on iOS using getUserProperties
    const checkUserProperties = async () => {
      const properties = await getUserProperties()
      console.log("User properties:", properties)

      // Check if user is on iOS
      const isIOS = properties && properties["$os"] === "iOS"
      console.log("Is iOS?", isIOS, "OS:", properties?.["$os"])

      if (isIOS) {
        const hasShownNotice = localStorage.getItem("hasShownIOSNotice")
        console.log("Has shown notice before:", hasShownNotice)

        if (!hasShownNotice) {
          console.log("Showing iOS notice")
          setIsVisible(true)
          track(ANALYTICS_EVENTS.IOS_NOTICE_SHOWN)
        }
      }
    }

    checkUserProperties()
  }, [])

  const closeBanner = () => {
    setIsVisible(false)
    localStorage.setItem("hasShownIOSNotice", "true")
    track(ANALYTICS_EVENTS.IOS_NOTICE_CLOSED)
  }

  const sendEmailReminder = async () => {
    if (!email && !showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email) {
      setError("Please enter your email")
      return
    }

    try {
      const response = await fetch("/api/send-mac-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      setEmailSent(true)
      setError("")
      track(ANALYTICS_EVENTS.IOS_EMAIL_REMINDER_SENT, { email })

      setTimeout(() => {
        closeBanner()
      }, 2000)
    } catch (error) {
      console.error("Failed to send email:", error)
      setError("Failed to send email. Please try again.")
    }
  }

  const showHandoffSteps = () => {
    alert(
      "To use Handoff:\n1. Make sure both devices are signed in to iCloud\n2. Enable Handoff on your Mac and iPhone\n3. Your Mac should appear in the app switcher on your iPhone"
    )
    track(ANALYTICS_EVENTS.IOS_HANDOFF_STEPS_SHOWN)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-3 shadow-xl z-50 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              🚀 Now using O3-mini-high! Get the Mac app for the best experience
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {emailSent ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-sm"
              >
                ✓ Download link sent!
              </motion.p>
            ) : showEmailInput ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all w-48"
                />
                <Button
                  onClick={sendEmailReminder}
                  size="sm"
                  className="bg-white hover:bg-white/90 text-blue-600"
                >
                  Send Link
                </Button>
              </motion.div>
            ) : (
              <>
                <Button
                  onClick={sendEmailReminder}
                  size="sm"
                  className="bg-white hover:bg-white/90 text-blue-600"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Get Download Link
                </Button>
                <button
                  onClick={closeBanner}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        {error && (
          <p className="text-red-200 text-xs mt-1 text-center">{error}</p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
