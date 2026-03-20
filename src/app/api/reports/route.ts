import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        location: true,
        status: true,
        goalAmount: true,
        raisedAmount: true,
        journalistId: true,
        isUrgent: true,
        createdAt: true,
      },
    });

    return NextResponse.json(reports);
  } catch (err) {
    console.error("GET /api/reports error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
