import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action, title, content } = await req.json();

  if (action === "approve") {
    await prisma.story.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: user.id,
        publishedAt: new Date(),
        ...(title && { title }),
        ...(content && { content, summary: content.slice(0, 200) }),
      },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    await prisma.story.update({ where: { id }, data: { status: "REJECTED" } });
    return NextResponse.json({ success: true });
  }

  if (action === "delete") {
    await prisma.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
