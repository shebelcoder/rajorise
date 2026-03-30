import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Heart, ArrowLeft, Calendar } from "lucide-react";
import { formatLocation } from "@/lib/locations";

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await prisma.report.findUnique({ where: { slug } });

  if (!report || !["APPROVED", "FUNDING", "COMPLETED"].includes(report.status)) notFound();

  const goal = Number(report.goalAmount);
  const raised = Number(report.raisedAmount);
  const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const loc = formatLocation({ village: report.village, district: report.district, region: report.region, country: report.country });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{
        height: 320,
        background: report.featuredImageUrl ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${report.featuredImageUrl}) center/cover` : "linear-gradient(135deg, #16a34a, #1d4ed8)",
        display: "flex", alignItems: "flex-end", padding: "2rem",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", color: "#fff" }}>
          <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Cases
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{report.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><MapPin size={14} /> {loc}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><Calendar size={14} /> {new Date(report.createdAt).toLocaleDateString()}</span>
            {report.isUrgent && <span style={{ backgroundColor: "#dc2626", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>URGENT</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Full Report</h2>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{report.fullStory}</p>
          </div>

          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
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
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>${raised.toLocaleString()}</span>
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>of ${goal.toLocaleString()}</span>
                </div>
                <div style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                  <div style={{ height: "100%", backgroundColor: pct >= 100 ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{pct}% funded</p>
              </div>
            )}

            <Link
              href={pct >= 100 ? "#" : `/donate?case=${report.slug}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                backgroundColor: pct >= 100 ? "#f3f4f6" : "#16a34a",
                color: pct >= 100 ? "#9ca3af" : "#fff", width: "100%",
              }}
            >
              {pct >= 100 ? "Fully Funded" : <><Heart size={18} style={{ fill: "#fff" }} /> Donate to This Case</>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
