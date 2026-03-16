import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const story = formData.get("story") as string;
    const familiesAffected = Number(formData.get("familiesAffected") || 0);
    const amountNeeded = Number(formData.get("amountNeeded") || 0);
    const videoUrl = formData.get("videoUrl") as string | null;
    const images = formData.getAll("images") as File[];

    if (!title || !location || !category || !story) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // TODO: Upload images to S3, save report to DB
    // const imageUrls = await Promise.all(images.map(img => uploadToS3(img)));
    // const report = await prisma.report.create({
    //   data: { title, location, category, story, familiesAffected, amountNeeded, videoUrl, images: imageUrls, authorId: session.user.id }
    // });

    console.log("New report submitted:", { title, location, category, familiesAffected, amountNeeded, imageCount: images.length });

    return NextResponse.json({ success: true, message: "Report submitted for review." });
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json({ error: "Failed to submit report." }, { status: 500 });
  }
}
