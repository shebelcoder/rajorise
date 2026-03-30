import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminItemsTable from "@/components/admin/ItemsTable";
import { GraduationCap } from "lucide-react";

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const students = await prisma.student.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, age: true, grade: true, region: true, district: true, status: true, goalAmount: true, raisedAmount: true, imageUrl: true, isActive: true, createdAt: true },
  });

  const serialized = students.map((s) => ({
    ...s,
    goalAmount: Number(s.goalAmount),
    raisedAmount: Number(s.raisedAmount),
    createdAt: s.createdAt.toISOString(),
    subtitle: `${s.age ? `Age ${s.age}` : ""}${s.grade ? ` · ${s.grade}` : ""} · ${s.district ? `${s.district}, ` : ""}${s.region}`,
  }));

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <GraduationCap size={22} style={{ color: "#58a6ff" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Students</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{students.length} total — approve, manage, and track sponsorships</p>
        </div>
      </div>
      <AdminItemsTable items={serialized} type="students" />
    </div>
  );
}
