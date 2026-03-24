import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { getEntries, getSettings, saveSettings, getTotalNGN } from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import { RefreshCw } from "lucide-react";

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
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Tax Pot
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Statutory Liquidity Reserves.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Assessed Obligation</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple text-[#1d1d1f]">{formatCurrency(taxResult.totalTax)}</p>
        </div>
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Unfunded Capital</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple text-[#FF3B30]">
            {formatCurrency(Math.max(0, taxResult.totalTax - settings.taxPotSaved))}
          </p>
        </div>
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center bg-[#007AFF] text-white border-transparent shadow-[0_8px_32px_rgba(0,122,255,0.3)]">
          <p className="text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-2">Current Reserves</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple">{formatCurrency(settings.taxPotSaved)}</p>
        </div>
      </div>

      <div className="apple-card p-8 md:p-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-semibold text-[#1d1d1f]">Coverage Capacity</span>
          <span className="text-[15px] font-bold text-[#007AFF]">{taxCoverage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 bg-black/5 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#007AFF] rounded-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)" 
            style={{ width: `${taxCoverage}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Transfer Input */}
        <div className="apple-card p-8 md:p-10 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#1d1d1f]">Allocate Capital</h3>
            {settings.taxPotSaved > 0 && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-1.5 rounded-full hover:bg-[#FF3B30]/20 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> RE-CALIBRATE
              </button>
            )}
          </div>
          
          <div className="flex bg-black/5 p-1.5 rounded-2xl mb-6 border border-black/5">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in NGN"
              className="flex-1 bg-transparent px-4 py-3 text-[17px] font-medium border-0 focus:outline-none placeholder:text-[#86868b]"
              onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
            />
            <button onClick={handleDeposit} className="bg-white hover:bg-gray-50 text-[#1d1d1f] font-semibold text-[15px] px-6 rounded-[14px] shadow-sm transition-colors border border-black/5">
              Submit
            </button>
          </div>
          
          <div className="mt-auto">
            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">Quick Inject</p>
            <div className="flex flex-wrap gap-2">
              {[10000, 50000, 100000].map((p) => (
                <button 
                  key={p} 
                  onClick={() => setDepositAmount(p.toString())}
                  className="btn-apple-secondary text-[14px]"
                >
                  +{formatCurrency(p)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policy Configuration */}
        <div className="apple-card p-8 md:p-10 flex flex-col">
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-6">Withholding Policy</h3>
          
          <div className="flex bg-black/5 p-1.5 rounded-2xl mb-8">
            {[15, 20, 25].map((pct) => (
              <button 
                key={pct} 
                onClick={() => handlePercentChange(pct)}
                className={`flex-1 py-3 text-[15px] font-semibold transition-all rounded-[14px] ${
                  settings.taxPotPercentage === pct 
                    ? "bg-white text-[#1d1d1f] shadow-sm border text-black/5" 
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          
          <div className="pt-8 border-t border-black/5 mt-auto">
            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Target Annual Allocation</p>
            <p className="text-4xl font-bold tracking-tighter-apple text-[#1d1d1f]">{formatCurrency(recommendedSavings)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
