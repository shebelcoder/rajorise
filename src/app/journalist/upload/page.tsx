"use client";

import { useState } from "react";
import { Upload, MapPin, Users, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

const CATEGORIES = [
  { id: "WATER", label: "Water Crisis", icon: "💧" },
  { id: "FOOD", label: "Food/Hunger", icon: "🌾" },
  { id: "EDUCATION", label: "Education", icon: "📚" },
  { id: "MEDICAL", label: "Medical", icon: "🏥" },
  { id: "EMERGENCY", label: "Emergency Relief", icon: "🚨" },
];

export default function JournalistUploadPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    story: "",
    familiesAffected: "",
    amountNeeded: "",
    videoUrl: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.category || !form.story) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));

      const res = await fetch("/api/reports/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || "Submission failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-10 text-center">
          <div className="w-16 h-16 bg-green-900/50 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Report Submitted!</h2>
          <p className="text-gray-400 mb-6">Your report is now pending admin review. It will be published once approved.</p>
          <button
            onClick={() => { setSuccess(false); setForm({ title: "", location: "", category: "", story: "", familiesAffected: "", amountNeeded: "", videoUrl: "" }); setImages([]); }}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Field Report</h1>
          <p className="text-gray-400">Your report will be reviewed by the admin team before publishing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl border border-gray-700 p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              required
              placeholder="e.g. Severe drought in Village X — 20 families need water"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Location + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={set("location")}
                required
                placeholder="Village, Region, Country"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                value={form.category}
                onChange={set("category")}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-green-500 outline-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Story *</label>
            <textarea
              value={form.story}
              onChange={set("story")}
              required
              rows={6}
              placeholder="Describe the situation in detail. Who is affected? What happened? What is urgently needed? Include any key facts."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{form.story.length} characters</p>
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Families Affected
              </label>
              <input
                type="number"
                value={form.familiesAffected}
                onChange={set("familiesAffected")}
                min={0}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5" /> Amount Needed (USD)
              </label>
              <input
                type="number"
                value={form.amountNeeded}
                onChange={set("amountNeeded")}
                min={0}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Photos</label>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-600">JPG, PNG, WEBP — max 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            {images.length > 0 && (
              <p className="text-sm text-green-400 mt-2">{images.length} image(s) selected</p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (optional)</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={set("videoUrl")}
              placeholder="YouTube or direct video link"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-green-500 outline-none"
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Upload className="w-5 h-5" /> Submit Report for Review</>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your report will be reviewed by an admin before it goes live. This usually takes 2-24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
