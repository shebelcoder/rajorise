import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const cases = await prisma.report.findMany({
      where: {
        status: { in: ["APPROVED", "FUNDING", "AWAITING_PROCUREMENT", "COMPLETED"] },
      },
      orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        location: true,
        status: true,
        goalAmount: true,
        raisedAmount: true,
        currency: true,
        featuredImageUrl: true,
        isUrgent: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(cases, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (err) {
    console.error("GET /api/cases error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
