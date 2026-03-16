import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const story = formData.get("story") as string;
    const familiesAffected = parseInt(formData.get("familiesAffected") as string) || 0;
    const amountNeeded = parseFloat(formData.get("amountNeeded") as string) || 0;
    const videoUrl = (formData.get("videoUrl") as string) || null;

    if (!title || !location || !category || !story) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const validCategories = ["WATER", "FOOD", "EDUCATION", "MEDICAL", "EMERGENCY"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80) +
      "-" +
      Date.now();

    const report = await prisma.report.create({
      data: {
        slug,
        title,
        location,
        category: category as "WATER" | "FOOD" | "EDUCATION" | "MEDICAL" | "EMERGENCY",
        story,
        familiesAffected,
        amountNeeded,
        videoUrl: videoUrl || undefined,
        images: [],
        authorId: session.user.id,
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CASE_SUBMITTED",
        actorId: session.user.id,
        targetId: report.id,
        metadata: { title, category, location },
      },
    });

    return NextResponse.json({ success: true, reportId: report.id }, { status: 201 });
  } catch (err) {
    console.error("Report submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
