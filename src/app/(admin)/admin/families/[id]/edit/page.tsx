import AdminEditForm from "@/components/admin/EditForm";

const FIELDS = [
  { key: "name", label: "Family Name", type: "text" as const },
  { key: "members", label: "Members", type: "number" as const },
  { key: "situation", label: "Situation", type: "text" as const },
  { key: "need", label: "Primary Need", type: "text" as const },
  { key: "region", label: "Region", type: "region" as const },
  { key: "district", label: "District", type: "district" as const },
  { key: "village", label: "Village", type: "village" as const },
  { key: "story", label: "Story", type: "textarea" as const },
  { key: "imageUrl", label: "Photo URL", type: "url" as const },
  { key: "phoneContact", label: "Contact Phone", type: "text" as const },
  { key: "goalAmount", label: "Goal Amount (USD)", type: "number" as const },
  { key: "status", label: "Status", type: "select" as const, options: [
    { value: "DRAFT", label: "Draft" }, { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" }, { value: "REJECTED", label: "Rejected" },
  ]},
  { key: "isActive", label: "Active", type: "boolean" as const },
];

export default async function AdminEditFamilyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditForm entityType="families" entityId={id} fields={FIELDS} backUrl="/admin/families" title="Edit Family" />;
}
