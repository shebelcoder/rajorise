import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminItemsTable from "@/components/admin/ItemsTable";
import { Home } from "lucide-react";

export default async function AdminFamiliesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const families = await prisma.family.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, members: true, situation: true, need: true, region: true, district: true, status: true, goalAmount: true, raisedAmount: true, imageUrl: true, isActive: true, createdAt: true },
  });

  const serialized = families.map((f) => ({
    ...f,
    goalAmount: Number(f.goalAmount),
    raisedAmount: Number(f.raisedAmount),
    createdAt: f.createdAt.toISOString(),
    subtitle: `${f.members ? `${f.members} members` : ""}${f.situation ? ` · ${f.situation}` : ""} · ${f.district ? `${f.district}, ` : ""}${f.region}`,
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Home size={22} style={{ color: "#ea580c" }} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Families</h1>
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{families.length} total</p>
          </div>
        </div>
        <Link href="/admin/families/new" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "#f59e0b", color: "#000", textDecoration: "none" }}>+ Create Family</Link>
      </div>
      <AdminItemsTable items={serialized} type="families" />
    </div>
  );
}
