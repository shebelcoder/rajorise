import Link from "next/link";
import { FileText, DollarSign, Users, CheckCircle, Clock, XCircle, TrendingUp, Send, Eye } from "lucide-react";

const pendingReports = [
  { id: "r1", title: "School renovation update — Hargeisa", journalist: "Ahmed Ali", location: "Hargeisa, Somaliland", date: "Mar 14, 2026", category: "EDUCATION" },
  { id: "r2", title: "Water crisis worsening — Mogadishu suburbs", journalist: "Fatima Omar", location: "Mogadishu, Somalia", date: "Mar 15, 2026", category: "WATER" },
  { id: "r3", title: "Flood displacement — Mandera south", journalist: "Ibrahim Hassan", location: "Mandera, Kenya", date: "Mar 15, 2026", category: "EMERGENCY" },
];

const recentDonations = [
  { id: "d1", donor: "Anonymous", amount: 50, project: "General Fund", date: "Mar 15, 2026" },
  { id: "d2", donor: "Sarah M.", amount: 120, project: "Student: Ayaan", date: "Mar 15, 2026" },
  { id: "d3", donor: "John D.", amount: 25, project: "Water Delivery", date: "Mar 14, 2026" },
  { id: "d4", donor: "Anonymous", amount: 100, project: "Emergency Relief", date: "Mar 14, 2026" },
  { id: "d5", donor: "Maria L.", amount: 10, project: "General Fund", date: "Mar 13, 2026" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">RajoRise Platform Control Center</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/reports" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
              <FileText className="w-4 h-4" /> Reports
            </Link>
            <Link href="/admin/donations" className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
              <DollarSign className="w-4 h-4" /> Donations
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Month", value: "$18,400", sub: "+12% vs last month", icon: TrendingUp, color: "text-green-400" },
            { label: "Pending Reports", value: "3", sub: "Awaiting review", icon: Clock, color: "text-yellow-400" },
            { label: "Active Projects", value: "8", sub: "2 fully funded", icon: CheckCircle, color: "text-blue-400" },
            { label: "Total Donors", value: "4,218", sub: "+34 this week", icon: Users, color: "text-purple-400" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <Icon className={`w-5 h-5 mb-3 ${color}`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-xs text-gray-600 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending reports */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Reports
                <span className="ml-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{pendingReports.length}</span>
              </h2>
            </div>
            <div className="divide-y divide-gray-800">
              {pendingReports.map((r) => (
                <div key={r.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">By {r.journalist} · {r.location}</p>
                      <p className="text-xs text-gray-600">{r.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="Preview">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 bg-green-900/50 hover:bg-green-800 border border-green-700 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </button>
                      <button className="p-2 bg-red-900/30 hover:bg-red-900 border border-red-800 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-gray-800">
              <Link href="/admin/reports" className="text-sm text-green-400 hover:underline">
                View all reports →
              </Link>
            </div>
          </div>

          {/* Recent donations */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Recent Donations
              </h2>
            </div>
            <div className="divide-y divide-gray-800">
              {recentDonations.map((d) => (
                <div key={d.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{d.donor}</p>
                    <p className="text-xs text-gray-500">{d.project} · {d.date}</p>
                  </div>
                  <span className="font-bold text-green-400">${d.amount}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-gray-800">
              <Link href="/admin/donations" className="text-sm text-green-400 hover:underline">
                View all donations →
              </Link>
            </div>
          </div>
        </div>

        {/* Publish impact report */}
        <div className="mt-8 bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-green-800/50 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Publish Monthly Impact Report</h3>
              <p className="text-gray-400 text-sm mt-1">
                March 2026 · $18,400 raised · 5 trucks · 14 students · 42 families
              </p>
            </div>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Send className="w-4 h-4" />
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
