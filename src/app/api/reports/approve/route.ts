import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reportId, action } = await req.json();

    if (!reportId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // TODO: Verify admin session, update report status in DB
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // await prisma.report.update({ where: { id: reportId }, data: { status: action === "approve" ? "APPROVED" : "REJECTED" } });

    console.log(`Report ${reportId} ${action}d by admin`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report approval error:", error);
    return NextResponse.json({ error: "Failed to update report." }, { status: 500 });
  }
}
