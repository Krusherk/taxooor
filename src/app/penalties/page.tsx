"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { calculateTinPenalty, calculateLatePenalty } from "@/lib/tax";
import { AlertCircle } from "lucide-react";

export default function PenaltiesPage() {
  const [tinMonths, setTinMonths] = useState(1);
  const [lateMonths, setLateMonths] = useState(1);

  const tinPenalty = calculateTinPenalty(tinMonths);
  const latePenalty = calculateLatePenalty(lateMonths);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Penalties
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Statutory Violation Obligations.
          </p>
        </div>
      </div>

      <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 p-4 rounded-2xl flex items-start sm:items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <p className="text-[14px] font-semibold text-[#FF3B30] uppercase tracking-wider">Strict Enforcement Policy</p>
          <p className="text-sm text-[#FF3B30]/80">Failure to comply with the 2026 NTA incurs immediate and compounding liabilities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIN Penalty Grid */}
        <div className="apple-card flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-black/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-sm font-bold">1</div>
            <h3 className="text-[17px] font-semibold">TIN Registration Failure</h3>
          </div>
          
          <div className="p-8 border-b border-black/5 bg-white/40">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Delay Duration</span>
              <span className="text-2xl font-bold">{tinMonths} <span className="text-sm font-semibold text-[#86868b] ml-1">Months</span></span>
            </div>
            
            <div className="relative pt-1 pb-4">
              <input 
                type="range" min="1" max="24" 
                value={tinMonths} onChange={(e) => setTinMonths(parseInt(e.target.value))} 
                className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #FF3B30 ${(tinMonths/24)*100}%, rgba(0,0,0,0.1) ${(tinMonths/24)*100}%)`
                }}
              />
              <style jsx>{`
                input[type=range]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: white;
                  border: 1px solid rgba(0,0,0,0.1);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  cursor: pointer;
                }
              `}</style>
            </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center border-b border-black/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent pointer-events-none" />
            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2 relative z-10">Total Exposure</p>
            <p className="text-5xl font-bold tracking-tighter-apple text-[#FF3B30] relative z-10">{formatCurrency(tinPenalty.totalPenalty)}</p>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto bg-white/20">
            <table className="w-full text-left text-[14px]">
              <thead className="sticky top-0 bg-white/90 backdrop-blur border-b border-black/5">
                <tr>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Month</th>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right">Added</th>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {tinPenalty.breakdown.map((row) => (
                  <tr key={row.month} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                    <td className="px-8 py-3 text-[#86868b]">Month {row.month}</td>
                    <td className="px-8 py-3 text-right">{formatCurrency(row.amount)}</td>
                    <td className="px-8 py-3 text-right font-semibold text-[#FF3B30]">{formatCurrency(row.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Late Filing Penalty Grid */}
        <div className="apple-card flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-black/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-sm font-bold">2</div>
            <h3 className="text-[17px] font-semibold">Late Filing Deviation</h3>
          </div>
          
          <div className="p-8 border-b border-black/5 bg-white/40">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Delay Duration</span>
              <span className="text-2xl font-bold">{lateMonths} <span className="text-sm font-semibold text-[#86868b] ml-1">Months</span></span>
            </div>
            
            <div className="relative pt-1 pb-4">
              <input 
                type="range" min="1" max="24" 
                value={lateMonths} onChange={(e) => setLateMonths(parseInt(e.target.value))} 
                className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #FFCC00 ${(lateMonths/24)*100}%, rgba(0,0,0,0.1) ${(lateMonths/24)*100}%)`
                }}
              />
            </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center border-b border-black/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFCC00]/10 to-transparent pointer-events-none" />
            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2 relative z-10">Total Exposure</p>
            <p className="text-5xl font-bold tracking-tighter-apple text-[#cc9900] relative z-10">{formatCurrency(latePenalty.totalPenalty)}</p>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto bg-white/20">
            <table className="w-full text-left text-[14px]">
              <thead className="sticky top-0 bg-white/90 backdrop-blur border-b border-black/5">
                <tr>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Month</th>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right">Added</th>
                  <th className="px-8 py-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {latePenalty.breakdown.map((row) => (
                  <tr key={row.month} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                    <td className="px-8 py-3 text-[#86868b]">Month {row.month}</td>
                    <td className="px-8 py-3 text-right">{formatCurrency(row.amount)}</td>
                    <td className="px-8 py-3 text-right font-semibold text-[#cc9900]">{formatCurrency(row.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="apple-card p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF3B30]/5 to-transparent pointer-events-none" />
        <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-4 relative z-10">Combined Systemic Obligation</p>
        <p className="text-6xl md:text-[80px] font-bold tracking-tighter-apple text-[#FF3B30] leading-none relative z-10">
          {formatCurrency(tinPenalty.totalPenalty + latePenalty.totalPenalty)}
        </p>
      </div>
    </div>
  );
}
