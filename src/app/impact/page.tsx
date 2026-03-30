import { TrendingUp, Droplets, GraduationCap, Users, Heart, FolderOpen, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 300;

async function getImpactData() {
  try {
    const [
      totalDonations,
      donationCount,
      totalStudents,
      totalFamilies,
      completedCases,
      activeCases,
      totalDonors,
      recentCompletedCases,
      approvedStories,
    ] = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED" } }),
      prisma.donation.count({ where: { status: "CONFIRMED" } }),
      prisma.student.count({ where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } } }),
      prisma.family.count({ where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } } }),
      prisma.report.count({ where: { status: "COMPLETED" } }),
      prisma.report.count({ where: { status: { in: ["APPROVED", "FUNDING", "AWAITING_PROCUREMENT"] } } }),
      prisma.user.count({ where: { role: "DONOR" } }),
      prisma.report.findMany({
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 5,
        select: { id: true, title: true, region: true, raisedAmount: true, completedAt: true },
      }),
      prisma.story.findMany({
        where: { status: "APPROVED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { id: true, title: true, slug: true, summary: true, source: true, publishedAt: true },
      }),
    ]);

    return {
      totalRaised: Number(totalDonations._sum.amount || 0),
      donationCount,
      totalStudents,
      totalFamilies,
      completedCases,
      activeCases,
      totalDonors,
      recentCompletedCases: recentCompletedCases.map((c) => ({
        ...c,
        raisedAmount: Number(c.raisedAmount),
        completedAt: c.completedAt?.toISOString() || null,
      })),
      approvedStories,
    };
  } catch {
    return {
      totalRaised: 0, donationCount: 0, totalStudents: 0, totalFamilies: 0,
      completedCases: 0, activeCases: 0, totalDonors: 0,
      recentCompletedCases: [], approvedStories: [],
    };
  }
}

export default async function ImpactPage() {
  const data = await getImpactData();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero */}
      <div className="gradient-hero" style={{ color: "#fff", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
            <TrendingUp style={{ width: 16, height: 16 }} /> Real-time data from our platform
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
            Our Impact
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem" }}>
            Every dollar is tracked. Every project is documented. This data comes directly from our database — not estimates.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {/* All-time stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
          {[
            { icon: Heart, label: "Total Donated", value: `$${data.totalRaised.toLocaleString()}`, color: "#16a34a", bg: "#f0fdf4" },
            { icon: GraduationCap, label: "Students Supported", value: data.totalStudents, color: "#ca8a04", bg: "#fefce8" },
            { icon: Users, label: "Families Helped", value: data.totalFamilies, color: "#dc2626", bg: "#fef2f2" },
            { icon: FolderOpen, label: "Cases Completed", value: data.completedCases, color: "#2563eb", bg: "#eff6ff" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #e5e7eb" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Icon size={28} style={{ color }} />
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Live platform stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 48 }}>
          {[
            { label: "Total Donations", value: data.donationCount },
            { label: "Active Cases", value: data.activeCases },
            { label: "Registered Donors", value: data.totalDonors },
            { label: "Avg Donation", value: data.donationCount > 0 ? `$${Math.round(data.totalRaised / data.donationCount)}` : "$0" },
          ].map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: 12, padding: "16px 20px", textAlign: "center", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Completed cases */}
        {data.recentCompletedCases.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Completed Projects</h2>
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {data.recentCompletedCases.map((c, i) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: i < data.recentCompletedCases.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>{c.title}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                      {c.region} · Completed {c.completedAt ? new Date(c.completedAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>${c.raisedAmount.toLocaleString()}</span>
                    <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#16a34a", backgroundColor: "#f0fdf4", padding: "2px 8px", borderRadius: 99, marginTop: 4 }}>COMPLETED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent stories */}
        {data.approvedStories.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Latest Updates</h2>
              <Link href="/stories" style={{ fontSize: 13, color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>View all stories →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {data.approvedStories.map((s) => (
                <Link key={s.id} href={`/stories/${s.slug}`} style={{
                  backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
                  padding: 20, textDecoration: "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <BookOpen size={14} style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
                      {s.source === "JOURNALIST" ? "Field Report" : s.source === "AI" ? "AI News" : "Update"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.summary || ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Transparency note */}
        <div style={{ backgroundColor: "#eff6ff", borderRadius: 20, border: "1px solid #bfdbfe", padding: "2.5rem", textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Full Transparency Commitment</h3>
          <p style={{ color: "#4b5563", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            All numbers on this page come directly from our live database — not estimates.
            Field journalists provide documentation for every project. Admin verifies every case before it goes public.
          </p>
        </div>
      </div>
    </div>
  );
}
