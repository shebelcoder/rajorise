"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin and journalist workspaces have their own layouts — no public nav/footer
  const isInternalWorkspace =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/journalist") && !pathname.startsWith("/portal/journalist"));

  if (isInternalWorkspace) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "4rem" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
