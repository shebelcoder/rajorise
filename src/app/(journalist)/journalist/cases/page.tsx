import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CasesList from "@/components/journalist/CasesList";
import Link from "next/link";
import { FolderOpen, GraduationCap, Users } from "lucide-react";

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

  const [cases, students, families] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, title: true, slug: true, status: true, region: true, district: true,
        goalAmount: true, raisedAmount: true, updatedAt: true, createdAt: true, featuredImageUrl: true,
      },
    }),
    prisma.student.findMany({
      where: { journalistId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, status: true, region: true, district: true, updatedAt: true },
    }),
    prisma.family.findMany({
      where: { journalistId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, status: true, region: true, district: true, updatedAt: true },
    }),
  ]);

  const serializedCases = cases.map((c) => ({
    ...c,
    goalAmount: Number(c.goalAmount),
    raisedAmount: Number(c.raisedAmount),
    updatedAt: c.updatedAt.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }));

  const statusBadge = (s: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      DRAFT: { bg: "#21262d", text: "#8b949e" },
      PENDING: { bg: "#2b1d0a", text: "#eab308" },
      APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
      REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
    };
    return colors[s] || colors.DRAFT;
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", marginBottom: 24 }}>My Content</h1>

      {/* Cases */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FolderOpen size={16} style={{ color: "#58a6ff" }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Cases ({cases.length})</h2>
        </div>
        <CasesList cases={serializedCases} currentFilter={statusFilter || null} />
      </div>

      {/* Students */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GraduationCap size={16} style={{ color: "#58a6ff" }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Students ({students.length})</h2>
          </div>
          <Link href="/journalist/students/new" style={{ fontSize: 12, color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>+ Add Student</Link>
        </div>
        <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
          {students.length === 0 ? (
            <p style={{ padding: "24px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No students added yet</p>
          ) : students.map((s, i) => {
            const sc = statusBadge(s.status);
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: i < students.length - 1 ? "1px solid #21262d" : "none" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{s.district ? `${s.district}, ` : ""}{s.region} · {new Date(s.updatedAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: sc.bg, color: sc.text, textTransform: "uppercase" }}>{s.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Families */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={16} style={{ color: "#ea580c" }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Families ({families.length})</h2>
          </div>
          <Link href="/journalist/families/new" style={{ fontSize: 12, color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>+ Add Family</Link>
        </div>
        <div style={{ backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
          {families.length === 0 ? (
            <p style={{ padding: "24px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No families added yet</p>
          ) : families.map((f, i) => {
            const sc = statusBadge(f.status);
            return (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: i < families.length - 1 ? "1px solid #21262d" : "none" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{f.name}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{f.district ? `${f.district}, ` : ""}{f.region} · {new Date(f.updatedAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: sc.bg, color: sc.text, textTransform: "uppercase" }}>{f.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
