import { prisma } from "@/lib/prisma";
import { TrendingUp, DollarSign, Users, FolderOpen, GraduationCap, Heart, Shield } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

async function getData() {
  const [
    totalDonations, donationCount, totalStudents, totalFamilies,
    completedCases, activeCases, totalDonors, totalJournalists,
    casesByRegion, recentDonations,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED" } }),
    prisma.donation.count({ where: { status: "CONFIRMED" } }),
    prisma.student.count({ where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } } }),
    prisma.family.count({ where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } } }),
    prisma.report.count({ where: { status: "COMPLETED" } }),
    prisma.report.count({ where: { status: { in: ["APPROVED", "FUNDING"] } } }),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.user.count({ where: { role: "JOURNALIST" } }),
    prisma.report.groupBy({ by: ["region"], _count: true, _sum: { raisedAmount: true }, orderBy: { _count: { region: "desc" } } }),
    prisma.donation.findMany({
      where: { status: "CONFIRMED" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, amount: true, isAnonymous: true, createdAt: true, user: { select: { name: true } }, report: { select: { title: true } } },
    }),
  ]);

  return {
    totalRaised: Number(totalDonations._sum.amount || 0),
    donationCount, totalStudents, totalFamilies, completedCases,
    activeCases, totalDonors, totalJournalists,
    casesByRegion: casesByRegion.map((r) => ({ region: r.region, count: r._count, raised: Number(r._sum?.raisedAmount || 0) })),
    recentDonations: recentDonations.map((d) => ({
      id: d.id, amount: Number(d.amount), anonymous: d.isAnonymous,
      donor: d.isAnonymous ? "Anonymous" : d.user?.name || "Anonymous",
      caseTitle: d.report?.title || "General Fund",
      date: d.createdAt.toISOString(),
    })),
  };
}

export default async function TransparencyPage() {
  const data = await getData();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div className="gradient-hero" style={{ color: "#fff", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20, fontSize: 14 }}>
            <Shield style={{ width: 16, height: 16 }} /> Full financial transparency
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>Transparency Report</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem" }}>
            Every number on this page comes directly from our live database. Nothing is estimated.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {/* Big stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { icon: DollarSign, label: "Total Donations", value: `$${data.totalRaised.toLocaleString()}`, color: "#16a34a" },
            { icon: FolderOpen, label: "Cases Helped", value: data.completedCases, color: "#2563eb" },
            { icon: GraduationCap, label: "Students", value: data.totalStudents, color: "#ca8a04" },
            { icon: Users, label: "Families", value: data.totalFamilies, color: "#dc2626" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #e5e7eb" }}>
              <Icon size={28} style={{ color, margin: "0 auto 8px" }} />
              <p style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>{value}</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Platform health */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 40 }}>
          {[
            { label: "Donations Made", value: data.donationCount },
            { label: "Active Cases", value: data.activeCases },
            { label: "Registered Donors", value: data.totalDonors },
            { label: "Field Journalists", value: data.totalJournalists },
            { label: "Avg Donation", value: data.donationCount > 0 ? `$${Math.round(data.totalRaised / data.donationCount)}` : "$0" },
          ].map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: 12, padding: "14px", textAlign: "center", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{value}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* By region */}
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>By Region</h2>
            </div>
            {data.casesByRegion.length === 0 ? (
              <p style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No data yet</p>
            ) : data.casesByRegion.map((r, i) => (
              <div key={r.region} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: i < data.casesByRegion.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{r.region}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{r.count} cases</p>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>${r.raised.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Recent donations */}
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Recent Donations</h2>
            </div>
            {data.recentDonations.length === 0 ? (
              <p style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No donations yet</p>
            ) : data.recentDonations.map((d, i) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 24px", borderBottom: i < data.recentDonations.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{d.donor}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{d.caseTitle} · {new Date(d.date).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>${d.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust note */}
        <div style={{ marginTop: 40, backgroundColor: "#f0fdf4", borderRadius: 20, border: "1px solid #bbf7d0", padding: "2.5rem", textAlign: "center" }}>
          <TrendingUp size={32} style={{ color: "#16a34a", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>100% Transparent</h3>
          <p style={{ color: "#4b5563", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            All data on this page is queried directly from our live database. Every donation, every case, every number — verified and real.
          </p>
          <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#16a34a", color: "#fff", padding: "12px 24px", borderRadius: 12, fontWeight: 700, textDecoration: "none", marginTop: 20 }}>
            <Heart size={16} /> Donate with Confidence
          </Link>
        </div>
      </div>
    </div>
  );
}
