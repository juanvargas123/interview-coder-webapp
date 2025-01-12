"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/sections/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [validCoupon, setValidCoupon] = useState<{
    id: string
    percent_off?: number | null
    amount_off?: number | null
  } | null>(null)
  const [total, setTotal] = useState(20.0)
  const router = useRouter()

  const validateCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/stripe/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ couponCode })
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || "Invalid coupon code")
        setValidCoupon(null)
        setTotal(20.0)
        return
      }

      setValidCoupon(data.coupon)
      setCouponError("")

      // Calculate new total
      if (data.coupon.percent_off) {
        setTotal(20 * (1 - data.coupon.percent_off / 100))
      } else if (data.coupon.amount_off) {
        setTotal(Math.max(0, 20 - data.coupon.amount_off / 100))
      }
    } catch (error) {
      console.error("Error:", error)
      setCouponError("Failed to validate coupon")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          couponId: validCoupon?.id
        })
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
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-12  mx-4">
        <div className="space-y-8">
          {/* Pricing details */}
          <div>
            <div className="mb-8">
              <h2 className="text-base lg:text-lg font-medium text-[#999999] mb-2">
                Subscribe to Interview Coder
              </h2>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                $20 / month
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-sm lg:text-base">Subscription</span>
                <div className="text-right">
                  <div className="text-xs lg:text-sm text-[#999999]">
                    $20/month
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-sm lg:text-base">Subtotal</span>
                <span className="text-sm lg:text-base">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-sm lg:text-base">Tax</span>
                <span className="text-sm lg:text-base">$0.00</span>
              </div>
              {validCoupon && (
                <div className="flex justify-between items-center py-4 border-t border-white/10">
                  <span className="text-sm lg:text-base">Discount</span>
                  <div className="text-right text-emerald-400 text-sm lg:text-base">
                    {validCoupon.percent_off
                      ? `-${validCoupon.percent_off}%`
                      : validCoupon.amount_off
                      ? `-$${(validCoupon.amount_off / 100).toFixed(2)}`
                      : null}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-sm lg:text-base">Total due today</span>
                <span className="text-sm lg:text-base">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Coupon section */}
              <div className="py-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.trim())}
                    placeholder="Have a coupon code?"
                    className="bg-black/50 border-gray-800 rounded-full h-[50px] text-sm lg:text-base placeholder:text-gray-500"
                  />
                  <Button
                    onClick={validateCoupon}
                    disabled={loading || !couponCode}
                    variant="outline"
                    className="whitespace-nowrap text-sm lg:text-base"
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-400 text-xs lg:text-sm mt-2">
                    {couponError}
                  </p>
                )}
                {validCoupon && (
                  <p className="text-emerald-400 text-xs lg:text-sm mt-2">
                    Coupon applied successfully!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <div className="bg-transparent border border-gray-700 p-8 rounded-xl">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-black transition-all px-4 py-3 text-sm lg:text-base font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Subscribe with Stripe"}
            </Button>
            <p className="text-xs lg:text-sm text-gray-400 mt-4 text-center">
              You will be redirected to Stripe to complete your purchase
              securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
