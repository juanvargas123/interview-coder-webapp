"use client"

import { useState } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/sections/Navbar"
import Image from "next/image"

const LoadingView = () => (
  <div className="space-y-4 sm:space-y-6 bg-white/5 backdrop-blur-xl rounded-[20px] p-6 sm:p-8 border border-white/10">
    <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded animate-pulse" />
      <div className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
    </div>
  </div>
)

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const { user, loading, isOnWaitlist, joinWaitlist } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const result = await joinWaitlist(user?.email || email)
      if (!result.success) {
        setError(result.message)
      } else if (result.message === "You're already on the waitlist!") {
        setShowSuccess(true)
      } else {
        setShowSuccess(true)
      }
    } catch (err) {
      console.error("Failed to join waitlist:", err)
      setError(err instanceof Error ? err.message : "Failed to join waitlist")
    }
  }

  const renderSuccessView = () => (
    <div className="space-y-4 sm:space-y-6 bg-white/5 backdrop-blur-xl rounded-[20px] p-6 sm:p-8 border border-white/10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
        Thanks for joining!
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-400">
        We&apos;ll be in touch as soon as Interview Coder is ready for Windows.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 pt-16 lg:pt-0">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left column - Content */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Interview Coder for Windows
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-400">
                  Join the waitlist to get notified when Interview Coder is
                  available for Windows.
                </p>
              </div>

              <div className="mt-8 sm:mt-12">
                {loading ? (
                  <LoadingView />
                ) : isOnWaitlist || showSuccess ? (
                  renderSuccessView()
                ) : (
                  <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!user && (
                        <div className="relative">
                          <div className="absolute -inset-0.5 bg-[#FFFF00]/20 rounded-[16px] blur-[8px]" />
                          <Input
                            type="email"
                            placeholder="Email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="relative h-11 sm:h-12 bg-black/50 border-[#FFFF00]/50 text-[#FFFF00] placeholder-[#FFFF00]/50 text-sm sm:text-base rounded-[14px] focus:ring-[#FFFF00] focus:border-[#FFFF00] transition-all"
                            style={{
                              textShadow: "0 0 10px rgba(255, 255, 0, 0.5)"
                            }}
                          />
                        </div>
                      )}
                      {error && (
                        <div className="text-sm text-red-500">{error}</div>
                      )}
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-[#FFFF00]/30 rounded-[16px] blur-[8px]" />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="relative w-full h-11 sm:h-12 bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black text-sm sm:text-base font-medium rounded-[14px] transition-all"
                          style={{
                            boxShadow: "0 0 20px rgba(255, 255, 0, 0.3)"
                          }}
                        >
                          {loading ? "Joining..." : "Join waitlist"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Windows Image */}
            <div className="order-first lg:order-last relative h-[250px] sm:h-[350px] lg:h-auto flex items-center justify-center">
              {/* Yellow misty background effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-[#FFFF00]/20 blur-[100px] " />
                <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full bg-[#FFFF00]/10 blur-[80px]  delay-75" />
                <div className="absolute w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full bg-[#FFFF00]/5 blur-[60px]  delay-150" />
              </div>

              {/* Windows logo */}
              <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px]">
                <Image
                  src="/windows_yellow.png"
                  alt="Windows Logo"
                  width={260}
                  height={260}
                  className="object-contain w-full h-full opacity-80"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
