"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Eye, MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";

type Report = {
  id: string;
  title: string;
  location: string;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  familiesAffected: number;
  amountNeeded: number;
  createdAt: string;
  author: { name: string | null; email: string };
};

const statusStyle = {
  PENDING:  { badge: "badge-gold",  label: "PENDING"  },
  APPROVED: { badge: "badge-green", label: "APPROVED" },
  REJECTED: { badge: "badge-red",   label: "REJECTED" },
};

const FILTERS = ["All", "Pending", "Approved", "Rejected"] as const;
type Filter = typeof FILTERS[number];

export default function AdminReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [filter, setFilter]     = useState<Filter>("All");
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState<string | null>(null);
  const [error, setError]       = useState("");

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
          r.id === id
            ? { ...r, status: action === "approve" ? "APPROVED" : "REJECTED" }
            : r
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
    All:      reports.length,
    Pending:  reports.filter((r) => r.status === "PENDING").length,
    Approved: reports.filter((r) => r.status === "APPROVED").length,
    Rejected: reports.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Field Reports</h1>
            <p className="text-gray-400 mt-1">Review and approve journalist submissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReports}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === f
                  ? "bg-green-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f}
              <span className="text-xs bg-black/20 px-1.5 py-0.5 rounded-full">{counts[f]}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading reports...</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}reports found.
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((r) => {
              const { badge, label } = statusStyle[r.status];
              return (
                <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`badge ${badge}`}>{label}</span>
                        <span className="badge badge-blue">{r.category}</span>
                      </div>
                      <h3 className="font-bold text-white">{r.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 flex-wrap">
                        <span>By {r.author.name || r.author.email}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{r.location}
                        </span>
                        <span>
                          {new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        <span>
                          {r.familiesAffected} families · ${r.amountNeeded.toLocaleString()} needed
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/cases/${r.id}`}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Preview
                      </Link>
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAction(r.id, "approve")}
                            disabled={acting === r.id + "approve"}
                            className="flex items-center gap-1 px-3 py-2 bg-green-800 hover:bg-green-700 border border-green-700 rounded-xl text-sm transition-colors text-green-300 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {acting === r.id + "approve" ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(r.id, "reject")}
                            disabled={acting === r.id + "reject"}
                            className="flex items-center gap-1 px-3 py-2 bg-red-900/50 hover:bg-red-900 border border-red-800 rounded-xl text-sm transition-colors text-red-300 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
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
