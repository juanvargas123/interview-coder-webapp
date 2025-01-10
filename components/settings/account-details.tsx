"use client"

import { useState } from "react"
import { Lock, Unlock, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { ExtendedUser } from "@/lib/hooks/use-user"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface AccountDetailsProps {
  user: ExtendedUser | null
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState("")
  const router = useRouter()

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        if (error.message.includes("different from the old password")) {
          setError("New password must be different from your current password")
          return
        }
        throw error
      }

      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
    } catch (error) {
      console.error("Error updating password:", error)
      setError("Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      if (data.success) {
        await supabase.auth.signOut()
        router.push("/")
      }
    } catch (error: any) {
      console.error("Error deleting account:", error)
      setError(error?.message || "Failed to delete account. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Account Details</h3>
        {showPasswordForm && newPassword && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPasswordForm(false)}
              className="px-4 py-2 text-[15px] text-[#989898] hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="px-4 py-2 bg-white text-black rounded-xl text-[15px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
      <div className="space-y-5">
        <div className="space-y-2.5">
          <label className="text-[15px] text-[#989898] font-medium">
            Email
          </label>
          <div className="px-4 py-3.5 bg-[#1A1A1A] rounded-xl text-white text-[15px]">
            {user?.email}
          </div>
        </div>

        {showPasswordForm ? (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <label className="text-[15px] text-[#989898] font-medium">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#1A1A1A] rounded-xl text-white text-[15px] border border-white/10 focus:border-white/20 focus:outline-none transition-colors"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[15px] text-[#989898] font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#1A1A1A] rounded-xl text-white text-[15px] border border-white/10 focus:border-white/20 focus:outline-none transition-colors"
                placeholder="Confirm new password"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={() => setShowPasswordForm(false)}
              className="flex items-center gap-2.5 text-[15px] text-[#989898] hover:text-white transition-colors font-medium"
            >
              <Unlock className="w-[18px] h-[18px] opacity-70" />
              Change Password
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="flex items-center gap-2.5 text-[15px] text-[#989898] hover:text-white transition-colors font-medium"
          >
            <Lock className="w-[18px] h-[18px] opacity-70" />
            Change Password
          </button>
        )}

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2.5 text-[15px] text-red-400 hover:text-red-300 transition-colors font-medium"
        >
          <Trash2 className="w-[18px] h-[18px] opacity-70" />
          Delete Account
        </button>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-[#0A0A0A] border border-white/[0.06] p-5 max-w-[340px] rounded-[16px] shadow-2xl overflow-hidden">
            <DialogTitle className="text-[18px] font-medium text-white text-center mb-1.5">
              Are you sure you want to delete your account?
            </DialogTitle>
            <p className="text-[#8F8F8F] text-center mb-4 text-[13px]">
              To confirm, please fill out the email of your account below:
            </p>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-3 py-2.5 bg-[#141414] rounded-[10px] text-[13px] border border-white/[0.06] focus:border-white/10 focus:outline-none transition-colors mb-4"
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setConfirmEmail("")
                }}
                className="flex-1 px-3 py-2 bg-[#141414] text-white rounded-[10px] text-[13px] font-medium border border-white/[0.06] hover:bg-[#1A1A1A] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmEmail !== user?.email || isLoading}
                className="flex-1 px-3 py-2 bg-[#1F1315] text-[#FF4545] rounded-[10px] text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#251618] transition-all border border-[#FF4545]/10"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-2.5">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
