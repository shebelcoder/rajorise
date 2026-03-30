import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Heart, Users, ArrowLeft } from "lucide-react";
import { formatLocation } from "@/lib/locations";

export default async function FamilyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = await prisma.family.findUnique({ where: { slug } });

  if (!family || !["APPROVED", "FUNDING"].includes(family.status)) notFound();

  const goal = Number(family.goalAmount);
  const raised = Number(family.raisedAmount);
  const pct = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const loc = formatLocation({ village: family.village, district: family.district, region: family.region, country: family.country });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{
        height: 320,
        background: family.imageUrl ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${family.imageUrl}) center/cover` : "linear-gradient(135deg, #ea580c, #dc2626)",
        display: "flex", alignItems: "flex-end", padding: "2rem",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", color: "#fff" }}>
          <Link href="/families" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Families
          </Link>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>{family.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><MapPin size={14} /> {loc}</span>
            {family.members && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}><Users size={14} /> {family.members} members</span>}
            {family.situation && <span style={{ fontSize: 14, backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 99 }}>{family.situation}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            {family.need && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626", fontWeight: 600 }}>
                Primary need: {family.need}
              </div>
            )}
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Story</h2>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{family.story}</p>
          </div>

          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
            {goal > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>${raised}</span>
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>of ${goal}</span>
                </div>
                <div style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 99 }}>
                  <div style={{ height: "100%", backgroundColor: pct >= 100 ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{pct}% funded</p>
              </div>
            )}
            <Link
              href={pct >= 100 ? "#" : `/donate?type=family&name=${encodeURIComponent(family.name)}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                backgroundColor: pct >= 100 ? "#fef9c3" : "#16a34a",
                color: pct >= 100 ? "#a16207" : "#fff", width: "100%",
              }}
            >
              {pct >= 100 ? "Fully Funded ✓" : <><Heart size={18} style={{ fill: "#fff" }} /> Support {family.name}</>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
