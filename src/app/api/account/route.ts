import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalAgg, donations] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true, where: { userId: user.id, status: "CONFIRMED" } }),
    prisma.donation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, amount: true, currency: true, status: true, createdAt: true, report: { select: { title: true, slug: true } } },
    }),
  ]);

  return NextResponse.json({
    totalDonated: Number(totalAgg._sum.amount || 0),
    donationCount: totalAgg._count,
    lastDonation: donations[0]?.createdAt || null,
    donations: donations.map((d) => ({
      id: d.id,
      amount: Number(d.amount),
      currency: d.currency,
      status: d.status,
      date: d.createdAt.toISOString(),
      caseTitle: d.report?.title || "General Fund",
      caseSlug: d.report?.slug || null,
    })),
  });
}
