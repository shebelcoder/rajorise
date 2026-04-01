import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizePlain } from "@/lib/sanitize";
import { sendEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  reason: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { max: 3, windowSeconds: 3600 });
  if (!limit.success) return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const { name, email, reason, message } = parsed.data;

  console.log(`[CONTACT] From: ${sanitizePlain(name)} <${email}> | Reason: ${sanitizePlain(reason)} | Message: ${sanitizePlain(message).slice(0, 200)}`);

  // Send notification email to admin
  sendEmail({
    to: "admin@rajorise.com",
    subject: `Contact Form: ${sanitizePlain(reason)} — from ${sanitizePlain(name)}`,
    html: `
<div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
<h2 style="color:#111827;">New Contact Message</h2>
<p><strong>From:</strong> ${sanitizePlain(name)} &lt;${email}&gt;</p>
<p><strong>Reason:</strong> ${sanitizePlain(reason)}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
<p style="color:#374151;line-height:1.7;">${sanitizePlain(message)}</p>
</div>`,
  }).catch(() => {});

  return NextResponse.json({ success: true, message: "Message received. We'll get back to you soon." });
}
