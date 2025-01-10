import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json()

    // Verify the user exists and is authenticated
    const supabase = createAdminClient()
    const { data: user, error } = await supabase.auth.admin.getUserById(userId)

    if (error || !user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, status")
      .eq("user_id", userId)
      .single()

    let customerId = existingSubscription?.stripe_customer_id

    // If no customer ID exists, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          user_id: userId
        }
      })
      customerId = customer.id
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/billing?canceled=true`,
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          user_id: userId
        }
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ]
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
