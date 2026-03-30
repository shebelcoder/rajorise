export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "4rem 1rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Last updated: March 2026</p>

        {[
          { title: "Platform Purpose", content: "RajoRise is a humanitarian donation platform connecting donors with verified cases of need in Somalia. All cases are documented by field journalists and verified by our admin team before publication." },
          { title: "Donations", content: "All donations are voluntary and non-refundable unless a case is cancelled before funds are allocated. Donations are processed securely through Stripe. You will receive a confirmation email for each donation." },
          { title: "Accounts", content: "You may create a donor account to track your donation history. You are responsible for maintaining the confidentiality of your login credentials. Public registration always creates a DONOR account — staff accounts are created by administrators only." },
          { title: "Content", content: "All case reports, stories, and updates are created by verified journalists and reviewed by our admin team. We strive for accuracy but cannot guarantee all information is current at all times." },
          { title: "Transparency", content: "We are committed to full transparency. All platform statistics are derived from real database records. Financial data is tracked and auditable." },
          { title: "Prohibited Use", content: "You may not use this platform for fraudulent purposes, to submit false information, or to attempt unauthorized access to admin or journalist portals." },
          { title: "Limitation of Liability", content: "RajoRise provides the platform in good faith. We are not liable for the actions of third-party payment processors, field conditions beyond our control, or losses arising from use of the platform." },
          { title: "Changes", content: "We may update these terms at any time. Continued use of the platform constitutes acceptance of updated terms." },
          { title: "Contact", content: "For questions about these terms, contact: hello@rajorise.com" },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h2>
            <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
