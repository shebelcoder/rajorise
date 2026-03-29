"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileEdit, Send, CheckCircle, XCircle, FolderOpen } from "lucide-react";

interface CaseItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  region: string;
  district: string | null;
  goalAmount: number;
  raisedAmount: number;
  updatedAt: string;
  createdAt: string;
  featuredImageUrl: string | null;
}

const FILTERS = [
  { label: "All", value: null },
  { label: "Drafts", value: "DRAFT", icon: FileEdit, color: "#8b949e" },
  { label: "Submitted", value: "PENDING", icon: Send, color: "#eab308" },
  { label: "Approved", value: "APPROVED", icon: CheckCircle, color: "#22c55e" },
  { label: "Rejected", value: "REJECTED", icon: XCircle, color: "#ef4444" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "#21262d", text: "#8b949e" },
  PENDING: { bg: "#2b1d0a", text: "#eab308" },
  APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
  REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
  FUNDING: { bg: "#0d1a2e", text: "#58a6ff" },
  COMPLETED: { bg: "#0f2c1a", text: "#22c55e" },
};

export default function CasesList({ cases, currentFilter }: { cases: CaseItem[]; currentFilter: string | null }) {
  const router = useRouter();

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {FILTERS.map(({ label, value, icon: Icon, color }) => {
          const isActive = currentFilter === value;
          return (
            <button
              key={label}
              onClick={() => router.push(value ? `/journalist/cases?status=${value}` : "/journalist/cases")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: "1px solid", cursor: "pointer",
                borderColor: isActive ? (color || "#58a6ff") : "#21262d",
                backgroundColor: isActive ? "#1f2937" : "#161b22",
                color: isActive ? (color || "#e6edf3") : "#8b949e",
                transition: "all 0.15s",
              }}
            >
              {Icon && <Icon size={13} style={{ color: color || "#8b949e" }} />}
              {label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        <Link
          href="/journalist/cases/new"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            backgroundColor: "#22c55e", color: "#fff", textDecoration: "none",
          }}
        >
          <Plus size={14} /> New Case
        </Link>
      </div>

      {/* Cases list */}
      {cases.length === 0 ? (
        <div style={{
          backgroundColor: "#161b22", border: "1px solid #21262d",
          borderRadius: 12, padding: "64px 20px", textAlign: "center",
        }}>
          <FolderOpen size={40} style={{ color: "#21262d", margin: "0 auto 16px" }} />
          <p style={{ color: "#8b949e", fontSize: 14, marginBottom: 4 }}>
            {currentFilter ? `No ${currentFilter.toLowerCase()} cases` : "No cases yet"}
          </p>
          <p style={{ color: "#484f58", fontSize: 12 }}>
            {currentFilter ? "Try a different filter" : "Create your first field report"}
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: "#161b22", border: "1px solid #21262d",
          borderRadius: 12, overflow: "hidden",
        }}>
          {cases.map((c, i) => {
            const sc = STATUS_STYLES[c.status] || STATUS_STYLES.DRAFT;
            const pct = c.goalAmount > 0 ? Math.round((c.raisedAmount / c.goalAmount) * 100) : 0;

            return (
              <Link
                key={c.id}
                href={c.status === "DRAFT" ? `/journalist/cases/${c.id}/edit` : `/journalist/cases/${c.id}/edit`}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 20px",
                  borderBottom: i < cases.length - 1 ? "1px solid #21262d" : "none",
                  textDecoration: "none", transition: "background 0.1s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "#e6edf3", fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.title || "Untitled case"}
                  </p>
                  <p style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>
                    {c.district ? `${c.district}, ` : ""}{c.region} · Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {c.goalAmount > 0 && c.status !== "DRAFT" && (
                  <div style={{ width: 80, textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "#8b949e", margin: 0 }}>${c.raisedAmount} / ${c.goalAmount}</p>
                    <div style={{ height: 3, backgroundColor: "#21262d", borderRadius: 99, marginTop: 4 }}>
                      <div style={{ height: "100%", backgroundColor: "#22c55e", borderRadius: 99, width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                )}

                <span style={{
                  backgroundColor: sc.bg, color: sc.text,
                  fontSize: 10, fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {c.status}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
