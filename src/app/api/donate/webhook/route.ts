import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
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

    console.log(`Donation received: $${amount} | donor: ${meta.donorName || "anonymous"} | userId: ${meta.userId || "none"} | reportId: ${meta.reportId || "general"}`);

    try {
      // Get or create userId for the donation record
      let userId = meta.userId;

      if (!userId) {
        // For anonymous/guest donations, find or create a system "guest" user
        const guestEmail = session.customer_email || "guest@rajorise.com";
        let guestUser = await prisma.user.findUnique({ where: { email: guestEmail } });
        if (!guestUser) {
          guestUser = await prisma.user.create({
            data: { email: guestEmail, name: meta.donorName || "Guest Donor", role: "DONOR" },
          });
        }
        userId = guestUser.id;
      }

      // Record donation — works for both logged-in and guest donors
      await prisma.donation.create({
        data: {
          userId,
          reportId: meta.reportId || null,
          amount,
          currency: session.currency || "usd",
          paymentMethod: "STRIPE",
          stripePaymentId: session.payment_intent as string,
          status: "CONFIRMED",
          isAnonymous: meta.anonymous === "true",
          donorMessage: meta.message || null,
        },
      });

      // Update Report.raisedAmount if reportId exists
      if (meta.reportId) {
        try {
          await prisma.report.update({
            where: { id: meta.reportId },
            data: { raisedAmount: { increment: amount } },
          });
        } catch {
          // Report might not exist — that's OK for general donations
          console.log(`Report ${meta.reportId} not found for raisedAmount update`);
        }
      }
    } catch (err) {
      console.error("Failed to record donation:", err);
    }
  }

  return NextResponse.json({ received: true });
}
