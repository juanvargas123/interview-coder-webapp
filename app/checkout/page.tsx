"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/sections/Navbar"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left side - Pricing details */}
          <div>
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[#999999] mb-2">
                Subscribe to Interview Coder
              </h2>
              <div className="text-5xl font-bold mb-2">$20 / month</div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span>Subscription</span>
                <div className="text-right">
                  <div className="text-sm text-[#999999]">$20/month</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span>Subtotal</span>
                <span>$20.00</span>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span>Tax</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span>Total</span>
                <span>$20.00</span>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span>Total due today</span>
                <span>$20.00</span>
              </div>
            </div>
          </div>

          {/* Right side - Checkout button */}
          <div className="bg-transparent border border-gray-700 p-8 rounded-xl">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-black transition-all px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Subscribe with Stripe"}
            </Button>
            <p className="text-sm text-gray-400 mt-4 text-center">
              You will be redirected to Stripe to complete your purchase
              securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
