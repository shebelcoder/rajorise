import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText, CheckCircle, Clock, XCircle, FileEdit, Send } from "lucide-react";
import { redirect } from "next/navigation";

export default async function JournalistDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string; name?: string } | undefined;

  if (!user?.id || user.role !== "JOURNALIST") {
    redirect("/portal/journalist-login");
  }

  const [totalCases, drafts, submitted, approved, rejected, recentCases] = await Promise.all([
    prisma.report.count({ where: { journalistId: user.id } }),
    prisma.report.count({ where: { journalistId: user.id, status: "DRAFT" } }),
    prisma.report.count({ where: { journalistId: user.id, status: "PENDING" } }),
    prisma.report.count({ where: { journalistId: user.id, status: "APPROVED" } }),
    prisma.report.count({ where: { journalistId: user.id, status: "REJECTED" } }),
    prisma.report.findMany({
      where: { journalistId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        region: true,
        district: true,
        updatedAt: true,
        slug: true,
      },
    }),
  ]);

  const stats = [
    { label: "Total Cases", value: totalCases, icon: FileText, color: "#58a6ff" },
    { label: "Drafts", value: drafts, icon: FileEdit, color: "#8b949e" },
    { label: "Submitted", value: submitted, icon: Send, color: "#eab308" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "#22c55e" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "#ef4444" },
  ];

  const statusColors: Record<string, { bg: string; text: string }> = {
    DRAFT: { bg: "#21262d", text: "#8b949e" },
    PENDING: { bg: "#2b1d0a", text: "#eab308" },
    APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
    REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
    FUNDING: { bg: "#0d1a2e", text: "#58a6ff" },
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", margin: 0 }}>
            Welcome back, {user.name || "Journalist"}
          </h1>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 4 }}>
            Your content studio — create, manage, and submit field reports
          </p>
        </div>
        <Link
          href="/journalist/cases/new"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            backgroundColor: "#22c55e", color: "#fff", padding: "10px 20px",
            borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none",
          }}
        >
          <Plus size={16} /> New Case
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            backgroundColor: "#161b22", border: "1px solid #21262d",
            borderRadius: 12, padding: "16px 20px", textAlign: "center",
          }}>
            <Icon size={20} style={{ color, margin: "0 auto 8px" }} />
            <p style={{ fontSize: 28, fontWeight: 900, color: "#e6edf3", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 11, color: "#8b949e", marginTop: 6 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recent cases */}
      <div style={{
        backgroundColor: "#161b22", border: "1px solid #21262d",
        borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: "1px solid #21262d",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Recent Cases</h2>
          <Link href="/journalist/cases" style={{ fontSize: 12, color: "#58a6ff", textDecoration: "none", fontWeight: 600 }}>
            View all
          </Link>
        </div>

        {recentCases.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ color: "#8b949e", fontSize: 14, marginBottom: 16 }}>No cases yet — start by creating your first report.</p>
            <Link
              href="/journalist/cases/new"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                backgroundColor: "#22c55e", color: "#fff", padding: "10px 20px",
                borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}
            >
              <Plus size={16} /> Create First Case
            </Link>
          </div>
        ) : (
          <div>
            {recentCases.map((c) => {
              const sc = statusColors[c.status] || statusColors.DRAFT;
              return (
                <Link
                  key={c.id}
                  href={`/journalist/cases/${c.id}/edit`}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 20px", borderBottom: "1px solid #21262d",
                    textDecoration: "none", transition: "background 0.1s",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: "#e6edf3", fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>
                      {c.district ? `${c.district}, ` : ""}{c.region} · {new Date(c.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: sc.bg, color: sc.text,
                    fontSize: 10, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 99, textTransform: "uppercase",
                  }}>
                    {c.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{
        marginTop: 24, backgroundColor: "#161b22", border: "1px solid #21262d",
        borderRadius: 12, padding: "20px 24px",
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", marginBottom: 12 }}>Tips for Faster Approval</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            "Include at least 2 photos showing the situation",
            "Mention exact number of families affected",
            "Provide a specific funding amount with breakdown",
            "Use real location names (no abbreviations)",
          ].map((tip, i) => (
            <p key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#8b949e", margin: 0 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>→</span> {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
