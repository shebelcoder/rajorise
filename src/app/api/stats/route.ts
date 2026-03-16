import { NextResponse } from "next/server";

// These would be fetched from DB in production
const STATS = {
  totalDonated: 125340,
  familiesHelped: 340,
  studentsSupported: 89,
  waterTrucks: 47,
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  // TODO: Replace with real DB queries once Prisma is configured
  // const totalDonated = await prisma.donation.aggregate({ _sum: { amount: true } });
  // const familiesHelped = await prisma.report.aggregate({ _sum: { familiesAffected: true } });

  return NextResponse.json(STATS, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" },
  });
}
