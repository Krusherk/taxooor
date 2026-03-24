import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { getEntries, getSettings, getTotalNGN, getTotalUSD } from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import type { IncomeEntry } from "@/lib/types";
import { ArrowRight } from "lucide-react";

function getBusiestMonth(entries: IncomeEntry[]): string {
  if (!entries.length) return "—";
  const counts: Record<string, number> = {};
  for (const e of entries) {
    const m = new Date(e.date).toLocaleString("en-US", { month: "short", year: "numeric" });
    counts[m] = (counts[m] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getTopPlatform(entries: IncomeEntry[], rate: number): string {
  if (!entries.length) return "—";
  const totals: Record<string, number> = {};
  for (const e of entries) {
    const ngn = e.currency === "NGN" ? e.amount : e.amount * rate;
    totals[e.platform] = (totals[e.platform] || 0) + ngn;
  }
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
}

export default function WrappedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const settings = mounted ? getSettings() : { exchangeRate: 1380, taxPotPercentage: 20, taxPotSaved: 0 };
  const entries = mounted ? getEntries() : [];
  const totalUSD = getTotalUSD(entries, settings.exchangeRate);
  const totalNGN = getTotalNGN(entries, settings.exchangeRate);
  const taxResult = useMemo(() => calculateTax(totalNGN), [totalNGN]);
  const raenestSavings = totalNGN * 0.03;

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Annual Wrapped
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Financial Summary {new Date().getFullYear()}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Big Number */}
        <div className="apple-card p-10 md:p-14 flex flex-col justify-center bg-white/60">
          <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Total Value Inbound (USD)</p>
          <p className="text-6xl lg:text-[100px] font-bold tracking-tighter-apple leading-[0.9] text-[#1d1d1f]">
            {formatCurrency(totalUSD, "USD")}
          </p>
          <div className="mt-8 pt-8 border-t border-black/5">
            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Exchanged Equivalent</p>
            <p className="text-2xl font-bold tracking-tighter-apple text-[#86868b]">
              {formatCurrency(totalNGN, "NGN")}
            </p>
          </div>
        </div>

        {/* Right Detail Numbers */}
        <div className="flex flex-col gap-6">
          <div className="apple-card p-8 md:p-10 flex-1">
            <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Estimated Tax Duty</p>
            <p className="text-5xl lg:text-6xl font-bold tracking-tighter-apple text-[#FF3B30] leading-none mb-4">
              {formatCurrency(taxResult.totalTax)}
            </p>
            <span className="bg-[#FF3B30]/10 text-[#FF3B30] px-3 py-1 rounded-full text-[13px] font-bold">
              {taxResult.effectiveRate.toFixed(1)}% Effective
            </span>
          </div>
          
          <div className="apple-card p-8 md:p-10 flex-1 bg-gradient-to-br from-[#007AFF] to-[#0055b3] text-white border-transparent shadow-[0_8px_32px_rgba(0,122,255,0.3)]">
            <p className="text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-4">Yield Retention (Raenest)</p>
            <p className="text-5xl lg:text-6xl font-bold tracking-tighter-apple leading-none">
              +{formatCurrency(raenestSavings)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-8">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Top Client Source</p>
          <p className="text-2xl font-bold tracking-tighter-apple text-[#1d1d1f]">{getTopPlatform(entries, settings.exchangeRate)}</p>
        </div>
        <div className="apple-card p-8">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Highest Volume Period</p>
          <p className="text-2xl font-bold tracking-tighter-apple text-[#1d1d1f]">{getBusiestMonth(entries)}</p>
        </div>
        <div className="apple-card p-8">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Liquidity Shield</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold tracking-tighter-apple text-[#007AFF]">{formatCurrency(settings.taxPotSaved)}</p>
          </div>
        </div>
      </div>

      <div className="apple-card p-12 mt-12 text-center bg-white/70">
        <h2 className="text-3xl font-bold tracking-tighter-apple mb-6">Maximize Returns Next Year</h2>
        <a href="https://www.raenest.com" target="_blank" rel="noopener noreferrer" className="btn-apple bg-[#007AFF] hover:bg-[#0066cc] inline-flex items-center gap-2">
          Activate Raenest FastTrack <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
