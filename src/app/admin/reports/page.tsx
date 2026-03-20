"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye, MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";

type Report = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  location: string | null;
  status: string;
  goalAmount: string;
  raisedAmount: string;
  isUrgent: boolean;
  createdAt: string;
};

const FILTERS = ["All", "Pending", "Approved", "Rejected"] as const;
type Filter = (typeof FILTERS)[number];

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING:  { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  APPROVED: { bg: "rgba(22,163,74,0.15)", text: "#16a34a" },
  REJECTED: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  FUNDING:  { bg: "rgba(59,130,246,0.15)", text: "#3b82f6" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error(await res.text());
      setReports(await res.json());
    } catch (e) {
      setError("Failed to load reports. " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActing(id + action);
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: action === "approve" ? "APPROVED" : "REJECTED" } : r
        )
      );
    } catch {
      alert("Action failed. Please try again.");
    } finally {
      setActing(null);
    }
  };

  const visible = reports.filter((r) =>
    filter === "All" ? true : r.status === filter.toUpperCase()
  );

  const counts = {
    All: reports.length,
    Pending: reports.filter((r) => r.status === "PENDING").length,
    Approved: reports.filter((r) => r.status === "APPROVED").length,
    Rejected: reports.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", padding: "2.5rem 1rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Field Reports</h1>
            <p style={{ color: "#9ca3af", marginTop: "0.25rem", fontSize: "0.875rem" }}>Review and approve journalist submissions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={fetchReports} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#d1d5db", cursor: "pointer", fontSize: "0.8rem" }}>
              <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
            </button>
            <Link href="/admin" style={{ fontSize: "0.8rem", color: "#9ca3af", textDecoration: "none" }}>Back to Dashboard</Link>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.5rem 1rem", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: filter === f ? "#16a34a" : "#1f2937",
                color: filter === f ? "#fff" : "#9ca3af",
              }}
            >
              {f}
              <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(0,0,0,0.2)", padding: "0.1rem 0.4rem", borderRadius: 99 }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "0.75rem", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#6b7280" }}>Loading reports...</div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#6b7280" }}>
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}reports found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {visible.map((r) => {
              const sc = statusColors[r.status] || statusColors.PENDING;
              return (
                <div key={r.id} style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.text, padding: "0.15rem 0.6rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700 }}>
                          {r.status}
                        </span>
                        {r.isUrgent && (
                          <span style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", padding: "0.15rem 0.6rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700 }}>
                            URGENT
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: "0.25rem" }}>{r.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8rem", color: "#6b7280", flexWrap: "wrap" }}>
                        {r.location && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <MapPin style={{ width: 12, height: 12 }} />{r.location}
                          </span>
                        )}
                        <span>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span>Goal: ${Number(r.goalAmount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <Link href={`/cases/${r.slug}`} style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.75rem", backgroundColor: "#1f2937", borderRadius: "0.75rem", fontSize: "0.8rem", color: "#d1d5db", textDecoration: "none" }}>
                        <Eye style={{ width: 14, height: 14 }} /> View
                      </Link>
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAction(r.id, "approve")}
                            disabled={acting === r.id + "approve"}
                            style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.75rem", backgroundColor: "rgba(22,163,74,0.2)", border: "1px solid rgba(22,163,74,0.4)", borderRadius: "0.75rem", fontSize: "0.8rem", color: "#4ade80", cursor: "pointer", opacity: acting === r.id + "approve" ? 0.5 : 1 }}
                          >
                            <CheckCircle style={{ width: 14, height: 14 }} />
                            {acting === r.id + "approve" ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(r.id, "reject")}
                            disabled={acting === r.id + "reject"}
                            style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.75rem", backgroundColor: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "0.75rem", fontSize: "0.8rem", color: "#f87171", cursor: "pointer", opacity: acting === r.id + "reject" ? 0.5 : 1 }}
                          >
                            <XCircle style={{ width: 14, height: 14 }} />
                            {acting === r.id + "reject" ? "..." : "Reject"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
