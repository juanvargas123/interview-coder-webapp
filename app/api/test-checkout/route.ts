import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const TEST_USER_ID = "12345678-1234-1234-1234-123456789012" // Example UUID format

export async function GET() {
  try {
    // First, ensure we have a test user in Supabase
    const supabase = createAdminClient()

    // Create a test customer first
    const customer = await stripe.customers.create({
      email: "test@example.com",
      metadata: {
        user_id: TEST_USER_ID,
        test: "true"
      }
    })

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancel`,
      client_reference_id: TEST_USER_ID,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      subscription_data: {
        metadata: {
          user_id: TEST_USER_ID
        }
      },
      metadata: {
        user_id: TEST_USER_ID,
        test: "true"
      }
    })

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
