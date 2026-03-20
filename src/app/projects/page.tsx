import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
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

        {cases.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No active cases right now.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — our journalists are in the field.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {cases.map((c) => {
              const goal = Number(c.goalAmount);
              const raised = Number(c.raisedAmount);
              const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
              const isFullyFunded = pct >= 100;

              return (
                <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{
                    height: 160, background: "linear-gradient(135deg, #16a34a 0%, #1d4ed8 100%)",
                    borderRadius: "12px 12px 0 0", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {c.isUrgent && (
                      <span style={{
                        position: "absolute", top: 12, left: 12,
                        background: "#dc2626", color: "#fff", fontSize: "0.7rem",
                        fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99,
                      }}>
                        URGENT
                      </span>
                    )}
                    <span style={{
                      position: "absolute", top: 12, right: 12,
                      background: isFullyFunded ? "rgba(234,179,8,0.9)" : "rgba(255,255,255,0.9)",
                      color: isFullyFunded ? "#fff" : "#16a34a",
                      fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99,
                    }}>
                      {isFullyFunded ? "Fully Funded" : c.status}
                    </span>
                  </div>

                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.3rem", lineHeight: 1.3 }}>
                      {c.title}
                    </h3>
                    {c.location && (
                      <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                        <MapPin size={11} /> {c.location}
                      </p>
                    )}
                    <p style={{
                      fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, flex: 1,
                      marginBottom: "1rem", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {c.summary}
                    </p>

                    {goal > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>${raised.toLocaleString()}</span>
                          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>of ${goal.toLocaleString()} &middot; {pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/donate?case=${c.slug}`}
                      style={{
                        display: "block", textAlign: "center", padding: "0.7rem",
                        borderRadius: 12, fontWeight: 700, fontSize: "0.875rem",
                        textDecoration: "none", transition: "background 0.15s ease",
                        background: isFullyFunded ? "#f3f4f6" : "#16a34a",
                        color: isFullyFunded ? "#9ca3af" : "#fff",
                        cursor: isFullyFunded ? "default" : "pointer",
                      }}
                    >
                      {isFullyFunded ? "Fully Funded" : "Donate to This Case"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "4rem", background: "#fff", borderRadius: 20, padding: "3rem 2rem", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Don&apos;t see a specific case?
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Make a general donation and our team allocates it where it&apos;s needed most.
          </p>
          <Link href="/donate" className="btn-green btn" style={{ fontSize: "0.95rem", padding: "0.75rem 2rem" }}>
            Make a General Donation <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
