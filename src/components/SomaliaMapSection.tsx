"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SomaliaMap from "./SomaliaMap";
import { REGIONS } from "@/lib/locations";

export default function SomaliaMapSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Gedo");
  const regionInfo = REGIONS.find((r) => r.name === selectedRegion);

  return (
    <section style={{ padding: "5rem 0", backgroundColor: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 99, padding: "6px 16px", marginBottom: 16, fontSize: 13,
            fontWeight: 600, color: "#16a34a",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#16a34a", display: "inline-block" }} />
            Currently Operating in Gedo Region
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Where We Work
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 560, margin: "0 auto" }}>
            Starting in Gedo, expanding across all of Somalia. Click the map to explore regions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          {/* Map */}
          <div>
            <SomaliaMap
              onRegionClick={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </div>

          {/* Region detail panel */}
          <div>
            {regionInfo ? (
              <div style={{
                backgroundColor: "#f9fafb", borderRadius: 20, padding: "2rem",
                border: "1px solid #e5e7eb",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: "50%",
                    backgroundColor: regionInfo.active ? "#16a34a" : "#9ca3af",
                    display: "inline-block",
                  }} />
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                    {regionInfo.name} Region
                  </h3>
                </div>

                {regionInfo.active ? (
                  <>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 99, padding: "4px 12px", fontSize: 12,
                      fontWeight: 600, color: "#16a34a", marginBottom: 16,
                    }}>
                      Pilot Region — Active
                    </div>
                    <p style={{ color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                      Our field journalists are documenting cases across {regionInfo.districts.length} districts
                      in {regionInfo.name}. Every case is verified before going live.
                    </p>

                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                        Districts Covered
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {regionInfo.districts.map((d) => (
                          <span key={d.name} style={{
                            backgroundColor: "#fff", border: "1px solid #e5e7eb",
                            borderRadius: 8, padding: "4px 10px", fontSize: 12,
                            color: "#374151", fontWeight: 500,
                          }}>
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/projects"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        backgroundColor: "#16a34a", color: "#fff", padding: "10px 20px",
                        borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14,
                      }}
                    >
                      View Cases in {regionInfo.name} <ArrowRight size={16} />
                    </Link>
                  </>
                ) : (
                  <>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb",
                      borderRadius: 99, padding: "4px 12px", fontSize: 12,
                      fontWeight: 600, color: "#9ca3af", marginBottom: 16,
                    }}>
                      Expanding Soon
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                      We&apos;re preparing to bring RajoRise to {regionInfo.name} Region. Your donations to the
                      General Fund help us expand to new regions faster.
                    </p>
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                        Known Districts
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {regionInfo.districts.map((d) => (
                          <span key={d.name} style={{
                            backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
                            borderRadius: 8, padding: "4px 10px", fontSize: 12,
                            color: "#9ca3af", fontWeight: 500,
                          }}>
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/donate"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        backgroundColor: "#f3f4f6", color: "#374151", padding: "10px 20px",
                        borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      Donate to General Fund <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>
                Click a region on the map to see details
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
