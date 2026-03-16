import Link from "next/link";
import { MapPin, Users, ArrowRight, Droplets, UtensilsCrossed, BookOpen, Heart, Stethoscope } from "lucide-react";

const projects = [
  {
    id: "water-truck-daro",
    category: "Water",
    title: "Water Truck – Village Daro",
    location: "Daro District, Somalia",
    description: "20 families with no access to clean water. One water truck delivery serves the entire village for a whole month.",
    goal: 400, raised: 400, status: "FULLY_FUNDED", families: 20,
    icon: Droplets, imgClass: "img-water", emoji: "💧",
  },
  {
    id: "food-aid-mandera",
    category: "Food",
    title: "Emergency Food Aid – Mandera",
    location: "Mandera, Kenya",
    description: "Severe drought has left 45 families without food. Distributing emergency food packages for three months.",
    goal: 1200, raised: 780, status: "OPEN", families: 45,
    icon: UtensilsCrossed, imgClass: "img-food", emoji: "🌾",
  },
  {
    id: "school-hargeisa",
    category: "Education",
    title: "School Renovation – Hargeisa",
    location: "Hargeisa, Somaliland",
    description: "The village school has no roof or windows. 60 students study in harsh conditions. Help us renovate it.",
    goal: 3500, raised: 1200, status: "OPEN", families: 0,
    icon: BookOpen, imgClass: "img-education", emoji: "📚",
  },
  {
    id: "medical-camp-afar",
    category: "Medical",
    title: "Village Medical Camp – Afar",
    location: "Afar Region, Ethiopia",
    description: "Deploying a mobile medical team to provide basic healthcare to 300 people with no clinic nearby.",
    goal: 800, raised: 530, status: "OPEN", families: 60,
    icon: Stethoscope, imgClass: "img-medical", emoji: "🏥",
  },
  {
    id: "water-well-garissa",
    category: "Water",
    title: "Water Well Drilling – Garissa",
    location: "Garissa County, Kenya",
    description: "Drilling a permanent community well that will serve 500+ people for years to come.",
    goal: 5000, raised: 2100, status: "OPEN", families: 100,
    icon: Droplets, imgClass: "img-water", emoji: "🚰",
  },
  {
    id: "flood-relief-mogadishu",
    category: "Emergency",
    title: "Flood Relief – Mogadishu",
    location: "Mogadishu, Somalia",
    description: "Flash floods displaced 200 families. Emergency shelter, food, and medical support needed urgently.",
    goal: 6000, raised: 4200, status: "OPEN", families: 200,
    icon: Heart, imgClass: "img-emergency", emoji: "🚨",
  },
];

const catBadge: Record<string, string> = {
  Water: "badge-blue", Food: "badge-green",
  Education: "badge-gold", Medical: "badge-red", Emergency: "badge-red",
};

export default function ProjectsPage() {
  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>

      {/* ── Page header ───────────────────────────────────── */}
      <div className="hero-band">
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
            Active Projects
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto" }}>
            Every project is verified by our admin team and documented by field journalists.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* ── Stats ────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
          {[
            { label: "Active Projects", value: "12" },
            { label: "Total Raised",    value: "$48,300" },
            { label: "Families Helped", value: "425+" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.4rem" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Project grid ─────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {projects.map((p) => {
            const pct = Math.min(Math.round((p.raised / p.goal) * 100), 100);
            const Icon = p.icon;
            return (
              <div key={p.id} className="card" style={{ display: "flex", flexDirection: "column" }}>

                {/* Image */}
                <div className={p.imgClass} style={{ height: 180, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}>{p.emoji}</span>
                  <Icon style={{ position: "absolute", bottom: 12, right: 12, width: 18, height: 18, color: "rgba(255,255,255,0.5)" }} />
                  {/* Badges overlay */}
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: "0.4rem" }}>
                    <span className={`badge ${catBadge[p.category]}`} style={{ background: "rgba(255,255,255,0.92)" }}>{p.category}</span>
                    {p.status === "FULLY_FUNDED"
                      ? <span className="badge badge-gold" style={{ background: "rgba(255,255,255,0.92)" }}>Fully Funded</span>
                      : <span className="badge badge-green" style={{ background: "rgba(255,255,255,0.92)" }}>Active</span>}
                  </div>
                  {/* Families */}
                  {p.families > 0 && (
                    <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: 99 }}>
                      <Users size={12} /> {p.families} families
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.3rem", lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                    <MapPin size={11} /> {p.location}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, flex: 1, marginBottom: "1rem",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </p>

                  {/* Progress */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>${p.raised.toLocaleString()}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>of ${p.goal.toLocaleString()} &middot; {pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/donate?project=${p.id}`}
                    style={{
                      display: "block", textAlign: "center", padding: "0.7rem",
                      borderRadius: 12, fontWeight: 700, fontSize: "0.875rem",
                      textDecoration: "none", transition: "background 0.15s ease",
                      background: p.status === "OPEN" ? "#16a34a" : "#f3f4f6",
                      color: p.status === "OPEN" ? "#fff" : "#9ca3af",
                      cursor: p.status === "OPEN" ? "pointer" : "default",
                    }}
                  >
                    {p.status === "OPEN" ? "Donate to This Project →" : "Fully Funded ✓"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <div style={{ marginTop: "4rem", background: "#fff", borderRadius: 20, padding: "3rem 2rem", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Don&apos;t see a specific project?
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Make a general donation and our team allocates it where it&apos;s needed most.
          </p>
          <Link href="/donate" className="btn-green btn" style={{ fontSize: "0.95rem", padding: "0.75rem 2rem" }}>
            Make a General Donation <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
