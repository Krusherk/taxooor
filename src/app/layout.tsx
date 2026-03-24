import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // Inter offers tracking very close to San Francisco when specifically styled
});

export const metadata: Metadata = {
  title: "Taxooor",
  description: "A premium compliance protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-background text-foreground font-sans selection:bg-[#007AFF] selection:text-white">
        <Sidebar />
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen relative">
          <div className="max-w-[72rem] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-24">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
