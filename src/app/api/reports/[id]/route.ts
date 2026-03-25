import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const limit = rateLimit(`admin-review:${ip}`, { max: 20, windowSeconds: 60 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Validate the ID format (cuid)
    if (!id || id.length < 10 || id.length > 50) {
      return NextResponse.json({ error: "Invalid report ID." }, { status: 400 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { action, reason } = parsed.data;

    // Verify report exists before updating
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        approvedById: action === "approve" ? user.id : null,
        approvedAt: action === "approve" ? new Date() : null,
        rejectedReason: action === "reject" ? reason || null : null,
        publishedAt: action === "approve" ? new Date() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: action === "approve" ? "REPORT_APPROVED" : "REPORT_REJECTED",
        actorId: user.id,
        actorRole: "ADMIN",
        actorIp: ip,
        reportId: report.id,
        metadata: { title: report.title, reason: reason || null },
      },
    });

    return NextResponse.json({ success: true, status: report.status });
  } catch (err) {
    console.error("PATCH /api/reports/[id] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
