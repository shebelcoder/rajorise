import { TrendingUp, Droplets, GraduationCap, Users, Heart } from "lucide-react";

const reports = [
  {
    month: "February 2026",
    totalRaised: 18400,
    trucksDelivered: 5,
    studentsSupported: 14,
    familiesHelped: 42,
    highlights: [
      "5 water trucks reached 3 drought-affected villages in Somalia",
      "14 new students enrolled with full sponsorship coverage",
      "Emergency food packages distributed to 42 families in Mandera",
      "Medical camp in Afar served 280 people",
    ],
  },
  {
    month: "January 2026",
    totalRaised: 14200,
    trucksDelivered: 4,
    studentsSupported: 11,
    familiesHelped: 35,
    highlights: [
      "4 water trucks deployed to Northern Kenya villages",
      "11 students sponsored for full academic year",
      "35 families received monthly food packages",
      "School renovation project in Hargeisa reached 60% completion",
    ],
  },
  {
    month: "December 2025",
    totalRaised: 22800,
    trucksDelivered: 7,
    studentsSupported: 20,
    familiesHelped: 68,
    highlights: [
      "Record month: $22,800 raised by donors worldwide",
      "7 water trucks delivered — highest in platform history",
      "20 students received year-end exam support",
      "68 families received holiday food packages",
      "New journalist partner joined from Garissa region",
    ],
  },
];

const allTime = {
  raised: 125340,
  trucks: 47,
  students: 89,
  families: 340,
};

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4 text-sm font-medium text-green-700">
            <TrendingUp className="w-4 h-4" />
            Verified by our admin team
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Our <span className="text-gradient">Impact</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Every dollar is tracked. Every project is documented. Here is the transparent record of what your donations achieved.
          </p>
        </div>

        {/* All-time stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Heart, label: "All-Time Donated", value: `$${allTime.raised.toLocaleString()}`, color: "text-green-600 bg-green-50" },
            { icon: Droplets, label: "Water Trucks", value: allTime.trucks, color: "text-blue-600 bg-blue-50" },
            { icon: GraduationCap, label: "Students Supported", value: allTime.students, color: "text-yellow-600 bg-yellow-50" },
            { icon: Users, label: "Families Helped", value: `${allTime.families}+`, color: "text-red-500 bg-red-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Monthly reports */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Monthly Reports</h2>
        <div className="space-y-8">
          {reports.map((r) => (
            <div key={r.month} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{r.month}</h3>
                  <p className="text-green-100 text-sm">Published monthly transparency report</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold">${r.totalRaised.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">total raised this month</p>
                </div>
              </div>

              <div className="p-8">
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Droplets, label: "Water Trucks", value: r.trucksDelivered, color: "text-blue-600" },
                    { icon: GraduationCap, label: "Students", value: r.studentsSupported, color: "text-yellow-600" },
                    { icon: Users, label: "Families", value: r.familiesHelped, color: "text-green-600" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="text-center bg-gray-50 rounded-xl p-4">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                <ul className="space-y-2">
                  {r.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency note */}
        <div className="mt-12 bg-blue-50 rounded-2xl border border-blue-100 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Full Transparency Commitment</h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Every month our admin team publishes a verified report. Field journalists provide photo and video evidence for every project.
            No funds are held back — 100% goes to the communities.
          </p>
        </div>
      </div>
    </div>
  );
}
