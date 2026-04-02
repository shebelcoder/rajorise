import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const updateSchema = z.object({
  title: z.string().min(1).max(200),
  story: z.string().max(10000).default(""),
  region: z.string().max(100).default("Gedo"),
  district: z.string().max(100).default(""),
  village: z.string().max(100).default(""),
  goalAmount: z.string().default("0"),
  coverImageUrl: z.string().max(2000000).default(""),
  storyImageUrl: z.string().max(2000000).default(""),
  submitForReview: z.boolean().default(false),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`journalist-edit:${ip}`, { max: 30, windowSeconds: 60 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (!user?.id || user.role !== "JOURNALIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Ownership check — journalist can only edit their own cases
    const existing = await prisma.report.findFirst({
      where: { id, journalistId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Case not found." }, { status: 404 });
    }

    // Can only edit DRAFT or REJECTED cases
    if (!["DRAFT", "REJECTED"].includes(existing.status)) {
      return NextResponse.json({ error: "Cannot edit a case that has been submitted or approved." }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
    }

    const { title, story, region, district, village, goalAmount, coverImageUrl, storyImageUrl, submitForReview } = parsed.data;

    if (submitForReview && (title.length < 5 || story.length < 50)) {
      return NextResponse.json({ error: "Title (5+) and story (50+) required to submit." }, { status: 400 });
    }

    const status = submitForReview ? "PENDING" : "DRAFT";

    const report = await prisma.report.update({
      where: { id },
      data: {
        title: sanitizePlain(title),
        summary: sanitizePlain(story.slice(0, 300)),
        fullStory: sanitizePlain(story),
        region: sanitizePlain(region),
        district: district ? sanitizePlain(district) : null,
        village: village ? sanitizePlain(village) : null,
        goalAmount: parseFloat(goalAmount) || 0,
        featuredImageUrl: coverImageUrl || null,
        mediaUrls: storyImageUrl ? [storyImageUrl] : undefined,
        status,
        rejectedReason: submitForReview ? null : existing.rejectedReason,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: submitForReview ? "CASE_RESUBMITTED" : "CASE_DRAFT_UPDATED",
        actorId: user.id,
        actorRole: "JOURNALIST",
        actorIp: ip,
        reportId: report.id,
        metadata: { title: report.title, status },
      },
    });

    return NextResponse.json({ success: true, id: report.id, status: report.status });
  } catch (err) {
    console.error("Update case error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
