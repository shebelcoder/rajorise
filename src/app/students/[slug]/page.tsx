import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Heart, GraduationCap, ArrowLeft } from "lucide-react";
import { formatLocation } from "@/lib/locations";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await prisma.student.findUnique({ where: { slug }, select: { name: true, story: true, region: true } });
  if (!s) return { title: "Student Not Found" };
  return {
    title: `Sponsor ${s.name} — RajoRise`,
    description: s.story.slice(0, 160),
    openGraph: { title: `Sponsor ${s.name}`, description: s.story.slice(0, 160) },
  };
}

export default async function StudentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const student = await prisma.student.findUnique({ where: { slug } });

  if (!student || !["APPROVED", "FUNDING"].includes(student.status)) notFound();

  const goal = Number(student.goalAmount);
  const raised = Number(student.raisedAmount);
  const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const loc = formatLocation({ village: student.village, district: student.district, region: student.region, country: student.country });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero */}
      <div style={{
        height: 320,
        background: student.imageUrl ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${student.imageUrl}) center/cover` : "linear-gradient(135deg, #16a34a, #1d4ed8)",
        display: "flex", alignItems: "flex-end", padding: "2rem",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", color: "#fff" }}>
          <Link href="/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Students
          </Link>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>{student.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><MapPin size={14} /> {loc}</span>
            {student.age && <span style={{ fontSize: 14 }}>Age {student.age}</span>}
            {student.grade && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><GraduationCap size={14} /> {student.grade}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* Story */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Story</h2>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{student.story}</p>
          </div>

          {/* Sponsor card */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
            {goal > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>${raised}</span>
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>of ${goal}/yr</span>
                </div>
                <div style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                  <div style={{ height: "100%", backgroundColor: pct >= 100 ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{pct}% funded</p>
              </div>
            )}

            <Link
              href={pct >= 100 ? "#" : `/donate?type=student&name=${encodeURIComponent(student.name)}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                backgroundColor: pct >= 100 ? "#fef9c3" : "#16a34a",
                color: pct >= 100 ? "#a16207" : "#fff", width: "100%",
              }}
            >
              {pct >= 100 ? "Fully Sponsored ✓" : <><Heart size={18} style={{ fill: "#fff" }} /> Sponsor {student.name}</>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
