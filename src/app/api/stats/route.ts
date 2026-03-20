import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  try {
    const [donationAgg, casesHelped, activeCases, totalDonors] = await Promise.all([
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: "CONFIRMED" },
      }),
      prisma.report.count({
        where: { status: "COMPLETED" },
      }),
      prisma.report.count({
        where: { status: { in: ["APPROVED", "FUNDING", "AWAITING_PROCUREMENT"] } },
      }),
      prisma.user.count({
        where: { role: "DONOR" },
      }),
    ]);

    return NextResponse.json(
      {
        totalDonated: Number(donationAgg._sum.amount || 0),
        casesHelped,
        activeCases,
        totalDonors,
        lastUpdated: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" } }
    );
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      { totalDonated: 0, casesHelped: 0, activeCases: 0, totalDonors: 0, lastUpdated: new Date().toISOString() },
      { status: 500 }
    );
  }
}
