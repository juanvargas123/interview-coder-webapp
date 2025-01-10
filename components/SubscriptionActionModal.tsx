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
      onClose() // Close the modal after successful confirmation
    } catch (err) {
      console.error("Error in handleConfirm:", err)
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
      // Don't close the modal on error
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border border-white/[0.06] p-4 lg:p-5 max-w-[425px] rounded-[16px] shadow-2xl overflow-hidden mx-4 lg:mx-0">
        <DialogHeader>
          <DialogTitle className="text-base lg:text-[18px] font-medium text-white mb-1.5">
            {action === "cancel"
              ? "Cancel Subscription"
              : "Resume Subscription"}
          </DialogTitle>
          <DialogDescription className="text-[12px] lg:text-[13px] text-[#8F8F8F]">
            {action === "cancel"
              ? "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period."
              : "Would you like to resume your subscription? You'll be billed at the start of the next billing period."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-[12px] lg:text-[13px]">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-1.5 mt-4">
          <button
            onClick={onClose}
            className="px-2.5 lg:px-3 py-1.5 text-[12px] lg:text-[13px] font-medium rounded-[10px] text-white bg-[#141414] border border-white/[0.06] hover:bg-[#1A1A1A] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-2.5 lg:px-3 py-1.5 text-[12px] lg:text-[13px] font-medium rounded-[10px] transition-all border ${
              action === "cancel"
                ? "bg-[#1F1315] text-[#FF4545] hover:bg-[#251618] border-[#FF4545]/10"
                : "bg-[#152015] text-[#45FF88] hover:bg-[#182518] border-[#45FF88]/10"
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
