import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)"
      }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f" }}>Taxooor</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            padding: 8,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.05)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {mobileOpen ? <X style={{ width: 20, height: 20, color: "#666" }} /> : <Menu style={{ width: 20, height: 20, color: "#666" }} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(4px)",
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          height: "100%",
          width: 280,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(60px)",
          WebkitBackdropFilter: "blur(60px)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
        className={cn(
          "lg:translate-x-0 lg:z-30",
          !mobileOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div style={{ padding: "40px 32px 32px" }}>
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{ textDecoration: "none", display: "block" }}
          >
            <span style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1d1d1f",
              display: "block",
              lineHeight: 1,
            }}>
              Taxooor
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#86868b",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginTop: 8,
              display: "block",
            }}>
              Compliance Protocol
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    background: isActive ? "#1d1d1f" : "transparent",
                    color: isActive ? "#fff" : "#1d1d1f",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <Icon
                    style={{ width: 20, height: 20, color: isActive ? "#fff" : "#86868b" }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer CTA */}
        <div style={{ padding: 20 }}>
          <div style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: 24,
            padding: 20,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
              Powered By
            </p>
            <a
              href="https://www.raenest.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#007AFF",
                color: "#fff",
                borderRadius: 9999,
                padding: "12px 0",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease",
                width: "100%",
                border: "none",
              }}
            >
              Raenest
              <TrendingUp style={{ width: 16, height: 16 }} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
