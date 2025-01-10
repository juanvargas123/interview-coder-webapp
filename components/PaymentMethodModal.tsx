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
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
      if (!stripe) throw new Error("Failed to load Stripe")

      // Create a Checkout Session for setup
      const response = await fetch("/api/stripe/setup-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId
        })
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
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Payment Methods
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your payment methods for subscription billing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 flex items-center">
                  {getCardBrandIcon(method.brand)}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {method.brand.charAt(0).toUpperCase() +
                      method.brand.slice(1)}{" "}
                    •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expires {method.exp_month.toString().padStart(2, "0")}/
                    {method.exp_year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      disabled={loading}
                      className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                    >
                      Make Default
                    </button>
                    <button
                      onClick={() => handleRemove(method.id)}
                      disabled={loading}
                      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                )}
                {method.isDefault && (
                  <span className="text-sm text-gray-400">Default</span>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAddCard}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Add New Card"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
