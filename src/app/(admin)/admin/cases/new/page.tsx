import AdminCreateForm from "@/components/admin/CreateForm";

const FIELDS = [
  { key: "title", label: "Title", type: "text" as const },
  { key: "fullStory", label: "Full Story", type: "textarea" as const },
  { key: "region", label: "Region", type: "region" as const },
  { key: "district", label: "District", type: "district" as const },
  { key: "village", label: "Village", type: "village" as const },
  { key: "goalAmount", label: "Goal Amount (USD)", type: "number" as const },
  { key: "featuredImageUrl", label: "Cover Image", type: "image" as const },
  { key: "isUrgent", label: "Mark as Urgent", type: "boolean" as const },
];

export default function AdminNewCasePage() {
  return <AdminCreateForm entityType="cases" fields={FIELDS} backUrl="/admin/cases" title="Create New Case" subtitle="Admin-created cases are published immediately (APPROVED)" />;
}
