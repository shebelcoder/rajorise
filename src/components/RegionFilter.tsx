"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { REGIONS } from "@/lib/locations";

interface CaseItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  location: string | null;
  country: string;
  region: string;
  district: string | null;
  village: string | null;
  status: string;
  goalAmount: number;
  raisedAmount: number;
  isUrgent: boolean;
  featuredImageUrl: string | null;
  locationFormatted: string;
}

export default function RegionFilter({ cases }: { cases: CaseItem[] }) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const activeRegions = REGIONS.filter((r) => r.active).map((r) => r.name);
  const filteredCases = selectedRegion
    ? cases.filter((c) => c.region === selectedRegion)
    : cases;

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedRegion(null)}
          style={{
            padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: "1px solid",
            borderColor: !selectedRegion ? "#16a34a" : "#e5e7eb",
            backgroundColor: !selectedRegion ? "#f0fdf4" : "#fff",
            color: !selectedRegion ? "#16a34a" : "#6b7280",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          All Regions
        </button>
        {activeRegions.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedRegion(name)}
            style={{
              padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600,
              border: "1px solid",
              borderColor: selectedRegion === name ? "#16a34a" : "#e5e7eb",
              backgroundColor: selectedRegion === name ? "#f0fdf4" : "#fff",
              color: selectedRegion === name ? "#16a34a" : "#6b7280",
              cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#16a34a", display: "inline-block" }} />
            {name}
          </button>
        ))}
        {REGIONS.filter((r) => !r.active).slice(0, 3).map((r) => (
          <span
            key={r.name}
            style={{
              padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
              border: "1px solid #e5e7eb", backgroundColor: "#f9fafb",
              color: "#d1d5db", cursor: "default",
            }}
          >
            {r.name} (soon)
          </span>
        ))}
      </div>

      {/* Cases grid */}
      {filteredCases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b7280" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No active cases in this region.</p>
          <p style={{ fontSize: "0.9rem" }}>Check back soon — our journalists are in the field.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredCases.map((c) => {
            const pct = c.goalAmount > 0 ? Math.min(Math.round((c.raisedAmount / c.goalAmount) * 100), 100) : 0;
            const isFullyFunded = pct >= 100;

            return (
              <div key={c.id} style={{
                backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,.04)", display: "flex", flexDirection: "column",
                overflow: "hidden",
              }}>
                <div style={{
                  height: 160, background: "linear-gradient(135deg, #16a34a 0%, #1d4ed8 100%)",
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
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
                  {/* Pilot region badge */}
                  <span style={{
                    position: "absolute", bottom: 12, left: 12,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                    color: "#4ade80", fontSize: "0.65rem",
                    fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block" }} />
                    Pilot Region: {c.region}
                  </span>
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
                  <Link href={`/cases/${c.slug}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.3rem", lineHeight: 1.3 }}>
                      {c.title}
                    </h3>
                  </Link>
                  <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                    <MapPin size={11} /> {c.locationFormatted || c.location || `${c.region}, ${c.country}`}
                  </p>
                  <p style={{
                    fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, flex: 1,
                    marginBottom: "1rem", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {c.summary}
                  </p>

                  {c.goalAmount > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>${c.raisedAmount.toLocaleString()}</span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>of ${c.goalAmount.toLocaleString()} &middot; {pct}%</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", backgroundColor: isFullyFunded ? "#eab308" : "#16a34a", borderRadius: 99, width: `${pct}%`, transition: "width 0.5s ease" }} />
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
    </>
  );
}
