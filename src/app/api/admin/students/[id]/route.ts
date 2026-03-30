import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { action, reason } = body;

  if (action === "approve" || action === "reject") {
    await prisma.student.update({
      where: { id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        approvedById: action === "approve" ? user.id : null,
      },
    });
    return NextResponse.json({ success: true });
  }

  // General update (admin can edit anything)
  const updateData: Record<string, unknown> = {};
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.status) updateData.status = body.status;

  await prisma.student.update({ where: { id }, data: updateData });
  return NextResponse.json({ success: true });
}
