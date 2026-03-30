import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80); }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const slug = `${slugify(sanitizePlain(body.title || "case"))}-${Date.now().toString(36)}`;

  const report = await prisma.report.create({
    data: {
      slug,
      title: sanitizePlain(body.title || ""),
      summary: sanitizePlain((body.fullStory || "").slice(0, 300)),
      fullStory: sanitizePlain(body.fullStory || ""),
      country: "Somalia",
      region: body.region || "Gedo",
      district: body.district || null,
      village: body.village || null,
      goalAmount: parseFloat(body.goalAmount) || 0,
      currency: "USD",
      journalistId: user.id,
      featuredImageUrl: body.featuredImageUrl || null,
      mediaUrls: [],
      isUrgent: body.isUrgent === true,
      status: "APPROVED",
      approvedById: user.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, id: report.id });
}
