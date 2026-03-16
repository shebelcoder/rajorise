import Link from "next/link";
import { MapPin, Users, ArrowRight, Droplets, UtensilsCrossed, BookOpen, Heart, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/prisma";

const ICON_MAP: Record<string, React.ElementType> = {
  WATER:     Droplets,
  FOOD:      UtensilsCrossed,
  EDUCATION: BookOpen,
  MEDICAL:   Stethoscope,
  EMERGENCY: Heart,
};

const IMG_CLASS: Record<string, string> = {
  WATER:     "img-water",
  FOOD:      "img-food",
  EDUCATION: "img-education",
  MEDICAL:   "img-medical",
  EMERGENCY: "img-emergency",
};

const EMOJI: Record<string, string> = {
  WATER:     "💧",
  FOOD:      "🌾",
  EDUCATION: "📚",
  MEDICAL:   "🏥",
  EMERGENCY: "🚨",
};

const CAT_BADGE: Record<string, string> = {
  WATER:     "badge-blue",
  FOOD:      "badge-green",
  EDUCATION: "badge-gold",
  MEDICAL:   "badge-red",
  EMERGENCY: "badge-red",
};

export const revalidate = 60; // revalidate every 60 seconds

async function getCases() {
  try {
    return await prisma.report.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        location: true,
        category: true,
        story: true,
        familiesAffected: true,
        amountNeeded: true,
        raised: true,
      },
    });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [totalRaisedResult, totalFamilies, activeCount] = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.report.aggregate({ where: { status: "APPROVED" }, _sum: { familiesAffected: true } }),
      prisma.report.count({ where: { status: "APPROVED" } }),
    ]);
    return {
      totalRaised: totalRaisedResult._sum.amount ?? 0,
      familiesHelped: totalFamilies._sum.familiesAffected ?? 0,
      activeProjects: activeCount,
    };
  } catch {
    return { totalRaised: 0, familiesHelped: 0, activeProjects: 0 };
  }
}

export default async function ProjectsPage() {
  const [cases, stats] = await Promise.all([getCases(), getStats()]);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>

      <div className="hero-band">
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
            Active Projects
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto" }}>
            Every project is verified by our admin team and documented by field journalists.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
          {[
            { label: "Active Projects", value: stats.activeProjects.toString() },
            { label: "Total Raised",    value: "$" + stats.totalRaised.toLocaleString() },
            { label: "Families Helped", value: stats.familiesHelped.toLocaleString() + "+" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.4rem" }}>{label}</p>
            </div>
          ))}
        </div>

        {cases.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No active projects right now.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — our journalists are in the field.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {cases.map((p) => {
              const pct = p.amountNeeded > 0
                ? Math.min(Math.round((p.raised / p.amountNeeded) * 100), 100)
                : 0;
              const Icon = ICON_MAP[p.category] ?? Heart;
              const isFullyFunded = pct >= 100;

              return (
                <div key={p.id} className="card" style={{ display: "flex", flexDirection: "column" }}>

                  <div className={IMG_CLASS[p.category] ?? "img-emergency"} style={{ height: 180, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}>
                      {EMOJI[p.category] ?? "❤️"}
                    </span>
                    <Icon style={{ position: "absolute", bottom: 12, right: 12, width: 18, height: 18, color: "rgba(255,255,255,0.5)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: "0.4rem" }}>
                      <span className={`badge ${CAT_BADGE[p.category] ?? "badge-red"}`} style={{ background: "rgba(255,255,255,0.92)" }}>
                        {p.category}
                      </span>
                      {isFullyFunded
                        ? <span className="badge badge-gold" style={{ background: "rgba(255,255,255,0.92)" }}>Fully Funded</span>
                        : <span className="badge badge-green" style={{ background: "rgba(255,255,255,0.92)" }}>Active</span>
                      }
                    </div>
                    {p.familiesAffected > 0 && (
                      <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: 99 }}>
                        <Users size={12} /> {p.familiesAffected} families
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.3rem", lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                      <MapPin size={11} /> {p.location}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, flex: 1, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.story}
                    </p>

                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>${p.raised.toLocaleString()}</span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>of ${p.amountNeeded.toLocaleString()} &middot; {pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <Link
                      href={`/donate?project=${p.id}`}
                      style={{
                        display: "block", textAlign: "center", padding: "0.7rem",
                        borderRadius: 12, fontWeight: 700, fontSize: "0.875rem",
                        textDecoration: "none", transition: "background 0.15s ease",
                        background: isFullyFunded ? "#f3f4f6" : "#16a34a",
                        color: isFullyFunded ? "#9ca3af" : "#fff",
                        cursor: isFullyFunded ? "default" : "pointer",
                      }}
                    >
                      {isFullyFunded ? "Fully Funded ✓" : "Donate to This Project →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: "4rem", background: "#fff", borderRadius: 20, padding: "3rem 2rem", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Don&apos;t see a specific project?
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
