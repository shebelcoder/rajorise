"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface Item {
  id: string;
  name: string;
  status: string;
  subtitle: string;
  goalAmount: number;
  raisedAmount: number;
  isActive: boolean;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "#21262d", text: "#8b949e" },
  PENDING: { bg: "#2b1d0a", text: "#eab308" },
  APPROVED: { bg: "#0f2c1a", text: "#22c55e" },
  REJECTED: { bg: "#2c0f0f", text: "#ef4444" },
  FUNDING: { bg: "#0d1a2e", text: "#58a6ff" },
};

export default function AdminItemsTable({ items, type }: { items: Item[]; type: "students" | "families" }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>("PENDING");
  const [acting, setActing] = useState<string | null>(null);

  const filtered = filter ? items.filter((i) => i.status === filter) : items;

  const review = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    await fetch(`/api/admin/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setActing(null);
    router.refresh();
  };

  const filters = [
    { label: "Pending", value: "PENDING", count: items.filter((i) => i.status === "PENDING").length },
    { label: "All", value: null, count: items.length },
    { label: "Approved", value: "APPROVED", count: items.filter((i) => i.status === "APPROVED").length },
    { label: "Draft", value: "DRAFT", count: items.filter((i) => i.status === "DRAFT").length },
    { label: "Rejected", value: "REJECTED", count: items.filter((i) => i.status === "REJECTED").length },
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
          <p style={{ padding: "48px 20px", textAlign: "center", color: "#6b7280", fontSize: 13 }}>No items</p>
        ) : (
          filtered.map((item, i) => {
            const sc = STATUS_STYLES[item.status] || STATUS_STYLES.DRAFT;
            return (
              <div key={item.id} style={{ padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1c2333" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.subtitle} · ${item.goalAmount} goal · {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: sc.bg, color: sc.text, textTransform: "uppercase" }}>
                    {item.status}
                  </span>
                  {item.status === "PENDING" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => review(item.id, "approve")} disabled={acting === item.id}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#0f2c1a", color: "#22c55e", border: "1px solid #238636", cursor: "pointer" }}>
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => review(item.id, "reject")}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, backgroundColor: "#2c0f0f", color: "#ef4444", border: "1px solid #da3633", cursor: "pointer" }}>
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
