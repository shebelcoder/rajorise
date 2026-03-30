import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminCasesTable from "@/components/admin/CasesTable";

export default async function AdminCasesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const cases = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, slug: true, status: true, region: true, district: true,
      goalAmount: true, raisedAmount: true, isUrgent: true, journalistId: true,
      createdAt: true, updatedAt: true, rejectedReason: true,
    },
  });

  const serialized = cases.map((c) => ({
    ...c,
    goalAmount: Number(c.goalAmount),
    raisedAmount: Number(c.raisedAmount),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Cases Management</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{cases.length} total</p>
        </div>
        <Link href="/admin/cases/new" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#f59e0b", color: "#000", textDecoration: "none" }}>+ Create Case</Link>
      </div>
      <AdminCasesTable cases={serialized} />
    </div>
  );
}
