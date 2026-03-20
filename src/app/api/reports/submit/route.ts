import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || user.role !== "JOURNALIST") {
      return NextResponse.json({ error: "Unauthorized. Journalist access only." }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const story = formData.get("story") as string;
    const amountNeeded = formData.get("amountNeeded") as string;
    const videoUrl = (formData.get("videoUrl") as string) || null;

    if (!title || !story) {
      return NextResponse.json({ error: "Title and story are required." }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now().toString(36)}`;

    const report = await prisma.report.create({
      data: {
        slug,
        title,
        summary: story.slice(0, 300),
        fullStory: story,
        location: location || null,
        goalAmount: parseFloat(amountNeeded) || 0,
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
        reportId: report.id,
        metadata: { title, location: location || "unknown", slug },
      },
    });

    return NextResponse.json({ success: true, reportId: report.id, slug }, { status: 201 });
  } catch (err) {
    console.error("Report submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
