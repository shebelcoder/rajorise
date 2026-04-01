"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, User } from "lucide-react";

const navLinks = [
  { href: "/projects",  label: "Projects" },
  { href: "/students",  label: "Students" },
  { href: "/families",  label: "Families" },
  { href: "/impact",    label: "Impact" },
  { href: "/stories",   label: "Stories" },
  { href: "/about",     label: "About" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: "4rem",
        backgroundColor: "rgba(255,255,255,0.97)",
        borderBottom: "1px solid #e5e7eb",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="RajoRise" width={34} height={34} style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#111827", letterSpacing: "-0.02em" }}>
            Rajo<span style={{ color: "#16a34a" }}>Rise</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#16a34a")}
              onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="desktop-cta" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isLoggedIn ? (
            <Link href="/account" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}>
              <User size={16} /> {session.user?.name || "Account"}
            </Link>
          ) : (
            <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}>
              Sign In
            </Link>
          )}
          <Link href="/donate" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 700,
            backgroundColor: "#16a34a", color: "#fff", borderRadius: "0.75rem",
            textDecoration: "none",
          }}>
            Donate Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", color: "#374151", display: "none" }}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "1rem 1.25rem" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "0.6rem 0", fontSize: "0.9rem", fontWeight: 500, color: "#374151", textDecoration: "none", borderBottom: "1px solid #f3f4f6" }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {isLoggedIn ? (
              <Link href="/account" onClick={() => setOpen(false)} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}>My Account</Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}>Sign In</Link>
            )}
            <Link href="/donate" onClick={() => setOpen(false)} style={{ textAlign: "center", padding: "0.65rem", backgroundColor: "#16a34a", color: "#fff", borderRadius: "0.75rem", fontWeight: 700, textDecoration: "none" }}>Donate Now</Link>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
