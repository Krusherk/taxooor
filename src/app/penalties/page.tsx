"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { calculateTinPenalty, calculateLatePenalty } from "@/lib/tax";

export default function PenaltiesPage() {
  const [tinMonths, setTinMonths] = useState(1);
  const [lateMonths, setLateMonths] = useState(1);

  const tinPenalty = calculateTinPenalty(tinMonths);
  const latePenalty = calculateLatePenalty(lateMonths);

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="border-b border-black pb-6">
        <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black leading-none">
          Violations.
        </h1>
        <p className="ethos-label mt-4 text-black font-bold">
          COMPLIANCE PENALTY SIMULATOR 
        </p>
      </div>

      <div className="bg-[#FE4A03] border border-black p-4 font-mono text-sm font-bold text-black uppercase flex justify-between">
        <span>[!] STRICT ENFORCEMENT PROTOCOL ACTIVE</span>
        <span className="hidden sm:inline">FAILURE TO COMPLY INCURS IMMEDIATE EXPOSURE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIN Penalty Grid */}
        <div className="border border-black bg-white/60 backdrop-blur-md flex flex-col">
          <div className="px-6 py-4 border-b border-black bg-black text-white">
            <h3 className="ethos-label font-bold text-lg">01. TIN REGISTRATION FAILURE</h3>
          </div>
          
          <div className="p-6 border-b border-black bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="ethos-label text-black/60">DURATION (MONTHS)</span>
              <span className="font-serif text-4xl text-black">{tinMonths}</span>
            </div>
            <div className="h-2 w-full border border-black bg-black/10 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#FE4A03]" 
                style={{ width: `${(tinMonths / 24) * 100}%` }}
              />
            </div>
            <input 
              type="range" min="1" max="24" 
              value={tinMonths} onChange={(e) => setTinMonths(parseInt(e.target.value))} 
              className="w-full absolute opacity-0 cursor-pointer -mt-4 h-8" 
            />
          </div>

          <div className="p-6 bg-[#FE4A03]/10 flex flex-col items-center justify-center border-b border-black">
            <p className="ethos-label text-[#FE4A03] mb-2 font-bold">CALCULATED TIN OBLIGATION</p>
            <p className="font-serif text-5xl text-black">{formatCurrency(tinPenalty.totalPenalty)}</p>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto bg-white">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 bg-[#f0f0f0] border-b border-black">
                <tr>
                  <th className="px-4 py-2 border-r border-black ethos-label">MTH</th>
                  <th className="px-4 py-2 border-r border-black text-right ethos-label">ADDITION</th>
                  <th className="px-4 py-2 text-right ethos-label">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {tinPenalty.breakdown.map((row) => (
                  <tr key={row.month} className="border-b border-black border-dashed">
                    <td className="px-4 py-2 border-r border-black">M-{row.month}</td>
                    <td className="px-4 py-2 text-right border-r border-black">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-2 text-right font-bold text-[#FE4A03]">{formatCurrency(row.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Late Filing Penalty Grid */}
        <div className="border border-black bg-white/60 backdrop-blur-md flex flex-col">
          <div className="px-6 py-4 border-b border-black bg-black text-white">
            <h3 className="ethos-label font-bold text-lg">02. LATE FILING DEVIATION</h3>
          </div>
          
          <div className="p-6 border-b border-black bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="ethos-label text-black/60">DURATION (MONTHS)</span>
              <span className="font-serif text-4xl text-black">{lateMonths}</span>
            </div>
            <div className="h-2 w-full border border-black bg-black/10 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#eab308]" 
                style={{ width: `${(lateMonths / 24) * 100}%` }}
              />
            </div>
            <input 
              type="range" min="1" max="24" 
              value={lateMonths} onChange={(e) => setLateMonths(parseInt(e.target.value))} 
              className="w-full absolute opacity-0 cursor-pointer -mt-4 h-8" 
            />
          </div>

          <div className="p-6 bg-[#eab308]/10 flex flex-col items-center justify-center border-b border-black">
            <p className="ethos-label text-[#b45309] mb-2 font-bold">CALCULATED LATE OBLIGATION</p>
            <p className="font-serif text-5xl text-black">{formatCurrency(latePenalty.totalPenalty)}</p>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto bg-white">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 bg-[#f0f0f0] border-b border-black">
                <tr>
                  <th className="px-4 py-2 border-r border-black ethos-label">MTH</th>
                  <th className="px-4 py-2 border-r border-black text-right ethos-label">ADDITION</th>
                  <th className="px-4 py-2 text-right ethos-label">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {latePenalty.breakdown.map((row) => (
                  <tr key={row.month} className="border-b border-black border-dashed">
                    <td className="px-4 py-2 border-r border-black">M-{row.month}</td>
                    <td className="px-4 py-2 text-right border-r border-black">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-2 text-right font-bold text-[#b45309]">{formatCurrency(row.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="border border-black bg-black text-white p-8 mt-12">
        <h3 className="ethos-label font-bold text-center text-white/50 mb-4">TOTAL SYNTHETIC EXPOSURE</h3>
        <p className="font-serif text-6xl md:text-8xl text-center text-[#FE4A03]">
          {formatCurrency(tinPenalty.totalPenalty + latePenalty.totalPenalty)}
        </p>
      </div>
    </div>
  );
}
