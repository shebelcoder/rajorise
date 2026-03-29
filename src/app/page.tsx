import Link from "next/link";
import { ArrowRight, Droplets, BookOpen, UtensilsCrossed, Heart, Shield, Eye, Zap } from "lucide-react";
import DonationWidget from "@/components/DonationWidget";
import StatsBar from "@/components/StatsBar";
import SponsorshipCard from "@/components/SponsorshipCard";
import SomaliaMapSection from "@/components/SomaliaMapSection";

const featuredSponsors = [
  {
    id: "1",
    type: "student" as const,
    name: "Ayaan",
    location: "Somali Region, Ethiopia",
    story: "Ayaan is 12 years old and dreams of becoming a doctor. With your help, he can attend school this year.",
    goal: 120,
    raised: 75,
    status: "OPEN" as const,
  },
  {
    id: "2",
    type: "family" as const,
    name: "Al-Hassan Family",
    location: "Northern Kenya",
    story: "A family of 6 facing severe drought. They need food support for the next three months.",
    goal: 250,
    raised: 180,
    status: "OPEN" as const,
  },
  {
    id: "3",
    type: "project" as const,
    name: "Water Truck – Village Daro",
    location: "Daro, Somalia",
    story: "20 families have no access to clean water. One water truck delivery serves the entire village for a month.",
    goal: 400,
    raised: 400,
    status: "FULLY_FUNDED" as const,
  },
];

const fundAreas = [
  { icon: Droplets, label: "Water Delivery", description: "Clean water to drought-affected villages", color: "bg-blue-50 text-blue-600" },
  { icon: UtensilsCrossed, label: "Food Aid", description: "Emergency food distributions", color: "bg-green-50 text-green-600" },
  { icon: BookOpen, label: "Education", description: "School fees and supplies for students", color: "bg-yellow-50 text-yellow-600" },
  { icon: Heart, label: "Medical Support", description: "Village medical camps and supplies", color: "bg-red-50 text-red-500" },
];

const whyUs = [
  { icon: Eye, title: "Full Transparency", description: "See exactly where every dollar goes with real-time impact tracking." },
  { icon: Zap, title: "2-Click Donation", description: "Donate instantly without creating an account. Fast and frictionless." },
  { icon: Shield, title: "100% Secure", description: "Payments handled by Stripe. We never store your payment data." },
  { icon: Heart, title: "Real Stories", description: "Field journalists document every project with photos and videos." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="gradient-hero text-white min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-400 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Trusted by donors in 40+ countries
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Plant Hope.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">
                  Change a Life.
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
                RajoRise connects you directly with communities in crisis. See your impact. Follow real stories. Give with confidence.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/donate" className="btn-primary text-lg px-8 py-4">
                  <Heart className="w-5 h-5 fill-white" />
                  Donate Now
                </Link>
                <Link href="/projects" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all">
                  See Projects <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white/60 text-sm">Quick donate:</span>
                {[1, 5, 10, 25].map((a) => (
                  <Link key={a} href={`/donate?amount=${a}`} className="bg-white/10 hover:bg-green-500 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all">
                    ${a}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:pl-8">
              <DonationWidget />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <StatsBar />

      {/* WHY US */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900">
              Why <span className="text-gradient">RajoRise?</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Built so every dollar counts and every donor trusts the process.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center card-hover">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE FUND */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900">What We Fund</h2>
            <p className="mt-3 text-gray-500">Your general donations support these critical areas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {fundAreas.map(({ icon: Icon, label, description, color }) => (
              <div key={label} className="rounded-2xl p-6 border border-gray-100 bg-gray-50 text-center card-hover">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE WE OPERATE — Interactive Somalia Map */}
      <SomaliaMapSection />

      {/* FEATURED SPONSORSHIPS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Sponsor a <span className="text-gradient">Story</span>
              </h2>
              <p className="mt-2 text-gray-500">Follow the journey of real people you help</p>
            </div>
            <Link href="/students" className="hidden sm:flex items-center gap-1 text-green-600 font-semibold hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSponsors.map((s) => (
              <SponsorshipCard key={s.id} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-gold mb-4 block w-fit">Success Story</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                From Dropout to<br />
                <span className="text-gradient">Top of His Class</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Yusuf was about to quit school when RajoRise donors stepped in. Thanks to 3 sponsors,
                he finished top of his grade.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { date: "Jan 2025", event: "First sponsorship received" },
                  { date: "Mar 2025", event: "Received school supplies" },
                  { date: "Jun 2025", event: "Passed grade exams with distinction" },
                ].map(({ date, event }) => (
                  <div key={date} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{date}</span>
                      <p className="text-sm text-gray-700">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/stories" className="btn-primary">
                Read More Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-4 text-4xl">
                    👦
                  </div>
                  <p className="font-bold text-gray-800 text-lg">Yusuf, Age 14</p>
                  <p className="text-gray-500 text-sm">Mogadishu, Somalia</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500">Fully Sponsored</p>
                <p className="font-bold text-green-600 text-lg">$120 / $120</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Be the Bridge Between<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">
              Hope and Life
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 4,200+ donors making real change. No account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="btn-gold text-lg px-10 py-4">
              <Heart className="w-5 h-5 fill-white" /> Donate Now
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all">
              Explore Projects <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
