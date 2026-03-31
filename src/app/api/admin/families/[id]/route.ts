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
  const family = await prisma.family.findUnique({ where: { id } });
  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...family, goalAmount: Number(family.goalAmount), raisedAmount: Number(family.raisedAmount) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  if (body.action === "approve" || body.action === "reject") {
    await prisma.family.update({
      where: { id },
      data: { status: body.action === "approve" ? "APPROVED" : "REJECTED", approvedById: body.action === "approve" ? user.id : null },
    });
    return NextResponse.json({ success: true });
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = sanitizePlain(body.name);
  if (body.members !== undefined) data.members = body.members ? parseInt(body.members) : null;
  if (body.situation !== undefined) data.situation = body.situation || null;
  if (body.need !== undefined) data.need = body.need || null;
  if (body.region !== undefined) data.region = body.region;
  if (body.district !== undefined) data.district = body.district || null;
  if (body.village !== undefined) data.village = body.village || null;
  if (body.story !== undefined) data.story = sanitizePlain(body.story);
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.phoneContact !== undefined) data.phoneContact = body.phoneContact || null;
  if (body.goalAmount !== undefined) data.goalAmount = parseFloat(body.goalAmount) || 0;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.status !== undefined) data.status = body.status;

  await prisma.family.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.family.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
