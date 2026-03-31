import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePlain } from "@/lib/sanitize";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...report, goalAmount: Number(report.goalAmount), raisedAmount: Number(report.raisedAmount) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  // Admin can update any field
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = sanitizePlain(body.title);
  if (body.summary !== undefined) data.summary = sanitizePlain(body.summary);
  if (body.fullStory !== undefined) data.fullStory = sanitizePlain(body.fullStory);
  if (body.region !== undefined) data.region = body.region;
  if (body.district !== undefined) data.district = body.district || null;
  if (body.village !== undefined) data.village = body.village || null;
  if (body.goalAmount !== undefined) data.goalAmount = parseFloat(body.goalAmount) || 0;
  if (body.featuredImageUrl !== undefined) data.featuredImageUrl = body.featuredImageUrl || null;
  if (body.isUrgent !== undefined) data.isUrgent = body.isUrgent;
  if (body.status !== undefined) data.status = body.status;

  await prisma.report.update({ where: { id }, data });

  await prisma.auditLog.create({
    data: {
      action: "CASE_EDITED_BY_ADMIN",
      actorId: user.id,
      actorRole: "ADMIN",
      reportId: id,
      metadata: { fields: Object.keys(data) },
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.auditLog.deleteMany({ where: { reportId: id } });
  await prisma.donation.deleteMany({ where: { reportId: id } });
  await prisma.ledgerEntry.deleteMany({ where: { fundPool: { reportId: id } } });
  await prisma.fundPool.deleteMany({ where: { reportId: id } });
  await prisma.purchaseOrder.deleteMany({ where: { reportId: id } });
  await prisma.report.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
