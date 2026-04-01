import AdminSidebar from "@/components/admin/Sidebar";
import MobileSidebarWrapper from "@/components/MobileSidebarWrapper";

export const metadata = {
  title: "RajoRise — Admin Command Center",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0a0d12" }}>
      <MobileSidebarWrapper sidebarWidth={260}>
        <AdminSidebar />
      </MobileSidebarWrapper>
      <main className="admin-main" style={{ flex: 1, marginLeft: 260, padding: 0 }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .admin-main { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  );
}
