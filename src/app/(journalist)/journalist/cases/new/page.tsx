import CaseEditor from "@/components/journalist/CaseEditor";

export default function NewCasePage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", marginBottom: 8 }}>Create New Case</h1>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 28 }}>
        Document the situation in detail. Save as draft anytime, submit when ready.
      </p>
      <CaseEditor />
    </div>
  );
}
