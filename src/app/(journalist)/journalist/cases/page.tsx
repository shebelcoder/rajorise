import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CasesList from "@/components/journalist/CasesList";

export default async function JournalistCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || user.role !== "JOURNALIST") {
    redirect("/portal/journalist-login");
  }

  const params = await searchParams;
  const statusFilter = params.status;

  const where: Record<string, unknown> = { journalistId: user.id };
  if (statusFilter && ["DRAFT", "PENDING", "APPROVED", "REJECTED"].includes(statusFilter)) {
    where.status = statusFilter;
  }

  const cases = await prisma.report.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      region: true,
      district: true,
      goalAmount: true,
      raisedAmount: true,
      updatedAt: true,
      createdAt: true,
      featuredImageUrl: true,
    },
  });

  const serialized = cases.map((c) => ({
    ...c,
    goalAmount: Number(c.goalAmount),
    raisedAmount: Number(c.raisedAmount),
    updatedAt: c.updatedAt.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>My Cases</h1>
      </div>
      <CasesList cases={serialized} currentFilter={statusFilter || null} />
    </div>
  );
}
