import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, donationReceiptHtml } from "@/lib/email";

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

    console.log(`Donation received: $${amount} | donor: ${meta.donorName || "anonymous"}`);

    try {
      let userId = meta.userId;

      if (!userId) {
        const guestEmail = session.customer_email || "guest@rajorise.com";
        let guestUser = await prisma.user.findUnique({ where: { email: guestEmail } });
        if (!guestUser) {
          guestUser = await prisma.user.create({
            data: { email: guestEmail, name: meta.donorName || "Guest Donor", role: "DONOR" },
          });
        }
        userId = guestUser.id;
      }

      const donation = await prisma.donation.create({
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

      // Update Report.raisedAmount
      if (meta.reportId) {
        try {
          await prisma.report.update({
            where: { id: meta.reportId },
            data: { raisedAmount: { increment: amount } },
          });
        } catch {
          console.log(`Report ${meta.reportId} not found`);
        }
      }

      // Send donation receipt email
      const donorEmail = session.customer_email;
      if (donorEmail) {
        let caseName = "General Fund";
        if (meta.reportId) {
          const report = await prisma.report.findUnique({ where: { id: meta.reportId }, select: { title: true } });
          if (report) caseName = report.title;
        }

        await sendEmail({
          to: donorEmail,
          subject: `Thank you for your $${amount} donation — RajoRise`,
          html: donationReceiptHtml({
            donorName: meta.donorName || "Generous Donor",
            amount,
            currency: session.currency || "usd",
            caseName,
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            receiptId: donation.id,
          }),
        });

        // Mark receipt as sent
        await prisma.donation.update({
          where: { id: donation.id },
          data: { receiptSentAt: new Date() },
        });
      }
    } catch (err) {
      console.error("Failed to process donation:", err);
    }
  }

  return NextResponse.json({ received: true });
}
