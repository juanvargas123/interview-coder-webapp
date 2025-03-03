import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const { couponId } = await req.json()
    const supabase = createClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.user.id
    const email = session.user.email

    if (!process.env.STRIPE_PRICE_ID) {
      console.error("Missing STRIPE_PRICE_ID environment variable")
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_WEBSITE_URL) {
      console.error("Missing NEXT_PUBLIC_WEBSITE_URL environment variable")
      return NextResponse.json(
        { error: "Website configuration error" },
        { status: 500 }
      )
    }

    // Get First Promoter tracking ID from cookies
    let fpTid: string | undefined;
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
      const fpCookie = cookies.find(cookie => cookie.startsWith('_fprom_tid='));
      if (fpCookie) {
        fpTid = fpCookie.split('=')[1];
        console.log('Found First Promoter tracking ID:', fpTid); // Debug log
      } else {
        console.log('First Promoter tracking ID cookie not found'); // Debug log
        console.log('Available cookies:', cookies); // Debug all cookies
      }
    }

    // Get or create customer
    let customerId: string
    try {
      const customers = await stripe.customers.list({
        email: email
      })

      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: email,
          metadata: {
            userId: userId,
            // Add First Promoter tracking ID to customer metadata
            ...(fpTid ? { fp_tid: fpTid } : {})
          }
        })
        customerId = customer.id
      }
    } catch (error) {
      console.error("Error managing Stripe customer:", error)
      return NextResponse.json(
        { error: "Failed to manage customer information" },
        { status: 500 }
      )
    }

    // If there's a coupon, validate it first
    if (couponId) {
      try {
        const coupon = await stripe.coupons.retrieve(couponId)
        // Check if the coupon is valid for the current price
        if (coupon.applies_to?.products?.length) {
          const price = await stripe.prices.retrieve(
            process.env.STRIPE_PRICE_ID
          )
          if (!coupon.applies_to.products.includes(price.product as string)) {
            return NextResponse.json(
              { error: "This coupon cannot be applied to the current plan" },
              { status: 400 }
            )
          }
        }
      } catch (error) {
        console.error("Error validating coupon:", error)
        return NextResponse.json(
          { error: "Invalid or expired coupon" },
          { status: 400 }
        )
      }
    }

    // Create Stripe checkout session
    try {
      // Debug log before creating checkout session
      console.log('Creating checkout session with metadata:', {
        user_id: userId,
        fp_tid: fpTid
      });
      
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: userId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1
          }
        ],
        ...(couponId
          ? { discounts: [{ coupon: couponId }] }
          : { allow_promotion_codes: true }),
        success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
        // Add First Promoter tracking ID to metadata using the correct field name
        metadata: {
          user_id: userId,
          ...(fpTid ? { fp_tid: fpTid } : {})
        }
      })

      return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error)
      if (error instanceof Stripe.errors.StripeError) {
        // Handle specific Stripe errors
        if (error.code === "coupon_invalid") {
          return NextResponse.json(
            {
              error:
                "The coupon is invalid or cannot be applied to this purchase"
            },
            { status: 400 }
          )
        }
      }
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Unexpected error in create-checkout:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
