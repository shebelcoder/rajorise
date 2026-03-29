import JournalistSidebar from "@/components/journalist/Sidebar";

export const metadata = {
  title: "RajoRise — Journalist Workspace",
};

export default function JournalistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f1117" }}>
      <JournalistSidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "0" }}>
        {children}
      </main>
    </div>
  );
}
