"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import Navbar from "@/components/sections/Navbar"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings`
        }
      })

      if (submitError) {
        setError(submitError.message ?? "Something went wrong")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"],
          defaultValues: {
            billingDetails: {
              name: ""
            }
          }
        }}
      />
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-black transition-all px-4 py-3  text-sm font-semibold disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Subscribe"}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(console.error)
  }, [])

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

          {/* Right side - Payment form */}
          <div className="bg-transparent border border-gray-700 p-8 rounded-xl">
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night"
                  }
                }}
              >
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
