import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, donationReceiptHtml } from "@/lib/email";

/**
 * EVC Plus (Hormuud/Somtel) Mobile Money Integration
 *
 * Flow:
 * 1. Donor enters phone number + amount on donate page
 * 2. This API creates a pending donation record
 * 3. In production: calls EVC Plus API to initiate USSD push
 * 4. EVC Plus sends callback when payment is confirmed
 * 5. Callback updates donation status to CONFIRMED
 *
 * For now: simulates the payment (test mode)
 * Production: integrate with Hormuud Merchant API or WaafiPay
 */

const evcSchema = z.object({
  phone: z.string().min(9).max(15).regex(/^\+?[0-9]+$/, "Invalid phone number"),
  amount: z.number().min(1).max(10000),
  currency: z.enum(["USD", "SOS"]).default("USD"),
  donorName: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
  reportId: z.string().max(50).optional(),
  userId: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`evc:${ip}`, { max: 5, windowSeconds: 300 });
  if (!limit.success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const body = await req.json();
  const parsed = evcSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { phone, amount, currency, donorName, email, reportId, userId } = parsed.data;

  // Normalize phone number
  let normalizedPhone = phone.replace(/[^0-9+]/g, "");
  if (!normalizedPhone.startsWith("+")) {
    normalizedPhone = normalizedPhone.startsWith("252") ? `+${normalizedPhone}` : `+252${normalizedPhone}`;
  }

  try {
    // Get or create user
    let donorUserId = userId;
    if (!donorUserId) {
      const donorEmail = email || `evc-${normalizedPhone}@rajorise.com`;
      let donor = await prisma.user.findUnique({ where: { email: donorEmail } });
      if (!donor) {
        donor = await prisma.user.create({
          data: { email: donorEmail, name: donorName || "EVC Donor", role: "DONOR" },
        });
      }
      donorUserId = donor.id;
    }

    // Create pending donation
    const donation = await prisma.donation.create({
      data: {
        userId: donorUserId,
        reportId: reportId || null,
        amount,
        currency,
        paymentMethod: "EVC_PLUS",
        status: "PENDING",
        isAnonymous: !donorName,
        donorMessage: `EVC Plus: ${normalizedPhone}`,
      },
    });

    // In production: call EVC Plus API here
    // const evcResponse = await callEvcApi({ phone: normalizedPhone, amount, merchantId: process.env.EVC_MERCHANT_ID });

    // For test mode: auto-confirm after 2 seconds (simulate USSD push)
    if (!process.env.EVC_MERCHANT_ID) {
      // Simulate: mark as confirmed
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: "CONFIRMED" },
      });

      // Update report raised amount
      if (reportId) {
        try {
          await prisma.report.update({
            where: { id: reportId },
            data: { raisedAmount: { increment: amount } },
          });
        } catch {}
      }

      // Send receipt if email provided
      if (email) {
        let caseName = "General Fund";
        if (reportId) {
          const report = await prisma.report.findUnique({ where: { id: reportId }, select: { title: true } });
          if (report) caseName = report.title;
        }
        sendEmail({
          to: email,
          subject: `Thank you for your $${amount} donation — RajoRise`,
          html: donationReceiptHtml({
            donorName: donorName || "Generous Donor",
            amount,
            currency,
            caseName,
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            receiptId: donation.id,
          }),
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        status: "CONFIRMED",
        message: "Payment confirmed (test mode). Thank you!",
        donationId: donation.id,
      });
    }

    // Production: return pending status — wait for EVC callback
    return NextResponse.json({
      success: true,
      status: "PENDING",
      message: `Payment request sent to ${normalizedPhone}. Please confirm on your phone.`,
      donationId: donation.id,
    });
  } catch (error) {
    console.error("EVC payment error:", error);
    return NextResponse.json({ error: "Payment failed." }, { status: 500 });
  }
}
