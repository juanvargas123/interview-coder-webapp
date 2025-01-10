import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.user.id
    const email = session.user.email

    // Get or create customer
    let customerId: string
    const customers = await stripe.customers.list({
      email: email
    })

    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId
        }
      })
      customerId = customer.id
    }

    // Create a Checkout Session for setting up a payment method
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      customer: customerId,
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/settings?setup_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/settings?setup_canceled=true`
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to create setup session" },
      { status: 500 }
    )
  }
}
