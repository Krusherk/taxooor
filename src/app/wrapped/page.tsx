"use client";

import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { getEntries, getSettings, getTotalNGN, getTotalUSD } from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import type { IncomeEntry } from "@/lib/types";

function getBusiestMonth(entries: IncomeEntry[]): string {
  if (!entries.length) return "—";
  const counts: Record<string, number> = {};
  for (const e of entries) {
    const m = new Date(e.date).toLocaleString("en-NG", { month: "short", year: "numeric" });
    counts[m] = (counts[m] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0].toUpperCase();
}

function getTopPlatform(entries: IncomeEntry[], rate: number): string {
  if (!entries.length) return "—";
  const totals: Record<string, number> = {};
  for (const e of entries) {
    const ngn = e.currency === "NGN" ? e.amount : e.amount * rate;
    totals[e.platform] = (totals[e.platform] || 0) + ngn;
  }
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0].toUpperCase();
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
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Editorial Header */}
      <div className="border-b border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="ethos-title text-6xl md:text-8xl font-semibold text-black leading-none">
            Annual Report.
          </h1>
          <p className="ethos-label mt-6 text-black font-bold">
            FY {new Date().getFullYear()} / COMPREHENSIVE YIELD ANALYSIS
          </p>
        </div>
        <div className="bg-black text-white px-4 py-2 ethos-label text-xs">
          CONFIDENTIAL
        </div>
      </div>

      {/* Hero Stats Spread */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black bg-white/40 backdrop-blur-md">
        
        {/* Left Big Number */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-white">
          <p className="ethos-label text-black/50 mb-4">I. GROSS RECEIPTS (USD)</p>
          <p className="font-serif text-6xl md:text-8xl text-black leading-tight tracking-tight">
            {formatCurrency(totalUSD, "USD")}
          </p>
          <div className="mt-8 pt-6 border-t border-black">
            <p className="ethos-label text-black/50 mb-1">LOCAL EXCHANGED VALUE</p>
            <p className="font-mono text-xl md:text-2xl text-black font-bold">
              {formatCurrency(totalNGN, "NGN")} <span className="text-sm opacity-50">@ ₦{settings.exchangeRate}</span>
            </p>
          </div>
        </div>

        {/* Right Detail Numbers */}
        <div className="flex flex-col">
          <div className="flex-1 p-8 md:p-12 border-b border-black bg-black text-white">
            <p className="ethos-label text-white/50 mb-4">II. ASSESSED TAX DEBT</p>
            <p className="font-serif text-5xl md:text-7xl text-[#FE4A03] leading-tight">
              {formatCurrency(taxResult.totalTax)}
            </p>
            <p className="ethos-label text-white/50 mt-4">
              EFFECTIVE BURDEN: {taxResult.effectiveRate.toFixed(1)}%
            </p>
          </div>
          
          <div className="flex-1 p-8 md:p-12 bg-[#00FF88] text-black">
            <p className="ethos-label text-black/50 mb-4 font-bold">III. ARBITRAGE YIELD</p>
            <p className="font-serif text-5xl md:text-7xl text-black leading-tight">
              {formatCurrency(raenestSavings)}
            </p>
            <p className="ethos-label mt-4 font-bold">
              CAPITAL RETAINED VIA RAENEST
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black bg-white/40 backdrop-blur-md">
        <div className="p-8 border-b md:border-b-0 md:border-r border-black">
          <p className="ethos-label text-black/50 mb-4">PRIMARY ORIGIN</p>
          <p className="font-mono text-2xl font-bold text-black">{getTopPlatform(entries, settings.exchangeRate)}</p>
        </div>
        <div className="p-8 border-b md:border-b-0 md:border-r border-black">
          <p className="ethos-label text-black/50 mb-4">PEAK VOLUME NODE</p>
          <p className="font-mono text-2xl font-bold text-black">{getBusiestMonth(entries)}</p>
        </div>
        <div className="p-8 bg-black text-white">
          <p className="ethos-label text-white/50 mb-4">LIQUIDITY RESERVE</p>
          <p className="font-mono text-2xl font-bold text-[#00FF88]">{formatCurrency(settings.taxPotSaved)}</p>
          <p className="ethos-label text-[#00FF88] text-[10px] mt-2">
            {taxResult.totalTax > 0 ? `${((settings.taxPotSaved / taxResult.totalTax) * 100).toFixed(0)}% COVERAGE` : "FULLY COVERED"}
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="ethos-title text-4xl mb-6">Optimize.</h2>
        <a href="https://www.raenest.com" target="_blank" rel="noopener noreferrer" className="btn-ethos inline-flex">
          {">"} ACTIVATE RAENEST FASTTRACK
        </a>
      </div>
    </div>
  );
}
