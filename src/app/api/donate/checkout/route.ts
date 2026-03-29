import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizePlain } from "@/lib/sanitize";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

const checkoutSchema = z.object({
  amount: z.number().min(1, "Minimum donation is $1").max(100000),
  currency: z.string().length(3).default("usd"),
  category: z.string().max(50).default("general"),
  name: z.string().max(100).optional(),
  email: z.string().email().max(255).optional().or(z.literal("")),
  message: z.string().max(500).optional(),
  anonymous: z.boolean().default(false),
  reportId: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`checkout:${ip}`, { max: 10, windowSeconds: 60 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { amount, currency, category, name, email, message, anonymous, reportId } = parsed.data;
    const stripe = getStripe();

    const metadata: Record<string, string> = {
      category: sanitizePlain(category),
      anonymous: String(anonymous),
    };
    if (name && !anonymous) metadata.donorName = sanitizePlain(name);
    if (message) metadata.message = sanitizePlain(message);
    if (reportId) metadata.reportId = reportId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `RajoRise Donation – ${category === "general" ? "General Fund" : category.charAt(0).toUpperCase() + category.slice(1)}`,
              description: "Hope Into Life – Your donation changes lives directly.",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email && email.includes("@") ? email : undefined,
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe checkout error:", msg, error);

    // Return more specific error in non-production for debugging
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: `Checkout failed: ${msg}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
