import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Star } from "lucide-react";

const stories = [
  {
    id: "yusuf",
    name: "Yusuf",
    type: "Student",
    location: "Mogadishu, Somalia",
    headline: "From Dropout to Top of His Class",
    summary: "Yusuf was on the verge of quitting school when three donors from different countries stepped in. Two years later, he finished top of his grade.",
    emoji: "👦",
    outcome: "Passed grade 7 with distinction",
    milestones: [
      { date: "Jan 2024", event: "First sponsorship received — $40" },
      { date: "Feb 2024", event: "Enrolled back in school after 3-month gap" },
      { date: "Mar 2024", event: "Received school uniform and supplies" },
      { date: "Jun 2024", event: "Passed mid-year exams" },
      { date: "Dec 2024", event: "Finished top of Grade 7" },
      { date: "Jan 2025", event: "Renewed sponsorship for secondary school" },
    ],
    donors: 3,
    raised: 240,
  },
  {
    id: "hassan-family",
    name: "The Hassan Family",
    type: "Family",
    location: "Northern Kenya",
    headline: "A Family Back on Their Feet",
    summary: "After 6 months of food support, the Hassan family planted new crops and regained self-sufficiency. They no longer need aid.",
    emoji: "👨‍👩‍👧‍👦",
    outcome: "Self-sufficient after 6 months of support",
    milestones: [
      { date: "Mar 2024", event: "Emergency food package received" },
      { date: "Apr 2024", event: "Monthly food support began" },
      { date: "May 2024", event: "Father's health improved; returned to farming" },
      { date: "Jul 2024", event: "First small harvest from new seeds" },
      { date: "Sep 2024", event: "Family declared self-sufficient" },
    ],
    donors: 7,
    raised: 450,
  },
  {
    id: "water-daro",
    name: "Village Daro",
    type: "Community",
    location: "Daro, Somalia",
    headline: "20 Families With Clean Water",
    summary: "What started as a single water truck delivery became a monthly service. Village Daro now has consistent access to clean water.",
    emoji: "💧",
    outcome: "Monthly water service established",
    milestones: [
      { date: "Feb 2024", event: "First water truck delivery funded" },
      { date: "Mar 2024", event: "Village elders partnered with RajoRise" },
      { date: "Apr 2024", event: "Second delivery — 20 families served" },
      { date: "Jun 2024", event: "Water well drilling project approved" },
      { date: "Nov 2024", event: "Well drilling completed — permanent water source" },
    ],
    donors: 14,
    raised: 1200,
  },
  {
    id: "hibo",
    name: "Hibo",
    type: "Student",
    location: "Mogadishu, Somalia",
    headline: "The Girl Who Proved Everyone Wrong",
    summary: "Her teachers said girls from her neighborhood don't graduate. Hibo proved them wrong, and is now preparing for high school.",
    emoji: "👧",
    outcome: "Completed primary school — first girl in her street",
    milestones: [
      { date: "Sep 2023", event: "Sponsorship enabled school enrollment" },
      { date: "Jan 2024", event: "Top student in her class" },
      { date: "Jun 2024", event: "Passed national primary exams" },
      { date: "Sep 2024", event: "Enrolled in secondary school" },
    ],
    donors: 2,
    raised: 120,
  },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 mb-4 text-sm font-medium text-yellow-700">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            Real people. Real change.
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Success <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            These are the people your donations helped. Every milestone is verified by our field journalists.
          </p>
        </div>

        {/* Stories */}
        <div className="space-y-12">
          {stories.map((s, idx) => (
            <div key={s.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              {/* Profile card */}
              <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 h-52 flex flex-col items-center justify-center gap-3">
                  <span className="text-7xl">{s.emoji}</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-xl">{s.name}</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="badge badge-green">{s.type}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {s.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-green-50 rounded-xl p-4 mb-4 text-center">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Outcome</p>
                    <p className="font-bold text-gray-900">{s.outcome}</p>
                  </div>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{s.donors}</p>
                      <p className="text-xs text-gray-500">Donors</p>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">${s.raised}</p>
                      <p className="text-xs text-gray-500">Total Raised</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story content */}
              <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                <span className="badge badge-gold mb-4 block w-fit">Success Story</span>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{s.headline}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{s.summary}</p>

                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Journey Timeline
                </h3>
                <div className="space-y-3">
                  {s.milestones.map((m, mi) => (
                    <div key={mi} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        {mi < s.milestones.length - 1 && <div className="w-0.5 flex-1 bg-green-100 my-1 min-h-[16px]" />}
                      </div>
                      <div className="pb-2">
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide">{m.date}</span>
                        <p className="text-sm text-gray-700">{m.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 gradient-hero text-white rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Create the Next Success Story</h2>
          <p className="text-white/80 mb-6">Your donation today becomes someone&apos;s milestone tomorrow.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="btn-gold inline-flex items-center gap-2">
              Donate Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/students" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all">
              Sponsor a Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
