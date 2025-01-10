import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  console.log("Webhook received:", body)

  // Test Supabase connection with admin client
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("subscriptions").select("*")
  console.log("Supabase test:", { data, error })

  const headersList = await headers()
  const signature = headersList.get("stripe-signature") || ""
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  console.log("Webhook secret:", webhookSecret)
  console.log("Signature:", signature)

  let event: Stripe.Event

  try {
    if (!webhookSecret) {
      console.log("No webhook secret found!")
      return
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log("Event constructed:", event.type)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (relevantEvents.has(event.type)) {
    try {
      const supabase = createAdminClient()
      console.log("Processing event:", event.type)

      switch (event.type) {
        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          console.log("Checkout session:", checkoutSession)

          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription as string
            console.log("Subscription ID:", subscriptionId)

            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            )
            console.log("Retrieved subscription:", subscription)

            const userId = checkoutSession.client_reference_id
            console.log("User ID:", userId)

            const result = await supabase.from("subscriptions").upsert(
              {
                user_id: userId,
                stripe_customer_id: checkoutSession.customer as string,
                stripe_subscription_id: subscriptionId,
                status: subscription.status,
                plan: subscription.items.data[0].price.lookup_key || "default",
                current_period_start: new Date(
                  subscription.current_period_start * 1000
                ),
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ),
                cancel_at: subscription.cancel_at
                  ? new Date(subscription.cancel_at * 1000)
                  : null,
                canceled_at: subscription.canceled_at
                  ? new Date(subscription.canceled_at * 1000)
                  : null
              },
              {
                onConflict: "stripe_subscription_id"
              }
            )
            console.log("Supabase insert result:", result)
          }
          break
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription
          await supabase.from("subscriptions").upsert(
            {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              plan: subscription.items.data[0].price.lookup_key || "default",
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ),
              cancel_at: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000)
                : null,
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000)
                : null
            },
            {
              onConflict: "stripe_subscription_id"
            }
          )
          break
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription
          await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              canceled_at: new Date(subscription.canceled_at! * 1000),
              cancel_at: new Date(subscription.cancel_at! * 1000)
            })
            .eq("stripe_subscription_id", subscription.id)
          break
        }

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: "Webhook handler failed." },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
