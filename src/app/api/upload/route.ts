import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB (after client compression)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || !["JOURNALIST", "ADMIN"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`upload:${ip}`, { max: 20, windowSeconds: 3600 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many uploads." }, { status: 429 });
  }

  try {
    const { dataUrl } = await req.json();

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data." }, { status: 400 });
    }

    // Check size (base64 is ~33% larger than binary)
    const sizeBytes = Math.ceil((dataUrl.length * 3) / 4);
    if (sizeBytes > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large after compression. Try a smaller image." }, { status: 400 });
    }

    // Return the data URL directly — it's stored in the DB as the image URL
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
