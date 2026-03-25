"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", backgroundColor: "#f9fafb" }}>
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#9888;</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>Critical Error</h1>
            <p style={{ color: "#6b7280", maxWidth: "24rem", marginBottom: "1.5rem" }}>
              Something went seriously wrong. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{ backgroundColor: "#16a34a", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
