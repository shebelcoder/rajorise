"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Photo" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>
        {label}
      </label>

      {value ? (
        // Preview
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #21262d", maxWidth: 400 }}>
          <img
            src={value}
            alt="Uploaded"
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          />
          <button
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: 8, right: 8,
              width: 28, height: 28, borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.7)", color: "#fff",
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        // Upload area
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "2px dashed #21262d",
            borderRadius: 10,
            padding: "32px 20px",
            textAlign: "center",
            cursor: uploading ? "wait" : "pointer",
            transition: "border-color 0.15s",
            backgroundColor: "#0d1117",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#22c55e")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#21262d")}
        >
          {uploading ? (
            <>
              <Loader2 size={28} style={{ color: "#22c55e", margin: "0 auto 8px", animation: "spin 1s linear infinite" }} />
              <p style={{ fontSize: 13, color: "#8b949e", margin: 0 }}>Uploading...</p>
            </>
          ) : (
            <>
              <div style={{
                width: 48, height: 48, borderRadius: 12, backgroundColor: "#161b22",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <Upload size={22} style={{ color: "#8b949e" }} />
              </div>
              <p style={{ fontSize: 13, color: "#e6edf3", fontWeight: 600, margin: "0 0 4px" }}>
                Click to upload or drag & drop
              </p>
              <p style={{ fontSize: 11, color: "#484f58", margin: 0 }}>
                JPG, PNG, WebP — max 5MB
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Or paste URL */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <ImageIcon size={12} style={{ color: "#484f58" }} />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          style={{
            flex: 1, padding: "6px 10px", backgroundColor: "#0d1117",
            border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3",
            fontSize: 11, outline: "none",
          }}
        />
      </div>

      {error && (
        <p style={{ fontSize: 11, color: "#f85149", marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}
