import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { useState } from "react"

interface SubscriptionActionModalProps {
  isOpen: boolean
  onClose: () => void
  action: "cancel" | "resume"
  onConfirm: () => Promise<void>
  loading: boolean
}

export function SubscriptionActionModal({
  isOpen,
  onClose,
  action,
  onConfirm,
  loading
}: SubscriptionActionModalProps) {
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setError(null)
      await onConfirm()
      window.location.reload() // Force a full page reload to ensure fresh data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden [&>*]:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {action === "cancel"
              ? "Cancel Subscription"
              : "Resume Subscription"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {action === "cancel"
              ? "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period."
              : "Would you like to resume your subscription? You'll be billed at the start of the next billing period."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              action === "cancel"
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading
              ? "Processing..."
              : action === "cancel"
              ? "Yes, cancel subscription"
              : "Yes, resume subscription"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
