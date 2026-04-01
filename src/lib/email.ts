import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Use verified domain, fallback to Resend onboarding if domain not fully verified
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "RajoRise <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

/** Donation receipt email */
export function donationReceiptHtml(params: {
  donorName: string;
  amount: number;
  currency: string;
  caseName: string;
  date: string;
  receiptId: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#16a34a,#1d4ed8);padding:32px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:24px;font-weight:800;">Thank You!</h1>
        <p style="margin:8px 0 0;opacity:0.85;font-size:14px;">Your donation makes a real difference</p>
      </div>

      <!-- Content -->
      <div style="padding:32px;">
        <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
          Dear ${params.donorName},
        </p>
        <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Thank you for your generous donation to RajoRise. Your contribution goes directly to communities in need.
        </p>

        <!-- Receipt box -->
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;">Amount</td>
              <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:18px;">$${params.amount.toLocaleString()} ${params.currency.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;">Supporting</td>
              <td style="padding:8px 0;text-align:right;color:#111827;font-size:13px;font-weight:600;">${params.caseName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td>
              <td style="padding:8px 0;text-align:right;color:#111827;font-size:13px;">${params.date}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;">Receipt ID</td>
              <td style="padding:8px 0;text-align:right;color:#6b7280;font-size:11px;font-family:monospace;">${params.receiptId}</td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:24px;">
          <a href="https://rajorise.com/impact" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
            See Your Impact
          </a>
        </div>

        <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;text-align:center;">
          100% of your donation goes to the cause. All projects are verified by our field team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:11px;margin:0;">
          RajoRise — Hope Into Life | <a href="https://rajorise.com" style="color:#16a34a;text-decoration:none;">rajorise.com</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Welcome email after registration */
export function welcomeEmailHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:32px;text-align:center;">
      <h1 style="color:#111827;font-size:22px;font-weight:800;margin:0 0 8px;">Welcome to RajoRise!</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Hi ${name}, thank you for joining. Your account is ready.
      </p>
      <a href="https://rajorise.com/donate" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
        Make Your First Donation
      </a>
      <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">
        Browse cases, sponsor students, and help families in need.
      </p>
    </div>
  </div>
</body>
</html>`;
}
