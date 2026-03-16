import Link from "next/link";
import { MapPin, Users, Heart, ArrowRight } from "lucide-react";

const families = [
  { id: "1", name: "Al-Hassan Family", location: "Northern Kenya", members: 6, situation: "Drought", story: "The Al-Hassan family lost their livestock to drought. With no income and 4 children, they need food support for 3 months.", goal: 250, raised: 180, status: "OPEN", emoji: "👨‍👩‍👧‍👦", need: "Food Support", imgClass: "proj-img-food" },
  { id: "2", name: "Nuur Family", location: "Afar, Ethiopia", members: 8, situation: "Flood displacement", story: "Flash floods destroyed their home. 8 family members are sheltered in a temporary camp with no belongings.", goal: 350, raised: 350, status: "FULLY_FUNDED", emoji: "👨‍👩‍👦‍👦", need: "Emergency Relief", imgClass: "proj-img-emergency" },
  { id: "3", name: "Dirie Family", location: "Mogadishu, Somalia", members: 5, situation: "Drought + illness", story: "The father is ill and unable to work. The mother alone cannot feed 3 children. They need medical and food support.", goal: 400, raised: 120, status: "OPEN", emoji: "👨‍👩‍👧", need: "Food + Medical", imgClass: "proj-img-medical" },
  { id: "4", name: "Warsame Family", location: "Mandera, Kenya", members: 7, situation: "Water crisis", story: "Located 15km from the nearest water source, they spend 6 hours daily collecting water. Support water delivery.", goal: 150, raised: 90, status: "OPEN", emoji: "👨‍👩‍👧‍👦", need: "Water Delivery", imgClass: "proj-img-water" },
  { id: "5", name: "Abdi Family", location: "Garissa, Kenya", members: 10, situation: "Orphan household", story: "Grandmother Halima cares for 8 grandchildren after losing her children. She needs consistent food and school support.", goal: 600, raised: 200, status: "OPEN", emoji: "👵🏿", need: "Food + Education", imgClass: "proj-img-family" },
  { id: "6", name: "Jama Family", location: "Hargeisa, Somaliland", members: 4, situation: "Drought", story: "A young couple with 2 toddlers whose farm was destroyed. They completed their program — now fully self-sufficient.", goal: 200, raised: 200, status: "COMPLETED", emoji: "👨‍👩‍👧‍👦", need: "Livelihood Support", imgClass: "proj-img-food" },
];

export default function FamiliesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="gradient-hero text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <Users className="w-4 h-4" /> Every family has a story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Families Needing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">Your Help</span>
          </h1>
          <p className="text-white/75 text-lg">
            Sponsor a specific family and follow their journey from crisis to stability.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Privacy note */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-10 flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm mt-0.5">i</div>
          <p className="text-sm text-blue-800">
            <strong>Privacy first:</strong> We use family names or anonymous IDs only. No full names, exact addresses, or sensitive personal data. All profiles are admin-reviewed before publishing.
          </p>
        </div>

        {/* Families grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {families.map((f) => {
            const pct = Math.min(Math.round((f.raised / f.goal) * 100), 100);
            return (
              <div key={f.id} className="story-card flex flex-col">
                {/* Image area */}
                <div className={`relative h-48 flex flex-col items-center justify-center ${f.imgClass}`}>
                  <span className="text-6xl drop-shadow">{f.emoji}</span>
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className="badge badge-green bg-white/90">{f.members} members</span>
                    {f.status === "OPEN"
                      ? <span className="badge badge-green bg-white/90">Active</span>
                      : f.status === "FULLY_FUNDED"
                      ? <span className="badge badge-gold bg-white/90">Fully Funded</span>
                      : <span className="badge badge-blue bg-white/90">Completed ✓</span>}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {f.situation}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{f.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />{f.location}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{f.story}</p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-bold text-gray-900">${f.raised} raised</span>
                      <span className="text-gray-400 text-xs">of ${f.goal} · {pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {f.status === "OPEN" ? (
                    <Link
                      href={`/donate?sponsorship=${f.id}&type=family&name=${encodeURIComponent(f.name)}`}
                      className="w-full text-center py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" /> Support This Family
                    </Link>
                  ) : f.status === "FULLY_FUNDED" ? (
                    <div className="w-full text-center py-3 rounded-xl font-bold text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Fully Funded ✓
                    </div>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-700 border border-blue-200">
                      Mission Completed ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 gradient-hero text-white rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Make a General Family Aid Donation</h2>
          <p className="text-white/75 mb-6">Funds go to the most urgent family cases in our system.</p>
          <Link href="/donate?category=food" className="btn-gold inline-flex items-center gap-2">
            Donate to Family Aid <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
