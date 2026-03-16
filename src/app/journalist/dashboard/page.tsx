import Link from "next/link";
import { Upload, FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";

const mockReports = [
  { id: "r1", title: "Drought crisis in Daro — 20 families", location: "Daro, Somalia", status: "APPROVED", date: "Mar 12, 2026", category: "WATER" },
  { id: "r2", title: "School renovation update — Hargeisa", location: "Hargeisa, Somaliland", status: "PENDING", date: "Mar 14, 2026", category: "EDUCATION" },
  { id: "r3", title: "Medical camp successful — 280 served", location: "Afar, Ethiopia", status: "APPROVED", date: "Feb 28, 2026", category: "MEDICAL" },
  { id: "r4", title: "Emergency food needed — Mandera flooding", location: "Mandera, Kenya", status: "REJECTED", date: "Feb 15, 2026", category: "FOOD" },
];

const statusIcon = {
  APPROVED: <CheckCircle className="w-4 h-4 text-green-500" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  REJECTED: <XCircle className="w-4 h-4 text-red-500" />,
};

const statusBadge = {
  APPROVED: "badge-green",
  PENDING: "badge-gold",
  REJECTED: "badge-red",
};

export default function JournalistDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Journalist Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, Ahmed</p>
          </div>
          <Link
            href="/journalist/upload"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" /> New Report
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Reports", value: "12", icon: FileText, color: "text-blue-400" },
            { label: "Approved", value: "9", icon: CheckCircle, color: "text-green-400" },
            { label: "Pending Review", value: "2", icon: Clock, color: "text-yellow-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-800 rounded-2xl border border-gray-700 p-5 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Reports table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-400" />
              My Reports
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {mockReports.map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-750 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{r.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{r.location} · {r.date}</p>
                </div>
                <span className={`badge ${statusBadge[r.status as keyof typeof statusBadge]} hidden sm:flex items-center gap-1`}>
                  {statusIcon[r.status as keyof typeof statusIcon]}
                  {r.status}
                </span>
                <span className="text-gray-500 sm:hidden">
                  {statusIcon[r.status as keyof typeof statusIcon]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <h3 className="font-bold text-white mb-4">Tips for Faster Approval</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              "Include at least 2 photos showing the actual situation",
              "Mention exact number of families or people affected",
              "Provide a specific funding amount with a brief breakdown",
              "Use real location names (no abbreviations)",
              "Keep the story factual and avoid sensationalism",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
