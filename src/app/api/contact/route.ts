import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizePlain } from "@/lib/sanitize";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { max: 3, windowSeconds: 3600 });
  if (!limit.success) return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { name, email, subject, message } = parsed.data;

  // Log the contact message (in production, send email via Resend)
  console.log(`[CONTACT] From: ${sanitizePlain(name)} <${email}> | Subject: ${sanitizePlain(subject)} | Message: ${sanitizePlain(message).slice(0, 200)}`);

  return NextResponse.json({ success: true, message: "Message received. We'll get back to you soon." });
}
