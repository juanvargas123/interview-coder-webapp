import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { getCardBrandIcon } from "@/lib/utils"

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  paymentMethods: Array<{
    id: string
    brand: string
    last4: string
    exp_month: number
    exp_year: number
    isDefault?: boolean
  }>
  onPaymentMethodsChange: () => void
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  customerId,
  paymentMethods,
  onPaymentMethodsChange
}: PaymentMethodModalProps) {
  const [loading, setLoading] = useState(false)

  const handleAddCard = async () => {
    try {
      setLoading(true)
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )
      if (!stripe) throw new Error("Failed to load Stripe")

      // Create a Checkout Session for setup
      const response = await fetch("/api/stripe/setup-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to create setup session")
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to add payment method. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/stripe/set-default-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId,
          paymentMethodId
        })
      })

      if (!response.ok) {
        throw new Error("Failed to set default payment method")
      }

      onPaymentMethodsChange()
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to set default payment method. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (paymentMethodId: string) => {
    if (!confirm("Are you sure you want to remove this payment method?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/stripe/remove-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentMethodId
        })
      })

      if (!response.ok) {
        throw new Error("Failed to remove payment method")
      }

      onPaymentMethodsChange()
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to remove payment method. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border border-white/[0.06] p-4 lg:p-6 max-w-[900px] rounded-[16px] shadow-2xl overflow-hidden mx-4 lg:mx-0">
        <DialogHeader>
          <DialogTitle className="text-base lg:text-[18px] font-medium text-white mb-1.5">
            Payment Methods
          </DialogTitle>
          <DialogDescription className="text-[12px] lg:text-[13px] text-[#8F8F8F]">
            Manage your payment methods for subscription billing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 lg:p-6 bg-[#141414] border border-white/[0.06] rounded-[10px]"
            >
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-10 h-7 lg:w-12 lg:h-8 flex items-center">
                  {getCardBrandIcon(method.brand)}
                </div>
                <div>
                  <p className="text-[12px] lg:text-[13px] font-medium text-white">
                    {method.brand.charAt(0).toUpperCase() +
                      method.brand.slice(1)}{" "}
                    •••• {method.last4}
                  </p>
                  <p className="text-[12px] lg:text-[13px] text-[#8F8F8F]">
                    Expires {method.exp_month.toString().padStart(2, "0")}/
                    {method.exp_year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:gap-5">
                {!method.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      disabled={loading}
                      className="px-4 lg:px-5 py-1.5 text-[12px] lg:text-[13px] font-medium rounded-[8px] text-[#45FF88] hover:bg-[#152015] border border-[#45FF88]/10 disabled:opacity-50 transition-all whitespace-nowrap"
                    >
                      Make Default
                    </button>
                    <button
                      onClick={() => handleRemove(method.id)}
                      disabled={loading}
                      className="px-4 lg:px-5 py-1.5 text-[12px] lg:text-[13px] font-medium rounded-[8px] text-[#FF4545] hover:bg-[#1F1315] border border-[#FF4545]/10 disabled:opacity-50 transition-all"
                    >
                      Remove
                    </button>
                  </>
                )}
                {method.isDefault && (
                  <span className="px-4 lg:px-5 py-1 text-[12px] lg:text-[13px] font-medium bg-[#152015] text-[#45FF88] rounded-full border border-[#45FF88]/10">
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAddCard}
            disabled={loading}
            className="w-full px-4 py-3 text-[12px] lg:text-[13px] font-medium rounded-[10px] text-white bg-[#141414] border border-white/[0.06] hover:bg-[#1A1A1A] transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add New Card"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
