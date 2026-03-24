import { useState, useEffect, useMemo } from "react";
import { formatCurrency, generateId } from "@/lib/utils";
import type { Deduction } from "@/lib/types";
import { getEntries, getSettings, getTotalNGN, getTotalUSD } from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import { generateTaxReport } from "@/lib/pdf";
import { Plus, X, Download, AlertOctagon } from "lucide-react";

const DEDUCTION_PRESETS = [
  { name: "Rent Relief", maxAllowed: 500_000 },
  { name: "Pension", maxAllowed: undefined },
  { name: "NHF", maxAllowed: undefined },
  { name: "NHIS", maxAllowed: undefined },
  { name: "Life Insurance", maxAllowed: undefined },
];

export default function TaxCalculatorPage() {
  const [mounted, setMounted] = useState(false);
  const [annualIncome, setAnnualIncome] = useState("");
  const [deductions, setDeductions] = useState<Deduction[]>([]);

  useEffect(() => {
    setMounted(true);
    const entries = getEntries();
    const s = getSettings();
    const total = getTotalNGN(entries, s.exchangeRate);
    if (total > 0) setAnnualIncome(Math.round(total).toString());
  }, []);

  const income = parseFloat(annualIncome) || 0;
  const taxResult = useMemo(() => calculateTax(income, deductions), [income, deductions]);

  const addDeduction = (preset: { name: string, maxAllowed?: number }) => {
    setDeductions((prev) => [...prev, { id: generateId(), name: preset.name, amount: 0, maxAllowed: preset.maxAllowed }]);
  };

  const updateDeduction = (id: string, amount: number) => {
    setDeductions((prev) => prev.map((d) => (d.id === id ? { ...d, amount } : d)));
  };

  const removeDeduction = (id: string) => {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleExport = () => {
    const entries = getEntries();
    const s = getSettings();
    generateTaxReport(entries, taxResult, s.exchangeRate, getTotalUSD(entries, s.exchangeRate), getTotalNGN(entries, s.exchangeRate));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Calculator
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Progressive 2026 NTA Scale
          </p>
        </div>
        <button onClick={handleExport} className="btn-apple bg-white text-[#1d1d1f] hover:bg-gray-50 border border-black/5 shadow-sm flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Export Outline
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-6">
        
        {/* Left Input Box */}
        <div className="flex flex-col gap-6">
          <div className="apple-card p-8">
            <h2 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Gross Income (₦)</h2>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-5xl font-bold tracking-tighter-apple focus:outline-none pb-2 border-b border-black/5"
            />
          </div>

          <div className="apple-card p-8 flex-1">
            <h2 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-4">Deductions & Exemptions</h2>
            <div className="space-y-3 mb-6">
              {deductions.length === 0 ? (
                <div className="p-6 text-center bg-black/5 rounded-2xl">
                  <p className="text-[#86868b] text-[15px]">No deductions claimed.</p>
                </div>
              ) : (
                deductions.map((d) => (
                  <div key={d.id} className="p-4 bg-white/50 rounded-2xl border border-black/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[15px]">{d.name}</span>
                      <button onClick={() => removeDeduction(d.id)} className="text-[#86868b] hover:text-[#FF3B30] p-1 rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                    <input
                      type="number"
                      value={d.amount || ""}
                      onChange={(e) => updateDeduction(d.id, parseFloat(e.target.value) || 0)}
                      placeholder="Amount in ₦"
                      className="input-apple w-full text-lg font-medium"
                    />
                  </div>
                ))
              )}
            </div>
            
            <div>
              <p className="text-[12px] font-medium text-[#86868b] mb-3">ADD COMMON EXEMPTIONS</p>
              <div className="flex flex-wrap gap-2">
                {DEDUCTION_PRESETS.filter((p) => !deductions.find((d) => d.name === p.name)).map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => addDeduction(preset)}
                    className="btn-apple-secondary flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" /> {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Box */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="apple-card p-6 flex flex-col justify-center">
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Total Tax</p>
              <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple text-[#FF3B30]">{formatCurrency(taxResult.totalTax)}</p>
            </div>
            <div className="apple-card p-6 flex flex-col justify-center">
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Effective Rate</p>
              <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple">{taxResult.effectiveRate.toFixed(1)}%</p>
            </div>
            <div className="apple-card p-6 flex flex-col justify-center">
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Taxable Base</p>
              <p className="text-2xl font-bold tracking-tight-apple">{formatCurrency(taxResult.taxableIncome)}</p>
            </div>
            <div className="apple-card p-6 flex flex-col justify-center bg-[#007AFF] text-white border-transparent">
              <p className="text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-2">Monthly Goal</p>
              <p className="text-2xl font-bold tracking-tight-apple">{formatCurrency(taxResult.monthlyTaxGoal)}</p>
            </div>
          </div>

          {taxResult.auditRisk !== "low" && (
            <div className={`p-4 rounded-2xl flex items-center justify-between text-[14px] font-medium ${taxResult.auditRisk === "high" ? "bg-[#FF3B30]/10 text-[#FF3B30]" : "bg-[#FFCC00]/20 text-[#cc9900]"}`}>
              <span className="flex items-center gap-2"><AlertOctagon className="w-4 h-4" /> {taxResult.auditRisk.toUpperCase()} AUDIT RISK PROFILE</span>
              <span>{taxResult.auditRisk === "high" ? "> ₦50M Threshold" : "> ₦25M Threshold"}</span>
            </div>
          )}

          <div className="apple-card flex-1 p-8">
            <h3 className="text-[15px] font-semibold mb-6 text-[#1d1d1f]">Tax Bracket Breakdown</h3>
            <div className="space-y-4">
              {taxResult.bandBreakdown.map((br, i) => {
                const isActive = br.taxableInBand > 0;
                return (
                  <div key={i} className={`flex items-center justify-between py-3 border-b border-black/5 last:border-0 ${isActive ? "" : "opacity-30"}`}>
                    <div className="flex items-center gap-4">
                      <span className={`w-12 text-center rounded-lg py-1 text-[13px] font-bold ${br.band.rate === 0 ? "bg-[#34C759] text-white" : "bg-black/5"}`}>
                        {(br.band.rate * 100).toFixed(0)}%
                      </span>
                      <div>
                        <p className="text-[14px] font-medium">{br.band.label}</p>
                        <p className="text-[12px] text-[#86868b]">{isActive ? formatCurrency(br.taxableInBand) + " utilized" : "Empty"}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[15px]">{formatCurrency(br.taxInBand)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
