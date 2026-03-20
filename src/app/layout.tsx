import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RajoRise – Hope Into Life",
  description:
    "A transparent humanitarian donation platform connecting donors worldwide with communities in need.",
  keywords: ["donation", "humanitarian", "charity", "water", "food", "education", "hope"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "RajoRise – Hope Into Life",
    description: "Plant Hope. Change a Life. Direct donations with full transparency.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "4rem" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
