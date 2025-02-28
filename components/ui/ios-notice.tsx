"use client"
import { Mail, X } from "lucide-react"
import { useState } from "react"
import { Button } from "./button"

import { AnimatePresence, motion } from "framer-motion"

export function IOSNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")

  const closeBanner = () => {
    setIsVisible(false)
    localStorage.setItem("hasShownIOSNotice", "true")
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

      setTimeout(() => {
        closeBanner()
      }, 2000)
    } catch (error) {
      console.error("Failed to send email:", error)
      setError("Failed to send email. Please try again.")
    }
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
              🚀 Now using claude-3.7! Get the Mac app for the best experience
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
