import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
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

    console.log(`Donation received: $${amount} | donor: ${meta.donorName || "anonymous"}`);

    try {
      // Record donation in DB
      if (meta.userId && meta.reportId) {
        await prisma.donation.create({
          data: {
            userId: meta.userId,
            reportId: meta.reportId,
            amount,
            currency: session.currency || "usd",
            paymentMethod: "STRIPE",
            stripePaymentId: session.payment_intent as string,
            status: "CONFIRMED",
            isAnonymous: meta.anonymous === "true",
            donorMessage: meta.message || null,
          },
        });

        // Update Report.raisedAmount
        await prisma.report.update({
          where: { id: meta.reportId },
          data: { raisedAmount: { increment: amount } },
        });
      }
    } catch (err) {
      console.error("Failed to record donation:", err);
    }
  }

  return NextResponse.json({ received: true });
}
