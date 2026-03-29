import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const caseSchema = z.object({
  title: z.string().min(1).max(200),
  story: z.string().max(10000).default(""),
  region: z.string().max(100).default("Gedo"),
  district: z.string().max(100).default(""),
  village: z.string().max(100).default(""),
  goalAmount: z.string().default("0"),
  coverImageUrl: z.string().max(500).default(""),
  submitForReview: z.boolean().default(false),
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`journalist-case:${ip}`, { max: 10, windowSeconds: 3600 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (!user?.id || user.role !== "JOURNALIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = caseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
    }

    const { title, story, region, district, village, goalAmount, coverImageUrl, submitForReview } = parsed.data;

    if (submitForReview && (title.length < 5 || story.length < 50)) {
      return NextResponse.json({ error: "Title (5+) and story (50+) required to submit." }, { status: 400 });
    }

    const slug = `${slugify(sanitizePlain(title))}-${Date.now().toString(36)}`;
    const status = submitForReview ? "PENDING" : "DRAFT";

    const report = await prisma.report.create({
      data: {
        slug,
        title: sanitizePlain(title),
        summary: sanitizePlain(story.slice(0, 300)),
        fullStory: sanitizePlain(story),
        country: "Somalia",
        region: sanitizePlain(region),
        district: district ? sanitizePlain(district) : null,
        village: village ? sanitizePlain(village) : null,
        goalAmount: parseFloat(goalAmount) || 0,
        currency: "USD",
        journalistId: user.id,
        featuredImageUrl: coverImageUrl || null,
        mediaUrls: [],
        status,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: submitForReview ? "CASE_SUBMITTED" : "CASE_DRAFT_CREATED",
        actorId: user.id,
        actorRole: "JOURNALIST",
        actorIp: ip,
        reportId: report.id,
        metadata: { title: report.title, status },
      },
    });

    return NextResponse.json({ success: true, id: report.id, slug: report.slug }, { status: 201 });
  } catch (err) {
    console.error("Create case error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
