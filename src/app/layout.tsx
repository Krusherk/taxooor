import type { Metadata } from "next";
import { EB_Garamond, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Taxooor — Compliance & Yield",
  description: "Editorial fintech grade compliance protocol for NTA 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${garamond.variable} ${spaceMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-background text-foreground font-sans selection:bg-black selection:text-white">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen relative border-l border-black bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
