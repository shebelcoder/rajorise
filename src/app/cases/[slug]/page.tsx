import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Heart, ArrowLeft, Calendar, Users } from "lucide-react";
import { formatLocation } from "@/lib/locations";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await prisma.report.findUnique({ where: { slug }, select: { title: true, summary: true } });
  if (!r) return { title: "Case Not Found" };
  return {
    title: `${r.title} — RajoRise`,
    description: r.summary.slice(0, 160),
    openGraph: { title: r.title, description: r.summary.slice(0, 160) },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await prisma.report.findUnique({ where: { slug } });

  if (!report || !["APPROVED", "FUNDING", "COMPLETED"].includes(report.status)) notFound();

  const goal = Number(report.goalAmount);
  const raised = Number(report.raisedAmount);
  const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const loc = formatLocation({ village: report.village, district: report.district, region: report.region, country: report.country });
  const storyImage = report.mediaUrls?.[0] || null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero banner */}
      <div style={{
        height: 280,
        background: report.featuredImageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${report.featuredImageUrl}) center/cover` : "linear-gradient(135deg, #16a34a, #1d4ed8)",
        display: "flex", alignItems: "flex-end", padding: "2rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", color: "#fff" }}>
          <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Cases
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{report.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><MapPin size={14} /> {loc}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><Calendar size={14} /> {new Date(report.createdAt).toLocaleDateString()}</span>
            {report.isUrgent && <span style={{ backgroundColor: "#dc2626", padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>URGENT</span>}
          </div>
        </div>
      </div>

      {/* Content: Story + Image + Donate */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: storyImage ? "1fr 400px" : "2fr 1fr", gap: 32 }}>

          {/* Left: Story text */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Full Report</h2>
            <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{report.fullStory}</p>

            {/* Donate CTA at bottom of story */}
            <div style={{ marginTop: 32, backgroundColor: "#f0fdf4", borderRadius: 16, border: "1px solid #bbf7d0", padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Help this community</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Every dollar goes directly to this case</p>
              </div>
              <Link
                href={pct >= 100 ? "#" : `/donate?case=${report.slug}`}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  backgroundColor: pct >= 100 ? "#f3f4f6" : "#16a34a",
                  color: pct >= 100 ? "#9ca3af" : "#fff", whiteSpace: "nowrap",
                }}
              >
                {pct >= 100 ? "Fully Funded" : <><Heart size={18} style={{ fill: "#fff" }} /> Donate Now</>}
              </Link>
            </div>
          </div>

          {/* Right: Image + Donate card */}
          <div>
            {/* Story image — fully visible */}
            {storyImage && (
              <div style={{ marginBottom: 20, borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                <img
                  src={storyImage}
                  alt={report.title}
                  style={{ width: "100%", height: "auto", display: "block", maxHeight: 500, objectFit: "cover" }}
                />
              </div>
            )}

            {/* Donate card */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, position: "sticky", top: 80 }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, marginBottom: 16,
                backgroundColor: report.status === "COMPLETED" ? "#fef9c3" : "#f0fdf4",
                color: report.status === "COMPLETED" ? "#a16207" : "#16a34a",
              }}>
                {report.status === "COMPLETED" ? "Completed" : "Active"}
              </span>

              {goal > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>${raised.toLocaleString()}</span>
                    <span style={{ fontSize: 14, color: "#9ca3af", alignSelf: "flex-end" }}>of ${goal.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 10, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                    <div style={{ height: "100%", backgroundColor: pct >= 100 ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%`, transition: "width 0.5s" }} />
                  </div>
                  <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>{pct}% funded</p>
                </div>
              )}

              <Link
                href={pct >= 100 ? "#" : `/donate?case=${report.slug}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: 16, borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none",
                  backgroundColor: pct >= 100 ? "#f3f4f6" : "#16a34a",
                  color: pct >= 100 ? "#9ca3af" : "#fff", width: "100%",
                }}
              >
                {pct >= 100 ? "Fully Funded" : <><Heart size={18} style={{ fill: "#fff" }} /> Donate to This Case</>}
              </Link>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#6b7280" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} style={{ color: "#16a34a" }} /> {loc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={12} style={{ color: "#16a34a" }} /> {new Date(report.createdAt).toLocaleDateString()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={12} style={{ color: "#16a34a" }} /> Verified by RajoRise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
