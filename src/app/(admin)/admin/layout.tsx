import AdminSidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "RajoRise — Admin Command Center",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0a0d12" }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: 260, padding: 0 }}>
        {children}
      </main>
    </div>
  );
}
