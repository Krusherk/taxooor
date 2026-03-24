"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function generateFXData(baseRate: number) {
  const months = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];
  return months.map((month, i) => {
    const volatility = (Math.sin(i * 1.5) * 40) + (i * 15);
    const holdVolatility = (Math.sin(i * 0.8) * 20) + (i * 20);
    const immediate = Math.round(baseRate - 80 + volatility + (Math.random() * 30 - 15));
    const hold = Math.round(baseRate - 30 + holdVolatility);
    return { month, immediate, hold, spread: hold - immediate };
  });
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; dataKey: string; color: string}>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-black text-white border border-white p-4 uppercase font-mono text-[10px] tracking-wider">
      <p className="mb-3 border-b border-white/20 pb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-4 mb-1">
          <span className="opacity-50 min-w-[120px]">
            {entry.dataKey === "immediate" ? "SPOT CONVERSION" : "RAENEST DEFERRED"}
          </span>
          <span className="font-bold ml-auto" style={{ color: entry.dataKey === "hold" ? "#00FF88" : "white" }}>
            ₦{entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FXChartPage() {
  const [baseRate] = useState(1380);
  const data = useMemo(() => generateFXData(baseRate), [baseRate]);

  const avgImmediate = Math.round(data.reduce((s, d) => s + d.immediate, 0) / data.length);
  const avgHold = Math.round(data.reduce((s, d) => s + d.hold, 0) / data.length);

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="border-b border-black pb-6">
        <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black leading-none">
          Volatility.
        </h1>
        <p className="ethos-label mt-4 text-black font-bold">
          USD/NGN INDEX & YIELD TRACKING
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-black bg-white/40 backdrop-blur-md">
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-black bg-white">
          <p className="ethos-label text-black/50 mb-2">MID-MARKET BASELINE</p>
          <p className="font-serif text-4xl text-black">₦{baseRate.toLocaleString()}</p>
        </div>
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
          <p className="ethos-label text-black/50 mb-2">AVG FORCE-CONVERT</p>
          <p className="font-serif text-4xl text-[#FE4A03]">₦{avgImmediate.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-black text-white">
          <p className="ethos-label text-white/50 mb-2">AVG RAENEST YIELD</p>
          <p className="font-serif text-4xl text-[#00FF88]">₦{avgHold.toLocaleString()}</p>
        </div>
      </div>

      <div className="border border-black bg-white/80 backdrop-blur-md">
        <div className="px-6 py-4 border-b border-black bg-black flex items-center justify-between">
          <h3 className="ethos-label text-white">6-MONTH VOLATILITY SPREAD</h3>
        </div>
        <div className="h-96 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#000", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: "#000", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} dx={-10} domain={["dataMin - 30", "dataMax + 30"]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 20 }} formatter={(v: string) => <span className="text-black ml-1 tracking-wider">{v === "immediate" ? "SPOT BANK RATE" : "RAENEST RATE"}</span>} />
              <Area type="monotone" dataKey="immediate" stroke="#000000" strokeWidth={1} fill="rgba(0,0,0,0.05)" />
              <Area type="monotone" dataKey="hold" stroke="#00FF88" strokeWidth={2} fill="rgba(0, 255, 136, 0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black text-black">
        <div className="p-8 border-b md:border-b-0 md:border-r border-black bg-white/60">
          <h4 className="ethos-label font-bold mb-4">STRATEGIC ADVANTAGE I</h4>
          <p className="font-mono text-sm leading-relaxed text-black/80">
            TRADITIONAL PLATFORMS EXERCISE FORCED CONVERSIONS AT NON-TRANSPARENT RATES (Avg -3.0% vs MARKET). BY RETAINING ASSET LIQUIDITY IN USD, YOU PREVENT VALUE EROSION.
          </p>
        </div>
        <div className="p-8 bg-[#00FF88]/20 border-black bg-white/60">
          <h4 className="ethos-label font-bold mb-4">STRATEGIC ADVANTAGE II</h4>
          <p className="font-mono text-sm leading-relaxed text-black/80">
            NATIVE USD SPENDING DIRECTLY FROM RAENEST VIRTUAL CARDS BYPASSES DOUBLE-CONVERSION PENALTIES WHEN PAYING FOR INTERNATIONAL SAAS OR DEVELOPER TOOLING.
          </p>
        </div>
      </div>
    </div>
  );
}
