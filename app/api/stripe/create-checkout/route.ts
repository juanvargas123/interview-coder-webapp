import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    const supabase = createClient()

    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create or retrieve Stripe customer
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId
        }
      })
      customerId = customer.id
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ["card"],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId
        }
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/billing?canceled=true`
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
