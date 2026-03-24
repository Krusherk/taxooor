"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "01. Dashboard" },
  { href: "/tax-calculator", label: "02. Calculator" },
  { href: "/penalties", label: "03. Penalties" },
  { href: "/compare", label: "04. Compare FX" },
  { href: "/fx-chart", label: "05. Trade Info" },
  { href: "/tax-pot", label: "06. Liquidity" },
  { href: "/wrapped", label: "07. Annual Report" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-black">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight">Taxooor.</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white/60 backdrop-blur-xl border-r border-black flex flex-col transition-transform duration-200 ease-out",
          "lg:translate-x-0 lg:z-30",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-6 py-8 border-b border-black bg-white">
          <Link
            href="/"
            className="block transition-opacity hover:opacity-70"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-serif text-3xl font-semibold tracking-tight text-black block leading-none">
              Taxooor.
            </span>
            <span className="ethos-label font-bold text-black mt-2 block">
              NTA '26 PROTOCOL
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-6 py-4 border-b border-black ethos-label transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/5"
                )}
              >
                {isActive ? `> ${item.label}` : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 bg-white border-t border-black">
          <p className="ethos-label mb-3 text-black">POWERED BY</p>
          <a
            href="https://www.raenest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ethos flex justify-between items-center w-full"
          >
            <span>RAENEST</span>
            <span>↗</span>
          </a>
        </div>
      </aside>
    </>
  );
}
