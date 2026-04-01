import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email().max(255),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`forgot-pw:${ip}`, { max: 3, windowSeconds: 900 });
    if (!limit.success) {
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();

    // Always return same response — don't reveal if email exists
    const successResponse = NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return successResponse;

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Invalidate any existing tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email, usedAt: null },
      data: { usedAt: new Date() },
    });

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your password — RajoRise",
      html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
<div style="max-width:480px;margin:0 auto;padding:40px 20px;">
<div style="background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:32px;text-align:center;">
<h1 style="color:#111827;font-size:22px;font-weight:800;margin:0 0 8px;">Reset Your Password</h1>
<p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Click the button below to set a new password. This link expires in 30 minutes.</p>
<a href="${resetUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Reset Password</a>
<p style="color:#9ca3af;font-size:11px;margin:24px 0 0;">If you didn't request this, ignore this email.</p>
</div></div></body></html>`,
    });

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
