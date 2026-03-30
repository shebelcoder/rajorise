import Link from "next/link";
import { MapPin, Users, Heart, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatLocation } from "@/lib/locations";

export const revalidate = 60;

async function getFamilies() {
  try {
    return await prisma.family.findMany({
      where: { status: { in: ["APPROVED", "FUNDING"] }, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function FamiliesPage() {
  const families = await getFamilies();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div className="gradient-hero" style={{ color: "#fff", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
            <Users style={{ width: 16, height: 16 }} /> Support families in need
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
            Families Needing Help
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem" }}>
            Every family has a story. Your donation provides food, shelter, and hope.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {families.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>No families listed right now.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — our journalists are documenting new cases.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {families.map((f) => {
              const goal = Number(f.goalAmount);
              const raised = Number(f.raisedAmount);
              const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
              const isFullyFunded = pct >= 100;
              const loc = formatLocation({ village: f.village, district: f.district, region: f.region, country: f.country });

              return (
                <div key={f.id} style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{
                    height: 180,
                    background: f.imageUrl ? `url(${f.imageUrl}) center/cover` : "linear-gradient(135deg, #ea580c, #dc2626)",
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {!f.imageUrl && <span style={{ fontSize: 60 }}>👨‍👩‍👧‍👦</span>}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                      {f.need && (
                        <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#ea580c", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{f.need}</span>
                      )}
                      <span style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: isFullyFunded ? "#ca8a04" : "#16a34a",
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                      }}>
                        {isFullyFunded ? "Fully Funded ✓" : "Active"}
                      </span>
                    </div>
                    {f.members && (
                      <span style={{ position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={11} /> {f.members} members
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontWeight: 700, color: "#111827", fontSize: "1.1rem", marginBottom: 4 }}>{f.name}</h3>
                    <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                      <MapPin size={11} /> {loc}
                    </p>
                    {f.situation && (
                      <p style={{ fontSize: 12, color: "#ea580c", fontWeight: 600, marginBottom: 12 }}>{f.situation}</p>
                    )}
                    <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, flex: 1, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {f.story}
                    </p>

                    {goal > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 14 }}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>${raised} raised</span>
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>of ${goal} · {pct}%</span>
                        </div>
                        <div style={{ height: 6, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                          <div style={{ height: "100%", backgroundColor: isFullyFunded ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    <Link
                      href={isFullyFunded ? "#" : `/donate?type=family&name=${encodeURIComponent(f.name)}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none",
                        backgroundColor: isFullyFunded ? "#fef9c3" : "#16a34a",
                        color: isFullyFunded ? "#a16207" : "#fff",
                        border: isFullyFunded ? "1px solid #fde68a" : "none",
                      }}
                    >
                      {isFullyFunded ? "Fully Funded ✓" : <><Heart size={16} style={{ fill: "#fff" }} /> Support {f.name}</>}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="gradient-hero" style={{ marginTop: "3rem", color: "#fff", borderRadius: 20, padding: "3rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 12 }}>Help more families</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 24 }}>General donations are distributed to the families that need it most.</p>
          <Link href="/donate?category=food" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#eab308", color: "#000", padding: "12px 24px",
            borderRadius: 12, fontWeight: 700, textDecoration: "none",
          }}>
            Support Families Fund <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
