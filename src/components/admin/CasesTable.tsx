"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Pencil } from "lucide-react";

interface CaseItem {
  id: string; title: string; slug: string; status: string; region: string;
  district: string | null; goalAmount: number; raisedAmount: number;
  isUrgent: boolean; journalistId: string; createdAt: string; updatedAt: string;
  rejectedReason: string | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "#21262d", text: "#8b949e" },
  PENDING: { bg: "#2b1d0a", text: "#eab308" },
  APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
  REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
  FUNDING: { bg: "#0d1a2e", text: "#58a6ff" },
  COMPLETED: { bg: "#0f2c1a", text: "#22c55e" },
};

export default function AdminCasesTable({ cases }: { cases: CaseItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>("PENDING");
  const [acting, setActing] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const filtered = filter ? cases.filter((c) => c.status === filter) : cases;

  const reviewCase = async (id: string, action: "approve" | "reject", rejectReason?: string) => {
    setActing(id);
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: rejectReason }),
    });
    setActing(null);
    setRejectId(null);
    setReason("");
    router.refresh();
  };

  const filters = [
    { label: "Pending", value: "PENDING", count: cases.filter((c) => c.status === "PENDING").length },
    { label: "All", value: null, count: cases.length },
    { label: "Approved", value: "APPROVED", count: cases.filter((c) => c.status === "APPROVED").length },
    { label: "Rejected", value: "REJECTED", count: cases.filter((c) => c.status === "REJECTED").length },
    { label: "Draft", value: "DRAFT", count: cases.filter((c) => c.status === "DRAFT").length },
  ];

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {filters.map(({ label, value, count }) => (
          <button key={label} onClick={() => setFilter(value)}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              border: "1px solid", cursor: "pointer",
              borderColor: filter === value ? "#f59e0b" : "#1c2333",
              backgroundColor: filter === value ? "#2b1d0a" : "#111827",
              color: filter === value ? "#f59e0b" : "#6b7280",
            }}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: "#111827", border: "1px solid #1c2333", borderRadius: 10, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <p style={{ padding: "48px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>
            No cases with this status
          </p>
        ) : (
          filtered.map((c, i) => {
            const sc = STATUS_STYLES[c.status] || STATUS_STYLES.DRAFT;
            return (
              <div key={c.id} style={{ padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1c2333" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                      {c.isUrgent && <span style={{ fontSize: 9, fontWeight: 700, backgroundColor: "#2c0f0f", color: "#ef4444", padding: "1px 6px", borderRadius: 99 }}>URGENT</span>}
                    </div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                      {c.district ? `${c.district}, ` : ""}{c.region} · ${c.goalAmount.toLocaleString()} goal · {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: sc.bg, color: sc.text, textTransform: "uppercase" }}>
                    {c.status}
                  </span>

                  <Link href={`/admin/cases/${c.id}/edit`} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: "#21262d", color: "#e6edf3", border: "1px solid #30363d", textDecoration: "none" }}>
                    <Pencil size={12} /> Edit
                  </Link>

                  {c.status === "PENDING" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => reviewCase(c.id, "approve")}
                        disabled={acting === c.id}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#0f2c1a", color: "#22c55e", border: "1px solid #238636", cursor: "pointer" }}
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => setRejectId(c.id)}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#2c0f0f", color: "#ef4444", border: "1px solid #da3633", cursor: "pointer" }}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Reject reason modal */}
                {rejectId === c.id && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      style={{ flex: 1, padding: "6px 10px", backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontSize: 12, outline: "none" }}
                    />
                    <button
                      onClick={() => reviewCase(c.id, "reject", reason)}
                      style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => { setRejectId(null); setReason(""); }}
                      style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, backgroundColor: "#21262d", color: "#8b949e", border: "none", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
