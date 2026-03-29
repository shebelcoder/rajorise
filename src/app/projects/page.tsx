import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatLocation } from "@/lib/locations";
import RegionFilter from "@/components/RegionFilter";

export const revalidate = 60;

async function getCases() {
  try {
    return await prisma.report.findMany({
      where: {
        status: { in: ["APPROVED", "FUNDING", "AWAITING_PROCUREMENT", "COMPLETED"] },
      },
      orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        location: true,
        country: true,
        region: true,
        district: true,
        village: true,
        status: true,
        goalAmount: true,
        raisedAmount: true,
        isUrgent: true,
        featuredImageUrl: true,
      },
    });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [donationAgg, completedCount, activeCount] = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED" } }),
      prisma.report.count({ where: { status: "COMPLETED" } }),
      prisma.report.count({ where: { status: { in: ["APPROVED", "FUNDING", "AWAITING_PROCUREMENT"] } } }),
    ]);
    return {
      totalRaised: Number(donationAgg._sum.amount || 0),
      casesHelped: completedCount,
      activeProjects: activeCount,
    };
  } catch {
    return { totalRaised: 0, casesHelped: 0, activeProjects: 0 };
  }
}

export default async function ProjectsPage() {
  const [cases, stats] = await Promise.all([getCases(), getStats()]);

  // Serialize Decimal fields for client component
  const serializedCases = cases.map((c) => ({
    ...c,
    goalAmount: Number(c.goalAmount),
    raisedAmount: Number(c.raisedAmount),
    locationFormatted: formatLocation({
      village: c.village,
      district: c.district,
      region: c.region,
      country: c.country,
    }),
  }));

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      <div className="hero-band">
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
            Active Cases
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto" }}>
            Every case is verified by our admin team and documented by field journalists.
          </p>
          {/* Operating region banner */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
            borderRadius: 99, padding: "6px 16px", marginTop: 16, fontSize: 13,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block" }} />
            Currently operating in Gedo Region, Somalia
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Active Cases", value: stats.activeProjects.toString() },
            { label: "Total Raised", value: "$" + stats.totalRaised.toLocaleString() },
            { label: "Cases Completed", value: stats.casesHelped.toString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.4rem" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Region filter + cases grid */}
        <RegionFilter cases={serializedCases} />

        <div style={{ marginTop: "4rem", background: "#fff", borderRadius: 20, padding: "3rem 2rem", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Don&apos;t see a specific case?
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Make a general donation and our team allocates it where it&apos;s needed most.
          </p>
          <Link href="/donate" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#16a34a", color: "#fff", padding: "0.75rem 2rem",
            borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: "0.95rem",
          }}>
            Make a General Donation <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
