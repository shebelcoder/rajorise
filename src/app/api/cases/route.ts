import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cases — public endpoint, returns APPROVED reports only
export async function GET() {
  try {
    const cases = await prisma.report.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        category: true,
        story: true,
        familiesAffected: true,
        amountNeeded: true,
        raised: true,
        images: true,
        videoUrl: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    });

    return NextResponse.json(cases, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (err) {
    console.error("GET /api/cases error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
