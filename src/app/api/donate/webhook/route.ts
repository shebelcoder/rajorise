import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// import { prisma } from "@/lib/prisma"; // Uncomment when DB is configured

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = (session.amount_total || 0) / 100;
    const meta = session.metadata || {};

    console.log(`✅ Donation received: $${amount} | category: ${meta.category} | donor: ${meta.donorName || "anonymous"}`);

    // TODO: Record in DB once Prisma is configured
    // await prisma.donation.create({
    //   data: {
    //     amount,
    //     currency: session.currency || "usd",
    //     stripePaymentId: session.payment_intent as string,
    //     donorEmail: session.customer_email,
    //     donorName: meta.donorName || null,
    //     isAnonymous: meta.anonymous === "true",
    //     message: meta.message || null,
    //     sponsorshipId: meta.sponsorshipId || null,
    //   },
    // });
  }

  return NextResponse.json({ received: true });
}
