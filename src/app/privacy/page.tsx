export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "4rem 1rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Last updated: March 2026</p>

        {[
          { title: "Information We Collect", content: "We collect your name, email address, and payment information when you make a donation. We also collect basic usage data to improve our platform." },
          { title: "How We Use Your Data", content: "Your information is used to process donations, send receipts, provide donation history, and communicate updates about cases you've supported. We never sell your data to third parties." },
          { title: "Payment Security", content: "All payments are processed through Stripe. We never store credit card numbers on our servers. Stripe is PCI Level 1 certified — the highest level of security certification." },
          { title: "Cookies", content: "We use essential cookies for authentication (NextAuth session tokens). We do not use tracking cookies or third-party advertising cookies." },
          { title: "Data Retention", content: "Donation records are kept indefinitely for transparency and tax receipt purposes. You may request deletion of your account and personal data by contacting us." },
          { title: "Your Rights", content: "You have the right to access, update, or delete your personal data. Contact us at hello@rajorise.com for any data-related requests." },
          { title: "Contact", content: "For privacy-related questions, contact: hello@rajorise.com" },
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
