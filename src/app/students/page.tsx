import Link from "next/link";
import { MapPin, GraduationCap, ArrowRight, Heart } from "lucide-react";

const students = [
  { id: "1", name: "Ayaan", age: 12, location: "Somali Region, Ethiopia", story: "Ayaan dreams of becoming a doctor. He walks 8km daily to reach school. Your help lets him focus on learning instead of fees.", goal: 120, raised: 75, status: "OPEN", grade: "Grade 6", emoji: "👦🏾" },
  { id: "2", name: "Hibo", age: 10, location: "Mogadishu, Somalia", story: "Hibo is the top student in her class but her family cannot afford fees. One sponsor keeps her in school for a full year.", goal: 120, raised: 120, status: "FULLY_FUNDED", grade: "Grade 4", emoji: "👧🏾" },
  { id: "3", name: "Omar", age: 14, location: "Garissa, Kenya", story: "Omar lost both parents in the drought crisis. His aunt is raising him but cannot cover school costs. He wants to be an engineer.", goal: 200, raised: 60, status: "OPEN", grade: "Grade 8", emoji: "👦🏿" },
  { id: "4", name: "Fadumo", age: 11, location: "Hargeisa, Somaliland", story: "Fadumo was pulled out of school to help at home. Her community freed her from chores — now she needs a sponsor to return.", goal: 120, raised: 40, status: "OPEN", grade: "Grade 5", emoji: "👧🏿" },
  { id: "5", name: "Yusuf", age: 13, location: "Afar Region, Ethiopia", story: "Yusuf is already a success story — last year's sponsors helped him pass exams. He needs continued support for secondary school.", goal: 250, raised: 175, status: "OPEN", grade: "Secondary 1", emoji: "👦🏿" },
  { id: "6", name: "Asha", age: 9, location: "Mandera, Kenya", story: "Asha just started school for the first time. She is the first girl in her family to attend. Your sponsorship writes history.", goal: 100, raised: 30, status: "OPEN", grade: "Grade 1", emoji: "👧🏾" },
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="gradient-hero text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <GraduationCap className="w-4 h-4" /> Sponsor a student — change a future
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Students Needing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">Sponsors</span>
          </h1>
          <p className="text-white/75 text-lg">
            $120 covers one full year of school. You receive progress updates throughout the year.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-12">
          <h2 className="font-bold text-gray-900 text-xl mb-6 text-center">How Sponsorship Works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", title: "Choose a Student", desc: "Browse verified profiles" },
              { step: "2", title: "Sponsor Them", desc: "Pay securely via Stripe" },
              { step: "3", title: "Track Progress", desc: "Updates as they grow" },
              { step: "4", title: "See Impact", desc: "Their success is yours" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {step}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Students grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {students.map((s) => {
            const pct = Math.min(Math.round((s.raised / s.goal) * 100), 100);
            return (
              <div key={s.id} className="story-card flex flex-col">
                {/* Card image area */}
                <div className="relative h-48 proj-img-student flex flex-col items-center justify-center gap-2">
                  <span className="text-6xl drop-shadow">{s.emoji}</span>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge badge-blue bg-white/90">{s.grade}</span>
                    {s.status === "OPEN"
                      ? <span className="badge badge-green bg-white/90">Needs Sponsor</span>
                      : <span className="badge badge-gold bg-white/90">Sponsored ✓</span>}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Age {s.age}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{s.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />{s.location}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{s.story}</p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-bold text-gray-900">${s.raised} raised</span>
                      <span className="text-gray-400 text-xs">of ${s.goal}/yr · {pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {s.status === "OPEN" ? (
                    <Link
                      href={`/donate?sponsorship=${s.id}&type=student&name=${encodeURIComponent(s.name)}`}
                      className="w-full text-center py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" /> Sponsor {s.name}
                    </Link>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl font-bold text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Fully Sponsored ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 gradient-hero text-white rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Can&apos;t choose just one?</h2>
          <p className="text-white/75 mb-6">Make a general education donation — we distribute it among the most urgent cases.</p>
          <Link href="/donate?category=education" className="btn-gold inline-flex items-center gap-2">
            Support Education Fund <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
