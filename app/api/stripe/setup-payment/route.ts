import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json()

    // Create a Checkout Session for setting up a payment method
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      customer: customerId,
      success_url: `${req.headers.get("origin")}/billing?setup_success=true`,
      cancel_url: `${req.headers.get("origin")}/billing?setup_canceled=true`
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to create setup session" },
      { status: 500 }
    )
  }
}
