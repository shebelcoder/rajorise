import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
      <div>
        <div style={{ fontSize: "5rem", fontWeight: 900, color: "#e5e7eb", lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginTop: "1rem" }}>Page Not Found</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem", maxWidth: "24rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link href="/" style={{ display: "inline-block", backgroundColor: "#16a34a", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
            Go Home
          </Link>
          <Link href="/donate" style={{ display: "inline-block", backgroundColor: "#f3f4f6", color: "#374151", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
