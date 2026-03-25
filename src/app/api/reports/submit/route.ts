import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const submitSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  location: z.string().max(200).optional(),
  story: z.string().min(50, "Story must be at least 50 characters").max(10000),
  amountNeeded: z.string().refine((v) => !v || !isNaN(parseFloat(v)), "Must be a number").optional(),
  videoUrl: z.string().url("Invalid URL").max(500).optional().or(z.literal("")),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`report-submit:${ip}`, { max: 5, windowSeconds: 3600 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || user.role !== "JOURNALIST") {
      return NextResponse.json({ error: "Unauthorized. Journalist access only." }, { status: 403 });
    }

    const formData = await req.formData();
    const raw = {
      title: formData.get("title") as string || "",
      location: formData.get("location") as string || "",
      story: formData.get("story") as string || "",
      amountNeeded: formData.get("amountNeeded") as string || "",
      videoUrl: formData.get("videoUrl") as string || "",
    };

    const parsed = submitSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { title, location, story, amountNeeded } = parsed.data;
    const slug = `${slugify(sanitizePlain(title))}-${Date.now().toString(36)}`;

    const report = await prisma.report.create({
      data: {
        slug,
        title: sanitizePlain(title),
        summary: sanitizePlain(story.slice(0, 300)),
        fullStory: sanitizePlain(story),
        location: location ? sanitizePlain(location) : null,
        goalAmount: parseFloat(amountNeeded || "0") || 0,
        currency: "USD",
        journalistId: user.id,
        mediaUrls: [],
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "REPORT_SUBMITTED",
        actorId: user.id,
        actorRole: "JOURNALIST",
        actorIp: ip,
        reportId: report.id,
        metadata: { title: report.title, slug },
      },
    });

    return NextResponse.json({ success: true, reportId: report.id, slug }, { status: 201 });
  } catch (err) {
    console.error("Report submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
