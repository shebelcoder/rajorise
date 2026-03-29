"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/locations";

// Simplified SVG paths for Somalia's 18 regions
// Approximate positions for an artistic/functional map
const REGION_PATHS: Record<string, { d: string; cx: number; cy: number }> = {
  "Awdal":            { d: "M80,45 L120,35 L130,55 L95,65 Z",                cx: 105, cy: 50 },
  "Woqooyi Galbeed":  { d: "M95,65 L130,55 L145,60 L150,85 L105,90 Z",      cx: 125, cy: 73 },
  "Togdheer":         { d: "M130,55 L175,45 L185,75 L150,85 Z",              cx: 160, cy: 65 },
  "Sanaag":           { d: "M175,45 L240,30 L250,55 L185,75 Z",              cx: 212, cy: 50 },
  "Sool":             { d: "M185,75 L250,55 L255,90 L200,100 Z",             cx: 222, cy: 80 },
  "Bari":             { d: "M240,30 L310,15 L320,40 L300,80 L255,90 L250,55 Z", cx: 280, cy: 50 },
  "Nugaal":           { d: "M255,90 L300,80 L305,130 L240,135 L200,100 Z",   cx: 260, cy: 108 },
  "Mudug":            { d: "M200,100 L240,135 L305,130 L310,185 L210,190 L170,150 Z", cx: 245, cy: 155 },
  "Galguduud":        { d: "M170,150 L210,190 L200,230 L140,220 L135,170 Z", cx: 170, cy: 192 },
  "Hiiraan":          { d: "M105,190 L135,170 L140,220 L115,235 Z",          cx: 123, cy: 205 },
  "Shabelle Dhexe":   { d: "M140,220 L200,230 L195,260 L150,270 L115,235 Z", cx: 160, cy: 243 },
  "Banadir":          { d: "M150,270 L175,268 L178,280 L155,282 Z",          cx: 165, cy: 275 },
  "Shabelle Hoose":   { d: "M115,235 L150,270 L155,282 L140,310 L95,295 Z",  cx: 130, cy: 278 },
  "Bay":              { d: "M60,220 L105,190 L115,235 L95,295 L55,270 Z",    cx: 85, cy: 245 },
  "Bakool":           { d: "M60,220 L105,190 L135,170 L150,185 L105,190 Z",  cx: 92, cy: 185 },
  "Gedo":             { d: "M30,250 L60,220 L55,270 L95,295 L85,340 L35,320 Z", cx: 60, cy: 285 },
  "Jubbada Dhexe":    { d: "M55,270 L95,295 L100,350 L65,360 L40,330 Z",     cx: 72, cy: 320 },
  "Jubbada Hoose":    { d: "M65,360 L100,350 L110,400 L80,415 L50,390 Z",    cx: 80, cy: 385 },
};

interface SomaliaMapProps {
  onRegionClick?: (region: string) => void;
  selectedRegion?: string | null;
  showStats?: boolean;
}

export default function SomaliaMap({ onRegionClick, selectedRegion, showStats = true }: SomaliaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const getRegionInfo = (name: string) => REGIONS.find((r) => r.name === name);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <svg
        viewBox="0 50 340 400"
        style={{ width: "100%", height: "auto" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="340" height="450" fill="transparent" />

        {/* Region paths */}
        {Object.entries(REGION_PATHS).map(([name, { d, cx, cy }]) => {
          const info = getRegionInfo(name);
          const isActive = info?.active;
          const isHovered = hovered === name;
          const isSelected = selectedRegion === name;

          return (
            <g key={name}>
              <path
                d={d}
                fill={
                  isActive
                    ? isSelected || isHovered
                      ? "#16a34a"
                      : "#22c55e"
                    : isHovered
                    ? "#d1d5db"
                    : "#e5e7eb"
                }
                stroke={isActive ? "#15803d" : "#9ca3af"}
                strokeWidth={isActive ? 2 : 1}
                style={{
                  cursor: "pointer",
                  transition: "fill 0.2s, transform 0.2s",
                  filter: isActive && (isHovered || isSelected) ? "drop-shadow(0 2px 6px rgba(22,163,74,0.4))" : "none",
                }}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onRegionClick?.(name)}
              />
              {/* Region label */}
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: isActive ? 9 : 7,
                  fontWeight: isActive ? 800 : 500,
                  fill: isActive ? "#fff" : "#6b7280",
                  pointerEvents: "none",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {name.length > 12 ? name.slice(0, 10) + "…" : name}
              </text>
              {/* Active pulse indicator */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy - 14}
                  r={4}
                  fill="#16a34a"
                  stroke="#fff"
                  strokeWidth={1.5}
                >
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Indian Ocean label */}
        <text x="290" y="250" style={{ fontSize: 10, fill: "#93c5fd", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          Indian
        </text>
        <text x="295" y="265" style={{ fontSize: 10, fill: "#93c5fd", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          Ocean
        </text>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255,255,255,0.97)",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: 180,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, color: "#111827", fontSize: 14, marginBottom: 4 }}>
            {hovered} Region
          </div>
          {getRegionInfo(hovered)?.active ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#16a34a", display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Active — Pilot Region</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {getRegionInfo(hovered)?.districts.length} districts covered
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#9ca3af", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Coming soon</span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {showStats && (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Active Region</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#e5e7eb", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Expanding Soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
