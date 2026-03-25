import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per 15 minutes
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`register:${ip}`, { max: 5, windowSeconds: 900 });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const sanitizedName = sanitizePlain(name);
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      // Generic message — don't reveal if email exists
      return NextResponse.json(
        { error: "Unable to create account. Please try a different email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: "DONOR",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "DONOR_REGISTERED",
        actorId: user.id,
        actorRole: "DONOR",
        actorIp: ip,
        metadata: { email: normalizedEmail },
      },
    });

    return NextResponse.json({ success: true, message: "Account created. Please sign in." });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
