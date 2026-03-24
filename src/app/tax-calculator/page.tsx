"use client";

import { useState, useEffect, useMemo } from "react";
import { formatCurrency, generateId } from "@/lib/utils";
import type { Deduction } from "@/lib/types";
import { getEntries, getSettings, getTotalNGN, getTotalUSD } from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import { generateTaxReport } from "@/lib/pdf";

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
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-6 gap-6">
        <div>
          <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black leading-none">
            Assessment.
          </h1>
          <p className="ethos-label mt-4 text-black font-bold">
            PROGRESSIVE SCALE ALGORITHM / NTA 2026
          </p>
        </div>
        <button onClick={handleExport} className="btn-ethos">
          {">"} EXPORT DATA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 border border-black bg-white/40 backdrop-blur-md">
        
        {/* Input Column */}
        <div className="border-b lg:border-b-0 lg:border-r border-black flex flex-col">
          <div className="p-6 border-b border-black">
            <h2 className="ethos-label font-bold mb-4">I. GROSS RECEIPTS (₦)</h2>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="0"
              className="bg-transparent font-serif text-4xl text-black w-full focus:outline-none border-b border-black/30 pb-1"
            />
            <p className="text-xs font-mono text-black/50 mt-3 uppercase tracking-wider">Synced from Ledger</p>
          </div>

          <div className="p-6 flex-1 bg-white/50">
            <h2 className="ethos-label font-bold mb-4">II. EXEMPTIONS</h2>
            <div className="space-y-0 border border-black mb-4">
              {deductions.length === 0 ? (
                <p className="ethos-label p-4 bg-black/5 text-center text-black/40">NO EXEMPTIONS DECLARED.</p>
              ) : (
                deductions.map((d) => (
                  <div key={d.id} className="p-4 border-b border-black last:border-0 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="ethos-label font-bold">{d.name}</span>
                      <button onClick={() => removeDeduction(d.id)} className="text-[#FE4A03] hover:underline font-mono text-sm">[X]</button>
                    </div>
                    <input
                      type="number"
                      value={d.amount || ""}
                      onChange={(e) => updateDeduction(d.id, parseFloat(e.target.value) || 0)}
                      placeholder="Amount in ₦"
                      className="w-full bg-black/5 px-3 py-2 font-mono text-black text-sm border-0 focus:outline-none"
                    />
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {DEDUCTION_PRESETS.filter((p) => !deductions.find((d) => d.name === p.name)).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => addDeduction(preset)}
                  className="ethos-label px-2 py-1 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col">
          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-black bg-black text-white">
            <div className="p-4 md:border-r border-white/20">
              <p className="ethos-label text-white/50 mb-1">TAXABLE PORTION</p>
              <p className="font-serif text-2xl">{formatCurrency(taxResult.taxableIncome)}</p>
            </div>
            <div className="p-4 md:border-r border-white/20 bg-[#FE4A03]">
              <p className="ethos-label text-black/50 mb-1">TOTAL DEBT</p>
              <p className="font-serif text-2xl text-black">{formatCurrency(taxResult.totalTax)}</p>
            </div>
            <div className="p-4 md:border-r border-white/20">
              <p className="ethos-label text-white/50 mb-1">EFF. RATE</p>
              <p className="font-serif text-2xl">{taxResult.effectiveRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-[#00FF88] text-black">
              <p className="ethos-label text-black/50 mb-1">M / OBL</p>
              <p className="font-serif text-xl">{formatCurrency(taxResult.monthlyTaxGoal)}</p>
            </div>
          </div>

          {taxResult.auditRisk !== "low" && (
            <div className={`p-4 border-b border-black flex items-center justify-between font-mono text-sm uppercase ${taxResult.auditRisk === "high" ? "bg-[#FE4A03] text-black" : "bg-yellow-400 text-black"}`}>
              <span className="font-bold">!! {taxResult.auditRisk} AUDIT RISK PROFILE !!</span>
              <span>{taxResult.auditRisk === "high" ? "> ₦50M THRESHOLD" : "> ₦25M THRESHOLD"}</span>
            </div>
          )}

          {/* Band Breakdown Table */}
          <div className="bg-white flex-1 p-6">
            <h3 className="ethos-label font-bold mb-4">III. STRATIFIED OBLIGATION</h3>
            <table className="w-full text-left border-collapse border border-black">
              <thead className="bg-[#f0f0f0] border-b border-black">
                <tr>
                  <th className="px-4 py-3 ethos-label border-r border-black">BAND DEFINITION</th>
                  <th className="px-4 py-3 ethos-label border-r border-black text-center">MARGINAL</th>
                  <th className="px-4 py-3 ethos-label border-r border-black text-right">ASSESSED (₦)</th>
                  <th className="px-4 py-3 ethos-label text-right">TAX (₦)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm text-black">
                {taxResult.bandBreakdown.map((br, i) => (
                  <tr key={i} className={`border-b border-black last:border-0 ${br.taxableInBand > 0 ? "bg-white" : "text-black/30"}`}>
                    <td className="px-4 py-3 border-r border-black">{br.band.label}</td>
                    <td className="px-4 py-3 border-r border-black text-center">
                      <span className={`px-2 py-0.5 text-xs ${br.band.rate === 0 ? "bg-[#00FF88] text-black font-bold" : ""}`}>
                        {(br.band.rate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-black text-right">{formatCurrency(br.taxableInBand)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(br.taxInBand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
