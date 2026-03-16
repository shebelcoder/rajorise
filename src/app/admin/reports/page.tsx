import { CheckCircle, Clock, XCircle, Eye, MapPin } from "lucide-react";
import Link from "next/link";

const reports = [
  { id: "r1", title: "School renovation update — Hargeisa", journalist: "Ahmed Ali", location: "Hargeisa, Somaliland", date: "Mar 14, 2026", category: "EDUCATION", status: "PENDING", families: 60, amount: 3500 },
  { id: "r2", title: "Water crisis worsening — Mogadishu suburbs", journalist: "Fatima Omar", location: "Mogadishu, Somalia", date: "Mar 15, 2026", category: "WATER", status: "PENDING", families: 30, amount: 600 },
  { id: "r3", title: "Drought in Daro — 20 families need water", journalist: "Ahmed Ali", location: "Daro, Somalia", date: "Mar 1, 2026", category: "WATER", status: "APPROVED", families: 20, amount: 400 },
  { id: "r4", title: "Emergency food needed — Mandera flooding", journalist: "Ibrahim Hassan", location: "Mandera, Kenya", date: "Feb 15, 2026", category: "FOOD", status: "REJECTED", families: 45, amount: 1200 },
  { id: "r5", title: "Medical camp in Afar — 280 served", journalist: "Fatima Omar", location: "Afar, Ethiopia", date: "Feb 28, 2026", category: "MEDICAL", status: "APPROVED", families: 60, amount: 800 },
];

const statusStyle = {
  PENDING: { badge: "badge-gold", icon: <Clock className="w-4 h-4 text-yellow-500" /> },
  APPROVED: { badge: "badge-green", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  REJECTED: { badge: "badge-red", icon: <XCircle className="w-4 h-4 text-red-500" /> },
};

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Field Reports</h1>
            <p className="text-gray-400 mt-1">Review and approve journalist submissions</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button key={f} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${f === "All" ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {reports.map((r) => {
            const { badge, icon } = statusStyle[r.status as keyof typeof statusStyle];
            return (
              <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`badge ${badge} flex items-center gap-1`}>
                        {icon} {r.status}
                      </span>
                      <span className="badge badge-blue">{r.category}</span>
                    </div>
                    <h3 className="font-bold text-white">{r.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 flex-wrap">
                      <span>By {r.journalist}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.location}</span>
                      <span>{r.date}</span>
                      <span>{r.families} families · ${r.amount.toLocaleString()} needed</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors">
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                    {r.status === "PENDING" && (
                      <>
                        <button className="flex items-center gap-1 px-3 py-2 bg-green-800 hover:bg-green-700 border border-green-700 rounded-xl text-sm transition-colors text-green-300">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 bg-red-900/50 hover:bg-red-900 border border-red-800 rounded-xl text-sm transition-colors text-red-300">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
