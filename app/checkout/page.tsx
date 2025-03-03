"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/sections/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createClientComponentClient,
  Session
} from "@supabase/auth-helpers-nextjs"
import { useUser } from "@/lib/hooks/use-user"

function CheckoutPageContent() {
  const { user, loading: userLoading, isSubscribed } = useUser()
  const router = useRouter()
  const [tokenData, setTokenData] = useState<{ user_id: string } | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [validCoupon, setValidCoupon] = useState<{
    id: string
    percent_off?: number | null
    amount_off?: number | null
  } | null>(null)
  
  // Add subscription type state
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annual'>('monthly')
  
  // Define prices for both subscription types
  const prices = {
    monthly: 60.0,
    annual: 300.0 // 12 months at $60 would be $720, so this is ~$121 savings
  }
  
  // Set initial total based on subscription type
  const [total, setTotal] = useState(prices.monthly)
  
  // Update total when subscription type changes
  useEffect(() => {
    // Reset the total when switching plans
    if (subscriptionType === 'monthly') {
      setTotal(prices.monthly)
    } else {
      setTotal(prices.annual)
    }
    
    // Reapply coupon if one is active
    if (validCoupon) {
      if (validCoupon.percent_off) {
        setTotal(prices[subscriptionType] * (1 - validCoupon.percent_off / 100))
      } else if (validCoupon.amount_off) {
        setTotal(Math.max(0, prices[subscriptionType] - validCoupon.amount_off / 100))
      }
    }
  }, [subscriptionType, validCoupon])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for session changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function validateToken() {
      setIsValidatingToken(true)
      try {
        const token = searchParams.get("token")
        if (!token) {
          setIsValidatingToken(false)
          return
        }

        // First check if we already have a valid session
        const {
          data: { session }
        } = await supabase.auth.getSession()

        const { data, error } = await supabase
          .from("auth_tokens")
          .select("user_id, used, expires_at")
          .eq("token", token)
          .single()

        if (error || !data) {
          throw new Error("Invalid token")
        }

        if (data.used) {
          throw new Error("Token has already been used")
        }

        if (new Date(data.expires_at) < new Date()) {
          throw new Error("Token has expired")
        }

        setTokenData(data)

        // If user is already authenticated with the correct account
        if (session?.user?.id === data.user_id) {
          // Mark token as used
          const response = await fetch("/api/auth/update-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
          })

          if (!response.ok) {
            throw new Error("Failed to process checkout link")
          }
          return
        }
      } catch (error) {
        console.error("Token error:", error)
        if (error instanceof Error) {
          if (error.message === "Invalid token") {
            setAuthError(
              "Invalid checkout link. Please try again or contact support."
            )
          } else if (error.message === "Token has already been used") {
            setAuthError(
              "This checkout link has already been used. Please request a new one."
            )
          } else if (error.message === "Token has expired") {
            setAuthError(
              "This checkout link has expired. Please request a new one."
            )
          } else {
            setAuthError(
              "Something went wrong. Please try again or contact support."
            )
          }
        } else {
          setAuthError(
            "Something went wrong. Please try again or contact support."
          )
        }
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [searchParams, supabase])

  // Add this before other UI state checks
  if (!userLoading && !user && !searchParams.get("token")) {
    router.push("/signin")
    return null
  }

  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl mb-4">Validating your checkout link...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl mb-4 text-red-400">{authError}</h2>
            <Button
              onClick={() => router.push("/signin")}
              className="flex items-center gap-2"
            >
              Return to Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show sign in button if token is valid but user isn't authenticated
  if (tokenData && (!session || session.user.id !== tokenData.user_id)) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl mb-4">
              Please sign in to continue checkout
            </h2>
            <Button
              onClick={() => router.push("/signin")}
              className="flex items-center gap-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
        setTotal(prices[subscriptionType])
        return
      }

      setValidCoupon(data.coupon)
      setCouponError("")

      // Calculate new total based on current subscription type
      if (data.coupon.percent_off) {
        setTotal(prices[subscriptionType] * (1 - data.coupon.percent_off / 100))
      } else if (data.coupon.amount_off) {
        setTotal(Math.max(0, prices[subscriptionType] - data.coupon.amount_off / 100))
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
          couponId: validCoupon?.id,
          subscriptionType: subscriptionType
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
      <Navbar showBanner={false} />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h2 className="text-base lg:text-lg font-medium text-[#999999] mb-2">
            Subscribe to Interview Coder
          </h2>
          <div className="text-4xl lg:text-5xl font-bold mb-6">
            Choose your plan
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly subscription card */}
          <div className="bg-[#111111] border border-primary rounded-xl p-6">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Monthly</h3>
                    <p className="text-gray-400 text-sm mt-1">Billed monthly</p>
                  </div>
                  <div className="text-2xl font-bold">$60<span className="text-sm font-normal text-gray-400">/month</span></div>
                </div>
              </div>

              <div className="space-y-4 mb-6 mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm lg:text-base">Subscription</span>
                  <div className="text-right">
                    <div className="text-sm lg:text-base text-white">$60/month</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base">Subtotal</span>
                  <span className="text-sm lg:text-base">$60.00</span>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base">Tax</span>
                  <span className="text-sm lg:text-base">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base font-medium">Total due today</span>
                  <span className="text-sm lg:text-base font-medium">$60.00</span>
                </div>
              </div>

              {/* Coupon section */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={subscriptionType === 'monthly' ? couponCode : ''}
                    onChange={(e) => {
                      setSubscriptionType('monthly');
                      setCouponCode(e.target.value.trim());
                    }}
                    placeholder="Have a coupon code?"
                    className="bg-black/50 border-gray-800 rounded-md h-[40px] text-sm lg:text-base placeholder:text-gray-500"
                  />
                  <Button
                    onClick={() => {
                      setSubscriptionType('monthly');
                      validateCoupon();
                    }}
                    disabled={loading || !(subscriptionType === 'monthly' && couponCode)}
                    variant="outline"
                    className="whitespace-nowrap text-sm lg:text-base h-[40px]"
                  >
                    Apply
                  </Button>
                </div>
                {subscriptionType === 'monthly' && couponError && (
                  <p className="text-red-400 text-xs lg:text-sm mt-2">
                    {couponError}
                  </p>
                )}
                {subscriptionType === 'monthly' && validCoupon && (
                  <p className="text-emerald-400 text-xs lg:text-sm mt-2">
                    Coupon applied successfully!
                  </p>
                )}
              </div>

              <Button
                onClick={() => {
                  setSubscriptionType('monthly');
                  handleCheckout();
                }}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black px-4 py-3 text-sm lg:text-base font-semibold disabled:opacity-50 rounded-md mt-auto"
              >
                {subscriptionType === 'monthly' && loading ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          </div>

          {/* Annual subscription card */}
          <div className="bg-[#111111] border border-primary rounded-xl p-6">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Annual
                      <span className="ml-2 text-xs bg-primary/30 text-primary px-2 py-1 rounded-full inline-block shadow-[0_0_10px_rgba(255,255,0,0.3)]">
                        Save ~$420
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Billed yearly</p>
                  </div>
                  <div className="text-2xl font-bold">$300<span className="text-sm font-normal text-gray-400">/year</span></div>
                </div>
              </div>

              <div className="space-y-4 mb-6 mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm lg:text-base">Subscription</span>
                  <div className="text-right">
                    <div className="text-sm lg:text-base text-white">$300/year</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base">Subtotal</span>
                  <span className="text-sm lg:text-base">$300.00</span>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base">Tax</span>
                  <span className="text-sm lg:text-base">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-sm lg:text-base font-medium">Total due today</span>
                  <span className="text-sm lg:text-base font-medium">$300.00</span>
                </div>
              </div>

              {/* Coupon section */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={subscriptionType === 'annual' ? couponCode : ''}
                    onChange={(e) => {
                      setSubscriptionType('annual');
                      setCouponCode(e.target.value.trim());
                    }}
                    placeholder="Have a coupon code?"
                    className="bg-black/50 border-gray-800 rounded-md h-[40px] text-sm lg:text-base placeholder:text-gray-500"
                  />
                  <Button
                    onClick={() => {
                      setSubscriptionType('annual');
                      validateCoupon();
                    }}
                    disabled={loading || !(subscriptionType === 'annual' && couponCode)}
                    variant="outline"
                    className="whitespace-nowrap text-sm lg:text-base h-[40px]"
                  >
                    Apply
                  </Button>
                </div>
                {subscriptionType === 'annual' && couponError && (
                  <p className="text-red-400 text-xs lg:text-sm mt-2">
                    {couponError}
                  </p>
                )}
                {subscriptionType === 'annual' && validCoupon && (
                  <p className="text-emerald-400 text-xs lg:text-sm mt-2">
                    Coupon applied successfully!
                  </p>
                )}
              </div>

              <Button
                onClick={() => {
                  setSubscriptionType('annual');
                  handleCheckout();
                }}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black px-4 py-3 text-sm lg:text-base font-semibold disabled:opacity-50 rounded-md mt-auto"
              >
                {subscriptionType === 'annual' && loading ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-4">
              <h2 className="text-xl mb-4">Loading checkout...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  )
}
