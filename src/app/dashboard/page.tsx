import Link from "next/link";
import { Heart, GraduationCap, Users, TrendingUp, ArrowRight } from "lucide-react";

const mockDonations = [
  { id: "1", amount: 50, project: "General Fund", date: "Mar 15, 2026", category: "general" },
  { id: "2", amount: 120, project: "Student: Ayaan", date: "Mar 10, 2026", category: "education" },
  { id: "3", amount: 25, project: "Water Delivery – Daro", date: "Mar 1, 2026", category: "water" },
  { id: "4", amount: 10, project: "General Fund", date: "Feb 20, 2026", category: "general" },
];

const sponsoredStudents = [
  { name: "Ayaan", grade: "Grade 6", location: "Ethiopia", progress: 63, lastUpdate: "Received school supplies — Mar 5, 2026" },
];

export default function DonorDashboardPage() {
  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">My Impact</h1>
          <p className="text-gray-500">Thank you for making a difference, Sarah</p>
        </div>

        {/* Impact stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Heart, label: "Total Donated", value: `$${totalDonated}`, color: "text-green-600 bg-green-50" },
            { icon: GraduationCap, label: "Students Helped", value: "1", color: "text-blue-600 bg-blue-50" },
            { icon: Users, label: "Families Supported", value: "0", color: "text-yellow-600 bg-yellow-50" },
            { icon: TrendingUp, label: "Donations Made", value: "4", color: "text-purple-600 bg-purple-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation history */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Donation History</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {mockDonations.map((d) => (
                <div key={d.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.project}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.date}</p>
                  </div>
                  <span className="font-bold text-green-600">${d.amount}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <Link href="/donate" className="text-sm text-green-600 font-semibold hover:underline">
                Make another donation →
              </Link>
            </div>
          </div>

          {/* Sponsored students */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg">Sponsored Students</h2>
              </div>
              {sponsoredStudents.map((s) => (
                <div key={s.name} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">👦</span>
                    <div>
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.grade} · {s.location}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Year progress</span>
                      <span className="font-semibold">{s.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Latest Update</p>
                    <p className="text-xs text-gray-600">{s.lastUpdate}</p>
                  </div>
                </div>
              ))}
              <div className="px-6 pb-4 text-center">
                <Link href="/students" className="text-sm text-green-600 font-semibold hover:underline flex items-center justify-center gap-1">
                  Sponsor another student <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Impact summary */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Your Impact Summary</h3>
              <ul className="space-y-2 text-sm text-green-100">
                <li>✓ 1 student attending school</li>
                <li>✓ 3 general fund contributions</li>
                <li>✓ Part of 1 water delivery</li>
              </ul>
              <Link href="/impact" className="mt-4 flex items-center gap-1 text-white font-semibold text-sm hover:underline">
                See platform impact <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
