import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CaseEditor from "@/components/journalist/CaseEditor";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || user.role !== "JOURNALIST") {
    redirect("/portal/journalist-login");
  }

  const { id } = await params;

  const report = await prisma.report.findFirst({
    where: { id, journalistId: user.id },
    select: {
      id: true,
      title: true,
      fullStory: true,
      region: true,
      district: true,
      village: true,
      goalAmount: true,
      featuredImageUrl: true,
      status: true,
    },
  });

  if (!report) notFound();

  const initialData = {
    id: report.id,
    title: report.title,
    story: report.fullStory,
    region: report.region,
    district: report.district || "",
    village: report.village || "",
    goalAmount: Number(report.goalAmount).toString(),
    coverImageUrl: report.featuredImageUrl || "",
    status: report.status,
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", marginBottom: 8 }}>Edit Case</h1>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 28 }}>
        {report.status === "REJECTED" ? "This case was rejected — edit and resubmit." : "Make changes and save or submit for review."}
      </p>
      <CaseEditor initialData={initialData} />
    </div>
  );
}
