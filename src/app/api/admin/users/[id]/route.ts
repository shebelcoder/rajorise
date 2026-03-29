import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;
  if (body.role && ["DONOR", "JOURNALIST", "ADMIN", "PROCUREMENT_OFFICER", "FIELD_AGENT"].includes(body.role)) {
    updateData.role = body.role;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      action: body.role ? "ROLE_CHANGED" : body.isActive === false ? "USER_DEACTIVATED" : "USER_ACTIVATED",
      actorId: user.id,
      actorRole: "ADMIN",
      targetId: id,
      targetType: "User",
      metadata: updateData as Record<string, string | boolean>,
    },
  });

  return NextResponse.json({ success: true, id: updated.id });
}
