import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/reports/[id] — admin approves or rejects a report
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { action } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    const report = await prisma.report.update({
      where: { id },
      data: { status: newStatus },
    });

    await prisma.auditLog.create({
      data: {
        action: action === "approve" ? "CASE_APPROVED" : "CASE_REJECTED",
        actorId: session.user.id,
        targetId: id,
        metadata: { title: report.title, status: newStatus },
      },
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("PATCH /api/reports/[id] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
