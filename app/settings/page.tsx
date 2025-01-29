"use client"

import { PaymentMethodModal } from "@/components/PaymentMethodModal"
import Navbar from "@/components/sections/Navbar"
import { AccountDetails } from "@/components/settings/account-details"
import { Sidebar } from "@/components/settings/sidebar"
import { UserHeader } from "@/components/settings/user-header"
import { SubscriptionActionModal } from "@/components/SubscriptionActionModal"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/lib/hooks/use-user"
import { supabase } from "@/lib/supabase/client"
import { getCardBrandIcon } from "@/lib/utils"
import { Lock, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  isDefault?: boolean
}

async function fetchSubscription(userId: string | undefined) {
  if (!userId) return null
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()
  return data
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { user, isSubscribed, loading } = useUser()
  const queryClient = useQueryClient()
  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => fetchSubscription(user?.id),
    enabled: !!user?.id
  })
  const router = useRouter()

  // Billing state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [cancelLoading, setCancelLoading] = useState(false)
  const [renewLoading, setRenewLoading] = useState(false)
  const [purchaseCreditsLoading, setPurchaseCreditsLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)

  const [subscriptionAction, setSubscriptionAction] = useState<
    "cancel" | "resume"
  >("cancel")

  async function loadPaymentMethods() {
    if (!subscription?.stripe_customer_id) return

    try {
      const response = await fetch("/api/stripe/get-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Filter out duplicate payment methods
        const uniqueMethods =
          data.paymentMethods?.reduce(
            (acc: PaymentMethod[], curr: PaymentMethod) => {
              const isDuplicate = acc.some(
                (method) =>
                  method.last4 === curr.last4 &&
                  method.exp_month === curr.exp_month &&
                  method.exp_year === curr.exp_year
              )
              if (!isDuplicate) {
                acc.push(curr)
              }
              return acc
            },
            []
          ) || []
        setPaymentMethods(uniqueMethods)
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    }
  }

  useEffect(() => {
    if (subscription?.stripe_customer_id) {
      loadPaymentMethods()
    }
  }, [subscription?.stripe_customer_id])

  const handleCancel = async () => {
    if (!subscription) return

    try {
      setCancelLoading(true)
      if (!user) {
        router.push("/signin")
        return
      }

      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription")
      }

      // Close the modal first
      setIsSubscriptionModalOpen(false)
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error("Failed to cancel subscription. Please try again.")
      }
    } finally {
      setCancelLoading(false)
    }
  }

  const handleRenew = async () => {
    if (!subscription) return

    try {
      setRenewLoading(true)
      if (!user) {
        router.push("/signin")
        return
      }

      const response = await fetch("/api/stripe/renew-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      if (!response.ok) {
        throw new Error("Failed to renew subscription")
      }

      setIsSubscriptionModalOpen(false)
    } catch (error) {
      console.error("Error:", error)
      throw new Error("Failed to renew subscription. Please try again.")
    } finally {
      setRenewLoading(false)
    }
  }

  const handlePaymentMethodsChange = async () => {
    await loadPaymentMethods()
  }

  const handlePurchaseCredits = async () => {
    if (!subscription?.stripe_customer_id) return

    try {
      setPurchaseCreditsLoading(true)
      console.log(
        "Attempting purchase with customer ID:",
        subscription.stripe_customer_id
      )

      const response = await fetch("/api/stripe/purchase-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Purchase credits error:", data)
        throw new Error(data.error || "Failed to create checkout session")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Error:", error)
      throw error
    } finally {
      setPurchaseCreditsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12 lg:pt-28">
          <div className="flex lg:flex-row flex-col lg:gap-12 gap-8">
            {/* Sidebar skeleton */}
            <div className="lg:w-64 w-full">
              <div className="space-y-2">
                <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 lg:max-w-2xl w-full space-y-8">
              {/* User header skeleton */}
              <div className="space-y-4">
                <div className="h-12 w-48 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-72 bg-white/5 rounded-lg animate-pulse" />
              </div>

              {/* Content sections skeleton */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-[200px] bg-white/5 rounded-xl border border-gray-800 animate-pulse" />
                </div>

                <div className="space-y-4">
                  <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-[150px] bg-white/5 rounded-xl border border-gray-800 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="flex lg:flex-row flex-col lg:gap-12 gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 lg:max-w-2xl w-full">
            {activeTab === "account" && (
              <>
                <UserHeader user={user} />
                <div className="space-y-8 lg:space-y-10">
                  {subscription?.status === "active" &&
                    subscription?.plan === "pro" && (
                      <section>
                        <h2 className="text-xl lg:text-2xl font-medium mb-3 lg:mb-4">
                          Credits
                        </h2>
                        <p className="text-[13px] lg:text-[15px] text-gray-400 mb-4 lg:mb-6">
                          Purchase additional credits to use Interview Coder.
                        </p>
                        <div className="bg-white/5 rounded-xl border border-gray-800">
                          <div className="p-4 lg:p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <h3 className="text-base lg:text-lg font-medium">
                                  Available Credits
                                </h3>
                                <p className="text-3xl font-bold mt-2">
                                  {subscription?.credits || 0}
                                </p>
                                <p className="text-[13px] lg:text-sm text-gray-400 mt-1">
                                  Credits reset to 50 at the start of each
                                  billing cycle
                                </p>
                              </div>
                              <Button
                                onClick={handlePurchaseCredits}
                                disabled={purchaseCreditsLoading}
                                className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                              >
                                {purchaseCreditsLoading ? (
                                  "Processing..."
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Purchase 50 Credits ($10)
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                  {subscription?.status === "active" &&
                    subscription?.plan === "pro" && (
                      <section>
                        <h2 className="text-xl lg:text-2xl font-medium mb-3 lg:mb-4">
                          Language Settings
                        </h2>
                        <p className="text-[13px] lg:text-[15px] text-gray-400 mb-4 lg:mb-6">
                          Choose your preferred programming language for code
                          generation.
                        </p>
                        <div className="bg-white/5 rounded-xl border border-gray-800">
                          <div className="p-4 lg:p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <h3 className="text-base lg:text-lg font-medium">
                                  Current Language
                                </h3>

                                <select
                                  className="mt-2 w-full max-w-xs bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={
                                    subscription?.preferred_language || "python"
                                  }
                                  onChange={async (e) => {
                                    try {
                                      await supabase
                                        .from("subscriptions")
                                        .update({
                                          preferred_language: e.target.value
                                        })
                                        .eq("user_id", user?.id)
                                      // Invalidate both queries to ensure UI updates
                                      queryClient.invalidateQueries({
                                        queryKey: ["subscription", user?.id]
                                      })
                                      queryClient.invalidateQueries({
                                        queryKey: ["user"]
                                      })
                                    } catch (error) {
                                      console.error(
                                        "Error updating language:",
                                        error
                                      )
                                    }
                                  }}
                                >
                                  <option value="python">Python</option>
                                  <option value="javascript">JavaScript</option>
                                  <option value="java">Java</option>
                                  <option value="golang">Golang</option>
                                </select>
                                <p className="text-[13px] lg:text-sm text-gray-400 mt-2">
                                  This will be used as the default language for
                                  your code generation
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  <AccountDetails user={user} />
                </div>
              </>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6 lg:space-y-8">
                <section>
                  <h2 className="text-xl lg:text-2xl font-medium mb-3 lg:mb-4">
                    Subscription Plan
                  </h2>
                  {subscription ? (
                    <>
                      <p className="text-[13px] lg:text-[15px] text-gray-400 mb-4 lg:mb-6">
                        Manage your subscription and billing details.
                      </p>
                      <div className="bg-white/5 rounded-xl border border-gray-800">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                              <h3 className="text-base lg:text-lg font-medium">
                                {subscription.plan.toUpperCase()}
                              </h3>
                              <p className="text-[13px] lg:text-sm text-gray-400 mt-1">
                                {subscription.status === "active" &&
                                !subscription.cancel_at
                                  ? "Active subscription"
                                  : subscription.status === "active" &&
                                    subscription.cancel_at
                                  ? `Cancels on ${new Date(
                                      subscription.cancel_at
                                    ).toLocaleDateString()}`
                                  : "Subscription ended"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3">
                              <span
                                className={`px-2 lg:px-2.5 py-0.5 text-[12px] lg:text-xs font-medium rounded-full ${
                                  subscription.status === "canceled"
                                    ? "bg-red-500/10 text-red-400"
                                    : subscription.status === "active" &&
                                      subscription.cancel_at
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : subscription.status === "active"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-gray-500/10 text-gray-400"
                                }`}
                              >
                                {subscription.status === "canceled"
                                  ? "Canceled"
                                  : subscription.status === "active" &&
                                    subscription.cancel_at
                                  ? "Canceling"
                                  : subscription.plan.toUpperCase()}
                              </span>
                              <button
                                onClick={() => {
                                  setSubscriptionAction(
                                    subscription.cancel_at ? "resume" : "cancel"
                                  )
                                  setIsSubscriptionModalOpen(true)
                                }}
                                disabled={cancelLoading || renewLoading}
                                className={`text-[12px] lg:text-sm font-medium px-2.5 lg:px-3 py-1 rounded-full transition-colors ${
                                  subscription.cancel_at
                                    ? "text-emerald-400 hover:bg-emerald-500/10"
                                    : "text-red-400 hover:bg-red-500/10"
                                }`}
                              >
                                {cancelLoading
                                  ? "Processing..."
                                  : renewLoading
                                  ? "Processing..."
                                  : subscription.cancel_at
                                  ? "Resume subscription"
                                  : "Cancel subscription"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {subscription.status === "active" && (
                          <div className="border-t border-gray-800 p-4 lg:p-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[12px] lg:text-[13px] text-[#8F8F8F] mb-1">
                                  Current billing cycle (
                                  {new Date(
                                    subscription.current_period_start
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit"
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    subscription.current_period_end
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit"
                                  })}
                                  )
                                </p>
                                <Progress
                                  value={Math.ceil(
                                    ((new Date().getTime() -
                                      new Date(
                                        subscription.current_period_start
                                      ).getTime()) /
                                      (new Date(
                                        subscription.current_period_end
                                      ).getTime() -
                                        new Date(
                                          subscription.current_period_start
                                        ).getTime())) *
                                      100
                                  )}
                                  className="h-1 bg-white/[0.06] [&>div]:bg-[#45FF88]"
                                />
                                <p className="text-[12px] lg:text-[13px] text-[#8F8F8F] mt-1">
                                  {Math.ceil(
                                    (new Date(
                                      subscription.current_period_end
                                    ).getTime() -
                                      new Date().getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days remaining
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {subscription.cancel_at && (
                          <div className="border-t border-gray-800 bg-yellow-500/5 p-4 lg:p-6">
                            <div className="flex gap-3">
                              <div className="shrink-0 p-1">
                                <svg
                                  className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-[12px] lg:text-sm text-yellow-400">
                                  Your subscription will end on{" "}
                                  {new Date(
                                    subscription.cancel_at
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-[12px] lg:text-sm text-yellow-400/70 mt-1">
                                  You'll have full access to all features until
                                  then.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] lg:text-[15px] text-gray-400 mb-4 lg:mb-6">
                        Choose a plan to access all features.
                      </p>
                      <div className="bg-white/5 rounded-xl border border-gray-800 p-4 lg:p-6">
                        <div className="text-center">
                          <h3 className="text-base lg:text-lg font-medium">
                            No Active Subscription
                          </h3>
                          <p className="text-[13px] lg:text-[15px] text-gray-400 mt-2 mb-4 lg:mb-6">
                            Subscribe now to get access to all features
                          </p>

                          <Button
                            onClick={() => router.push("/checkout")}
                            className="bg-black hover:bg-black/90 text-primary border border-primary transition-all px-5 py-2 text-sm font-semibold h-9 mx-auto"
                          >
                            <Lock className="w-4 h-4 mr-2 text-primary" />
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </section>

                {subscription && (
                  <section>
                    <h2 className="text-xl lg:text-2xl font-medium mb-3 lg:mb-4">
                      Payment Methods
                    </h2>
                    <p className="text-[13px] lg:text-[15px] text-gray-400 mb-4 lg:mb-6">
                      Payments for your subscription are made using the default
                      card.
                    </p>
                    <div className="bg-white/5 rounded-xl border border-gray-800">
                      {paymentMethods.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className="flex items-center justify-between p-4 lg:p-6"
                            >
                              <div className="flex items-center gap-4 lg:gap-6">
                                <div className="w-10 h-7 lg:w-12 lg:h-8 flex items-center">
                                  {getCardBrandIcon(method.brand)}
                                </div>
                                <div>
                                  <div className="text-[13px] lg:text-sm">
                                    •••• •••• •••• {method.last4}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[13px] lg:text-sm text-gray-400">
                                      Expires:
                                    </span>
                                    <span className="text-[13px] lg:text-sm">
                                      {method.exp_month
                                        .toString()
                                        .padStart(2, "0")}
                                      /{method.exp_year}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {method.isDefault && (
                                  <span className="px-2 lg:px-2.5 py-0.5 text-[12px] lg:text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                                    Default
                                  </span>
                                )}
                                <button
                                  onClick={() => setIsPaymentModalOpen(true)}
                                  className="p-1.5 lg:p-2 hover:bg-gray-800 rounded-md transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 lg:p-6">
                          <p className="text-[13px] lg:text-sm text-gray-400">
                            No payment methods found.
                          </p>
                        </div>
                      )}
                      <div className="border-t border-gray-800 p-4 lg:p-6">
                        <button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="inline-flex items-center gap-2 text-[13px] lg:text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-4 h-4 lg:w-5 lg:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add new card
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SubscriptionActionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        action={subscriptionAction}
        onConfirm={subscriptionAction === "cancel" ? handleCancel : handleRenew}
        loading={subscriptionAction === "cancel" ? cancelLoading : renewLoading}
      />

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerId={subscription?.stripe_customer_id}
        paymentMethods={paymentMethods}
        onPaymentMethodsChange={handlePaymentMethodsChange}
      />
    </div>
  )
}
