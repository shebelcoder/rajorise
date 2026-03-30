import Link from "next/link";
import { MapPin, GraduationCap, ArrowRight, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatLocation } from "@/lib/locations";

export const revalidate = 60;

async function getStudents() {
  try {
    return await prisma.student.findMany({
      where: { status: { in: ["APPROVED", "FUNDING"] }, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero */}
      <div className="gradient-hero" style={{ color: "#fff", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
            <GraduationCap style={{ width: 16, height: 16 }} /> Sponsor a student — change a future
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
            Students Needing Sponsors
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem" }}>
            $120 covers one full year of school. You receive progress updates throughout the year.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>
        {/* How it works */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "2rem", marginBottom: "3rem", textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, color: "#111827", fontSize: "1.25rem", marginBottom: 24 }}>How Sponsorship Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { step: "1", title: "Choose a Student", desc: "Browse verified profiles" },
              { step: "2", title: "Sponsor Them", desc: "Pay securely via Stripe" },
              { step: "3", title: "Track Progress", desc: "Updates as they grow" },
              { step: "4", title: "See Impact", desc: "Their success is yours" },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{step}</div>
                <p style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{title}</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {students.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>No students available for sponsorship right now.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — our journalists are documenting new cases.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {students.map((s) => {
              const goal = Number(s.goalAmount);
              const raised = Number(s.raisedAmount);
              const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
              const isFullyFunded = pct >= 100;
              const loc = formatLocation({ village: s.village, district: s.district, region: s.region, country: s.country });

              return (
                <div key={s.id} style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Image/header */}
                  <div style={{
                    height: 180,
                    background: s.imageUrl ? `url(${s.imageUrl}) center/cover` : "linear-gradient(135deg, #16a34a, #1d4ed8)",
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {!s.imageUrl && <span style={{ fontSize: 60 }}>👦🏾</span>}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                      {s.grade && (
                        <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{s.grade}</span>
                      )}
                      <span style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: isFullyFunded ? "#ca8a04" : "#16a34a",
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                      }}>
                        {isFullyFunded ? "Sponsored ✓" : "Needs Sponsor"}
                      </span>
                    </div>
                    {s.age && (
                      <span style={{ position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                        Age {s.age}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                    <Link href={`/students/${s.slug}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontWeight: 700, color: "#111827", fontSize: "1.1rem", marginBottom: 4 }}>{s.name}</h3>
                    </Link>
                    <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                      <MapPin size={11} /> {loc}
                    </p>
                    <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, flex: 1, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {s.story}
                    </p>

                    {goal > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 14 }}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>${raised} raised</span>
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>of ${goal}/yr · {pct}%</span>
                        </div>
                        <div style={{ height: 6, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                          <div style={{ height: "100%", backgroundColor: isFullyFunded ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    <Link
                      href={isFullyFunded ? "#" : `/donate?type=student&name=${encodeURIComponent(s.name)}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14,
                        textDecoration: "none",
                        backgroundColor: isFullyFunded ? "#fef9c3" : "#16a34a",
                        color: isFullyFunded ? "#a16207" : "#fff",
                        border: isFullyFunded ? "1px solid #fde68a" : "none",
                      }}
                    >
                      {isFullyFunded ? "Fully Sponsored ✓" : <><Heart size={16} style={{ fill: "#fff" }} /> Sponsor {s.name}</>}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="gradient-hero" style={{ marginTop: "3rem", color: "#fff", borderRadius: 20, padding: "3rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 12 }}>Can&apos;t choose just one?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 24 }}>Make a general education donation — we distribute it among the most urgent cases.</p>
          <Link href="/donate?category=education" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#eab308", color: "#000", padding: "12px 24px",
            borderRadius: 12, fontWeight: 700, textDecoration: "none",
          }}>
            Support Education Fund <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
