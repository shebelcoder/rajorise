"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const QUALITY = 0.75;

/** Compress and resize image client-side using Canvas */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Resize if too large
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, else JPEG
        let dataUrl = canvas.toDataURL("image/webp", QUALITY);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ value, onChange, label = "Photo" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB before compression.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Compress client-side — no server upload needed
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch {
      setError("Failed to process image.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
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
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #21262d" }}>
          <img
            src={value}
            alt="Uploaded"
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
          <button
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: 8, right: 8,
              width: 30, height: 30, borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.7)", color: "#fff",
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            padding: "12px", fontSize: 11, color: "rgba(255,255,255,0.7)",
          }}>
            Auto-resized to max {MAX_WIDTH}x{MAX_HEIGHT}px
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "2px dashed #21262d",
            borderRadius: 10,
            padding: "36px 20px",
            textAlign: "center",
            cursor: uploading ? "wait" : "pointer",
            backgroundColor: "#0d1117",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#22c55e")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#21262d")}
        >
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Loader2 size={32} style={{ color: "#22c55e" }} className="animate-spin" />
              <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 600, margin: 0 }}>Compressing & uploading...</p>
            </div>
          ) : (
            <>
              <div style={{
                width: 52, height: 52, borderRadius: 12, backgroundColor: "#161b22",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", border: "1px solid #21262d",
              }}>
                <Upload size={24} style={{ color: "#8b949e" }} />
              </div>
              <p style={{ fontSize: 14, color: "#e6edf3", fontWeight: 600, margin: "0 0 4px" }}>
                Click to upload or drag & drop
              </p>
              <p style={{ fontSize: 12, color: "#484f58", margin: 0 }}>
                JPG, PNG, WebP — auto-resized to fit
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
          value={value.startsWith("data:") ? "" : value}
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
