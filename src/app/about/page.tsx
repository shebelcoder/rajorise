import Link from "next/link";
import { Heart, Shield, Eye, Users, ArrowRight } from "lucide-react";

const values = [
  { icon: Eye, title: "Radical Transparency", description: "Every dollar is tracked and reported publicly. Monthly impact reports, field journalist documentation, and admin-verified projects." },
  { icon: Heart, title: "Human First", description: "We build around real stories. Every profile, every project comes from verified journalists on the ground." },
  { icon: Shield, title: "Data Minimalism", description: "We store the minimum personal data possible. First names only for beneficiaries. Stripe handles all payments — we never see card data." },
  { icon: Users, title: "Community Driven", description: "Journalists, donors, admins, and local communities work together. No single point of control." },
];

const team = [
  { name: "Field Team", role: "Journalists on the ground in Somalia, Kenya, Ethiopia, and Somaliland", emoji: "📷" },
  { name: "Admin Team", role: "Verify all reports and manage fund distribution", emoji: "🛡️" },
  { name: "Tech Team", role: "Build and maintain the platform with security first", emoji: "💻" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="gradient-hero text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4">About RajoRise</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            RajoRise means "Hope Rises" in Somali. We built this platform to make humanitarian giving fast, transparent, and deeply human.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To connect people in crisis — villages suffering from hunger, drought, lack of water and education —
              with donors around the world through real stories, full transparency, and frictionless giving.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-10 text-center">
            <p className="text-3xl font-bold text-gray-900 italic">
              &ldquo;A bridge between hope and life.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Who We Are</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((t) => (
              <div key={t.name} className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <span className="text-5xl block mb-4">{t.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Privacy & Security</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ul className="space-y-4">
              {[
                "Beneficiaries are identified by first name or anonymous ID only — no sensitive personal data stored",
                "Donor payment data is never stored — Stripe processes all payments end-to-end",
                "Role-based authentication ensures journalists can only access their own reports",
                "Admin approval system prevents unverified content from reaching donors",
                "HTTPS enforced on all connections",
                "Images are reviewed before publishing to prevent identifying vulnerable individuals",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Mission</h2>
          <p className="text-white/80 mb-6">Whether you give $1 or $1,000 — every contribution plants hope.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="btn-gold inline-flex items-center gap-2">
              Donate Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
