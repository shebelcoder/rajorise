import JournalistSidebar from "@/components/journalist/Sidebar";
import MobileSidebarWrapper from "@/components/MobileSidebarWrapper";

export const metadata = {
  title: "RajoRise — Journalist Workspace",
};

export default function JournalistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f1117" }}>
      <MobileSidebarWrapper sidebarWidth={240}>
        <JournalistSidebar />
      </MobileSidebarWrapper>
      <main className="journalist-main" style={{ flex: 1, marginLeft: 240, padding: "0" }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .journalist-main { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  );
}
