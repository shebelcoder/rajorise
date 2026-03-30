import Link from "next/link";
import { ArrowRight, Droplets, BookOpen, UtensilsCrossed, Heart, Shield, Eye, Zap } from "lucide-react";
import DonationWidget from "@/components/DonationWidget";
import StatsBar from "@/components/StatsBar";
import SponsorshipCard from "@/components/SponsorshipCard";
import SomaliaMapSection from "@/components/SomaliaMapSection";
import { prisma } from "@/lib/prisma";
import { formatLocation } from "@/lib/locations";

export const revalidate = 120;

async function getFeaturedSponsors() {
  try {
    const [students, families, cases] = await Promise.all([
      prisma.student.findMany({ where: { status: { in: ["APPROVED", "FUNDING"] }, isActive: true }, take: 1, orderBy: { createdAt: "desc" } }),
      prisma.family.findMany({ where: { status: { in: ["APPROVED", "FUNDING"] }, isActive: true }, take: 1, orderBy: { createdAt: "desc" } }),
      prisma.report.findMany({ where: { status: { in: ["APPROVED", "FUNDING"] } }, take: 1, orderBy: { createdAt: "desc" } }),
    ]);
    const items: { id: string; type: "student" | "family" | "project"; name: string; location: string; story: string; goal: number; raised: number; status: "OPEN" | "FULLY_FUNDED" }[] = [];
    for (const s of students) {
      items.push({ id: s.slug, type: "student", name: s.name, location: formatLocation({ district: s.district, region: s.region }), story: s.story.slice(0, 150), goal: Number(s.goalAmount), raised: Number(s.raisedAmount), status: Number(s.raisedAmount) >= Number(s.goalAmount) ? "FULLY_FUNDED" : "OPEN" });
    }
    for (const f of families) {
      items.push({ id: f.slug, type: "family", name: f.name, location: formatLocation({ district: f.district, region: f.region }), story: f.story.slice(0, 150), goal: Number(f.goalAmount), raised: Number(f.raisedAmount), status: Number(f.raisedAmount) >= Number(f.goalAmount) ? "FULLY_FUNDED" : "OPEN" });
    }
    for (const c of cases) {
      items.push({ id: c.slug, type: "project", name: c.title, location: formatLocation({ district: c.district, region: c.region }), story: c.summary.slice(0, 150), goal: Number(c.goalAmount), raised: Number(c.raisedAmount), status: Number(c.raisedAmount) >= Number(c.goalAmount) ? "FULLY_FUNDED" : "OPEN" });
    }
    return items;
  } catch { return []; }
}

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

export default async function HomePage() {
  const featuredSponsors = await getFeaturedSponsors();
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
                Transparent humanitarian platform
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

      {/* HOW IT WORKS */}
      <section style={{ padding: "5rem 0", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            How RajoRise Works
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "3rem", fontSize: "1rem" }}>
            From journalist field reports to verified impact — every step is transparent
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { step: "1", title: "Journalist Documents", desc: "Field journalists create verified reports about communities in need", color: "#58a6ff" },
              { step: "2", title: "Admin Verifies", desc: "Our team reviews every case before it goes public", color: "#f59e0b" },
              { step: "3", title: "Donors Contribute", desc: "You choose a case, student, or family to support directly", color: "#22c55e" },
              { step: "4", title: "Impact Delivered", desc: "Funds are allocated, goods delivered, and progress tracked", color: "#a78bfa" },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: color, color: "#fff", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/stories" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "2.5rem", backgroundColor: "#16a34a", color: "#fff", padding: "12px 24px", borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>
            Read Impact Stories <ArrowRight size={16} />
          </Link>
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
            Join our growing community of donors. No account needed.
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
