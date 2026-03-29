import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, Users, FolderOpen, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string; name?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") redirect("/portal/admin-login");

  const [
    totalDonations,
    totalUsers,
    totalCases,
    pendingCases,
    approvedCases,
    completedCases,
    rejectedCases,
    totalDonors,
    totalJournalists,
    recentDonations,
    pendingReports,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED" } }),
    prisma.user.count(),
    prisma.report.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { status: { in: ["APPROVED", "FUNDING"] } } }),
    prisma.report.count({ where: { status: "COMPLETED" } }),
    prisma.report.count({ where: { status: "REJECTED" } }),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.user.count({ where: { role: "JOURNALIST" } }),
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, amount: true, currency: true, isAnonymous: true, createdAt: true, user: { select: { name: true } }, report: { select: { title: true } } },
    }),
    prisma.report.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, region: true, district: true, createdAt: true },
    }),
  ]);

  const totalRaised = Number(totalDonations._sum.amount || 0);

  const statCards = [
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: DollarSign, color: "#22c55e", bg: "#0f2c1a" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "#58a6ff", bg: "#0d1a2e" },
    { label: "Active Cases", value: approvedCases, icon: FolderOpen, color: "#f59e0b", bg: "#2b1d0a" },
    { label: "Pending Review", value: pendingCases, icon: Clock, color: "#eab308", bg: "#2b1d0a" },
    { label: "Completed", value: completedCases, icon: CheckCircle, color: "#22c55e", bg: "#0f2c1a" },
    { label: "Donors", value: totalDonors, icon: TrendingUp, color: "#a78bfa", bg: "#1e1040" },
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Command Center</h1>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Organization overview — real-time data from your platform</p>
      </div>

      {/* Alert bar */}
      {pendingCases > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          backgroundColor: "#2b1d0a", border: "1px solid #92400e",
          borderRadius: 10, padding: "12px 20px", marginBottom: 24,
        }}>
          <AlertTriangle size={18} style={{ color: "#f59e0b" }} />
          <span style={{ fontSize: 13, color: "#fbbf24", flex: 1 }}>
            <strong>{pendingCases} cases</strong> awaiting your review
          </span>
          <Link href="/admin/cases" style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Review now <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 32 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            backgroundColor: "#111827", border: "1px solid #1c2333",
            borderRadius: 12, padding: "18px 16px", textAlign: "center",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#e6edf3", lineHeight: 1, margin: 0 }}>{value}</p>
            <p style={{ fontSize: 10, color: "#6b7280", marginTop: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Pending + Recent Donations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Pending cases */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #1c2333" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Pending Cases</h2>
            <Link href="/admin/cases" style={{ fontSize: 11, color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>View all</Link>
          </div>
          {pendingReports.length === 0 ? (
            <p style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No pending cases</p>
          ) : (
            pendingReports.map((r) => (
              <Link key={r.id} href={`/admin/cases`} style={{
                display: "block", padding: "12px 20px", borderBottom: "1px solid #1c2333",
                textDecoration: "none",
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{r.district ? `${r.district}, ` : ""}{r.region} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </Link>
            ))
          )}
        </div>

        {/* Recent donations */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #1c2333" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", margin: 0 }}>Recent Donations</h2>
            <Link href="/admin/finance" style={{ fontSize: 11, color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>View all</Link>
          </div>
          {recentDonations.length === 0 ? (
            <p style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No donations yet</p>
          ) : (
            recentDonations.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #1c2333" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>
                    {d.isAnonymous ? "Anonymous" : d.user?.name || "Unknown"}
                  </p>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                    {d.report?.title?.slice(0, 40) || "General Fund"} · {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#22c55e" }}>${Number(d.amount)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
        {[
          { label: "Review Cases", href: "/admin/cases", color: "#f59e0b" },
          { label: "Manage Users", href: "/admin/users", color: "#58a6ff" },
          { label: "View Finance", href: "/admin/finance", color: "#22c55e" },
          { label: "AI Insights", href: "/admin/ai", color: "#a78bfa" },
        ].map(({ label, href, color }) => (
          <Link key={href} href={href} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            backgroundColor: "#111827", border: "1px solid #1c2333",
            borderRadius: 10, padding: "14px", textDecoration: "none",
            fontSize: 13, fontWeight: 600, color,
            transition: "border-color 0.15s",
          }}>
            {label} <ArrowRight size={14} />
          </Link>
        ))}
      </div>
    </div>
  );
}
