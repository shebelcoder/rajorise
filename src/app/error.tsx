"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
      <div>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#9888;</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>Something Went Wrong</h1>
        <p style={{ color: "#6b7280", maxWidth: "24rem", marginBottom: "1.5rem" }}>
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1rem" }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{ backgroundColor: "#16a34a", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "0.875rem" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
