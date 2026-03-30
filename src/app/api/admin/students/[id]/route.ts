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
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...student, goalAmount: Number(student.goalAmount), raisedAmount: Number(student.raisedAmount) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  if (body.action === "approve" || body.action === "reject") {
    await prisma.student.update({
      where: { id },
      data: { status: body.action === "approve" ? "APPROVED" : "REJECTED", approvedById: body.action === "approve" ? user.id : null },
    });
    return NextResponse.json({ success: true });
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = sanitizePlain(body.name);
  if (body.age !== undefined) data.age = body.age ? parseInt(body.age) : null;
  if (body.grade !== undefined) data.grade = body.grade || null;
  if (body.region !== undefined) data.region = body.region;
  if (body.district !== undefined) data.district = body.district || null;
  if (body.village !== undefined) data.village = body.village || null;
  if (body.story !== undefined) data.story = sanitizePlain(body.story);
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.goalAmount !== undefined) data.goalAmount = parseFloat(body.goalAmount) || 0;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.status !== undefined) data.status = body.status;

  await prisma.student.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
