"use client";

import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { getEntries, getSettings, saveSettings, getTotalNGN } from "@/lib/store";
import { calculateTax } from "@/lib/tax";

export default function TaxPotPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettingsState] = useState(getSettings());
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => { setMounted(true); setSettingsState(getSettings()); }, []);

  const entries = mounted ? getEntries() : [];
  const totalNGN = getTotalNGN(entries, settings.exchangeRate);
  const taxResult = useMemo(() => calculateTax(totalNGN), [totalNGN]);

  const recommendedSavings = totalNGN * (settings.taxPotPercentage / 100);
  const taxCoverage = taxResult.totalTax > 0 ? Math.min(100, (settings.taxPotSaved / taxResult.totalTax) * 100) : 0;

  const handleDeposit = () => {
    const a = parseFloat(depositAmount) || 0;
    if (a <= 0) return;
    const updated = saveSettings({ taxPotSaved: settings.taxPotSaved + a });
    setSettingsState(updated);
    setDepositAmount("");
  };

  const handlePercentChange = (pct: number) => {
    setSettingsState(saveSettings({ taxPotPercentage: pct }));
  };

  const handleReset = () => {
    setSettingsState(saveSettings({ taxPotSaved: 0 }));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="border-b border-black pb-6">
        <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black leading-none">
          Liquidity.
        </h1>
        <p className="ethos-label mt-4 text-black font-bold">
          PIT HOLDING ALLOCATION PROTOCOL
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-black bg-white/40 backdrop-blur-md">
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
          <p className="ethos-label text-black/50 mb-2">ASSESSED OBLIGATION</p>
          <p className="font-serif text-3xl font-semibold text-black">{formatCurrency(taxResult.totalTax)}</p>
        </div>
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-black bg-black text-white">
          <p className="ethos-label text-white/50 mb-2">CURRENT RESERVES</p>
          <p className="font-serif text-3xl font-semibold text-[#00FF88]">{formatCurrency(settings.taxPotSaved)}</p>
        </div>
        <div className="p-6 bg-white">
          <p className="ethos-label text-black/50 mb-2">UNFUNDED DEBT</p>
          <p className="font-serif text-3xl font-semibold text-[#FE4A03]">
            {formatCurrency(Math.max(0, taxResult.totalTax - settings.taxPotSaved))}
          </p>
        </div>
      </div>

      <div className="border border-black bg-white">
        <div className="px-6 py-4 border-b border-black flex items-center justify-between">
          <span className="ethos-label font-bold">RESERVE CAPACITY</span>
          <span className="font-mono text-sm font-bold">{taxCoverage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-8 bg-black/5 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00FF88] border-r border-black transition-all duration-1000 ease-out" 
            style={{ width: `${taxCoverage}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black bg-white/60 backdrop-blur-md">
        
        {/* Transfer Input */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-black flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="ethos-label font-bold text-lg">ALLOCATE RESERVES</h3>
            {settings.taxPotSaved > 0 && (
              <button onClick={handleReset} className="ethos-label text-[#FE4A03] hover:underline text-[10px]">
                [RESET]
              </button>
            )}
          </div>
          
          <div className="flex gap-0 border border-black mb-6">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="NGN"
              className="flex-1 bg-white px-4 py-3 font-mono text-sm border-0 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
            />
            <button onClick={handleDeposit} className="bg-black text-white font-mono text-xs px-6 tracking-wider hover:bg-black/80 transition-colors">
              TRANSFER
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="ethos-label flex items-center mr-2">QUICK: </span>
            {[10000, 50000, 100000].map((p) => (
              <button 
                key={p} 
                onClick={() => setDepositAmount(p.toString())}
                className="ethos-label px-2 py-1 border border-black bg-white hover:bg-black hover:text-white transition-colors text-[10px]"
              >
                +{formatCurrency(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Configuration */}
        <div className="p-8 bg-black text-white">
          <h3 className="ethos-label font-bold text-lg mb-6">WITHHOLDING POLICY</h3>
          
          <div className="flex gap-0 border border-white mb-6">
            {[15, 20, 25].map((pct) => (
              <button 
                key={pct} 
                onClick={() => handlePercentChange(pct)}
                className={`flex-1 py-3 font-mono text-sm border-r border-white last:border-0 transition-colors ${
                  settings.taxPotPercentage === pct 
                    ? "bg-[#00FF88] text-black font-bold" 
                    : "hover:bg-white/10"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/20">
            <p className="ethos-label text-white/50 mb-2">TARGET ANNUAL ALLOCATION</p>
            <p className="font-serif text-4xl text-[#00FF88]">{formatCurrency(recommendedSavings)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
