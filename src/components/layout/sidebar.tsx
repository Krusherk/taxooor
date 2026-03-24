"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calculator, AlertOctagon, ArrowRightLeft, TrendingUp, PiggyBank, FileText, Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tax-calculator", label: "Calculator", icon: Calculator },
  { href: "/penalties", label: "Penalties", icon: AlertOctagon },
  { href: "/compare", label: "Compare FX", icon: ArrowRightLeft },
  { href: "/fx-chart", label: "Volatility", icon: TrendingUp },
  { href: "/tax-pot", label: "Tax Pot", icon: PiggyBank },
  { href: "/wrapped", label: "Wrapped", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/75 backdrop-blur-2xl border-b border-black/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight-apple">Taxooor</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5 text-black/70" /> : <Menu className="w-5 h-5 text-black/70" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white/60 backdrop-blur-[60px] border-r border-black/5 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
          "lg:translate-x-0 lg:z-30",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-8 py-10">
          <Link
            href="/"
            className="block transition-transform active:scale-95"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-3xl font-bold tracking-tighter-apple text-[#1d1d1f] block leading-none">
              Taxooor
            </span>
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mt-2 block">
              Compliance Protocol
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#1d1d1f] text-white shadow-md shadow-black/10 scale-100"
                    : "text-[#1d1d1f] hover:bg-black/5 scale-[0.98] hover:scale-100"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#86868b]")} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-black/5 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Powered By</p>
            <a
              href="https://www.raenest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple bg-[#007AFF] hover:bg-[#0066CC] flex justify-center items-center w-full text-[14px] py-3 gap-2"
            >
              Raenest
              <TrendingUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
