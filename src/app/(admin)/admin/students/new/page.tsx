import AdminCreateForm from "@/components/admin/CreateForm";

const FIELDS = [
  { key: "name", label: "Name", type: "text" as const },
  { key: "age", label: "Age", type: "number" as const },
  { key: "grade", label: "Grade", type: "text" as const },
  { key: "region", label: "Region", type: "region" as const },
  { key: "district", label: "District", type: "district" as const },
  { key: "village", label: "Village", type: "village" as const },
  { key: "story", label: "Story", type: "textarea" as const },
  { key: "imageUrl", label: "Student Photo", type: "image" as const },
  { key: "goalAmount", label: "Goal Amount (USD/year)", type: "number" as const },
];

export default function AdminNewStudentPage() {
  return <AdminCreateForm entityType="students" fields={FIELDS} backUrl="/admin/students" title="Create New Student" subtitle="Admin-created students are published immediately" />;
}
