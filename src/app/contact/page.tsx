"use client";

import { useState } from "react";
import { Mail, MessageSquare, Camera, CheckCircle } from "lucide-react";

const REASONS = [
  { id: "general", label: "General Question" },
  { id: "journalist", label: "Journalist Application" },
  { id: "partnership", label: "Partnership / NGO" },
  { id: "report-issue", label: "Report an Issue" },
  { id: "media", label: "Media Inquiry" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", reason: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h2>
          <p className="text-gray-500">We will get back to you within 24 hours at {form.email}.</p>
          <button onClick={() => setSent(false)} className="mt-6 btn-primary px-6 py-2.5 text-sm">
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg">Questions, partnership inquiries, journalist applications — we read every message.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" value={form.name} onChange={set("name")} required placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Contact</label>
                <select value={form.reason} onChange={set("reason")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 outline-none">
                  {REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea value={form.message} onChange={set("message")} required rows={6}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none resize-none" />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Us", content: "hello@rajorise.org", sub: "Response within 24 hours" },
              { icon: Camera, title: "Journalist Applications", content: "Apply via the form", sub: "We review every application" },
              { icon: MessageSquare, title: "Partnerships", content: "NGOs & organizations", sub: "Let's collaborate for impact" },
            ].map(({ icon: Icon, title, content, sub }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-gray-700 text-sm mt-0.5">{content}</p>
                    <p className="text-gray-400 text-xs mt-1">{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Become a Journalist</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you based in an affected region? We need trusted field reporters to document real stories.
              </p>
              <p className="text-xs text-gray-500">Use the contact form with reason "Journalist Application" and tell us about your experience and location.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
