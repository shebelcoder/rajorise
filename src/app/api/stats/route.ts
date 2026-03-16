import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalDonatedResult, familiesHelpedResult, studentsResult, waterTrucksResult] =
      await Promise.all([
        prisma.donation.aggregate({ _sum: { amount: true } }),
        prisma.report.aggregate({
          where: { status: "APPROVED" },
          _sum: { familiesAffected: true },
        }),
        prisma.impactReport.aggregate({ _sum: { studentsSupported: true } }),
        prisma.impactReport.aggregate({ _sum: { trucksDelivered: true } }),
      ]);

    return NextResponse.json(
      {
        totalDonated:      totalDonatedResult._sum.amount            ?? 0,
        familiesHelped:    familiesHelpedResult._sum.familiesAffected ?? 0,
        studentsSupported: studentsResult._sum.studentsSupported      ?? 0,
        waterTrucks:       waterTrucksResult._sum.trucksDelivered     ?? 0,
        lastUpdated:       new Date().toISOString(),
      },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" } }
    );
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
