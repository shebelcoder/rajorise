import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { action, reason } = await req.json();

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
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
