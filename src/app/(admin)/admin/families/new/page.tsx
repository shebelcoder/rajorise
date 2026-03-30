import AdminCreateForm from "@/components/admin/CreateForm";

const FIELDS = [
  { key: "name", label: "Family Name", type: "text" as const },
  { key: "members", label: "Members", type: "number" as const },
  { key: "situation", label: "Situation", type: "text" as const },
  { key: "need", label: "Primary Need", type: "text" as const },
  { key: "region", label: "Region", type: "region" as const },
  { key: "district", label: "District", type: "district" as const },
  { key: "village", label: "Village", type: "village" as const },
  { key: "story", label: "Story", type: "textarea" as const },
  { key: "imageUrl", label: "Family Photo", type: "image" as const },
  { key: "phoneContact", label: "Contact Phone", type: "text" as const },
  { key: "goalAmount", label: "Goal Amount (USD)", type: "number" as const },
];

export default function AdminNewFamilyPage() {
  return <AdminCreateForm entityType="families" fields={FIELDS} backUrl="/admin/families" title="Create New Family" subtitle="Admin-created families are published immediately" />;
}
