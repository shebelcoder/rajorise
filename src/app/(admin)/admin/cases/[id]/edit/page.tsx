import AdminEditForm from "@/components/admin/EditForm";

const FIELDS = [
  { key: "title", label: "Title", type: "text" as const },
  { key: "summary", label: "Summary", type: "textarea" as const },
  { key: "fullStory", label: "Full Story", type: "textarea" as const },
  { key: "region", label: "Region", type: "region" as const },
  { key: "district", label: "District", type: "district" as const },
  { key: "village", label: "Village", type: "village" as const },
  { key: "goalAmount", label: "Goal Amount (USD)", type: "number" as const },
  { key: "featuredImageUrl", label: "Cover Image URL", type: "url" as const },
  { key: "isUrgent", label: "Mark as Urgent", type: "boolean" as const },
  { key: "status", label: "Status", type: "select" as const, options: [
    { value: "DRAFT", label: "Draft" }, { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" }, { value: "REJECTED", label: "Rejected" },
    { value: "FUNDING", label: "Funding" }, { value: "COMPLETED", label: "Completed" },
  ]},
];

export default async function AdminEditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditForm entityType="cases" entityId={id} fields={FIELDS} backUrl="/admin/cases" title="Edit Case" />;
}
