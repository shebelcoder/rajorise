import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "usd", category = "general", name, email, message, anonymous, sponsorshipId } = body;

    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json({ error: "Invalid amount. Minimum is $1." }, { status: 400 });
    }

    const metadata: Record<string, string> = {
      category,
      anonymous: String(anonymous),
    };
    if (name && !anonymous) metadata.donorName = name;
    if (message) metadata.message = message;
    if (sponsorshipId) metadata.sponsorshipId = sponsorshipId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `RajoRise Donation – ${category === "general" ? "General Fund" : category.charAt(0).toUpperCase() + category.slice(1)}`,
              description: "Hope Into Life – Your donation changes lives directly.",
              images: [],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
