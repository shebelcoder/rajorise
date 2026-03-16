"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Heart, Droplets, GraduationCap } from "lucide-react";

const stats = [
  { icon: Heart,         label: "Total Donated",      value: 125340, prefix: "$" },
  { icon: Users,         label: "Families Helped",     value: 340,    prefix: "",  suffix: "+" },
  { icon: GraduationCap, label: "Students Supported",  value: 89,     prefix: "" },
  { icon: Droplets,      label: "Water Trucks",        value: 47,     prefix: "" },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const raf = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, active]);
  return n;
}

function Stat({ icon: Icon, label, value, prefix, suffix = "" }: typeof stats[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const n = useCountUp(value, 1800, on);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ background: "#fff", borderRadius: 16, padding: "1.75rem 1rem", textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,.05)" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem" }}>
        <Icon size={22} color="#16a34a" />
      </div>
      <p style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
        {prefix}{n.toLocaleString()}{suffix}
      </p>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.4rem" }}>{label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section style={{ padding: "4rem 1.25rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            Real Impact, Real Numbers
          </h2>
          <p style={{ color: "#6b7280", marginTop: "0.4rem", fontSize: "0.9rem" }}>Live statistics updated as donations arrive</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
