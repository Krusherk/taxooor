import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function generateFXData(baseRate: number) {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
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
    <div className="bg-white/90 backdrop-blur-xl border border-black/5 p-4 rounded-2xl shadow-lg">
      <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-3 pb-2 border-b border-black/5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-8 mb-2 last:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[14px] font-medium text-[#1d1d1f]">
              {entry.dataKey === "immediate" ? "Spot Bank Rate" : "Raenest FastTrack"}
            </span>
          </div>
          <span className="font-bold text-[15px]" style={{ color: entry.dataKey === "hold" ? "#34C759" : "#1d1d1f" }}>
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
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Volatility
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            USD/NGN 6-Month Index Projection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Mid-Market Baseline</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple text-[#1d1d1f]">₦{baseRate.toLocaleString()}</p>
        </div>
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Avg Traditional Yield</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple text-[#86868b]">₦{avgImmediate.toLocaleString()}</p>
        </div>
        <div className="apple-card p-6 md:p-8 flex flex-col justify-center bg-[#007AFF] text-white border-transparent">
          <p className="text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-2">Avg Raenest Yield</p>
          <p className="text-3xl lg:text-4xl font-bold tracking-tighter-apple">₦{avgHold.toLocaleString()}</p>
        </div>
      </div>

      <div className="apple-card overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5 bg-white/40">
          <h3 className="text-[17px] font-semibold">6-Month Volatility Spread</h3>
        </div>
        <div className="h-[400px] w-full p-6 bg-white/20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#86868b", fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: "#86868b", fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} domain={["dataMin - 30", "dataMax + 30"]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 14, fontWeight: 500, paddingTop: 20 }} formatter={(v: string) => <span className="text-[#1d1d1f] ml-1">{v === "immediate" ? "Spot Bank Rate" : "Raenest FastTrack"}</span>} />
              <Area type="monotone" dataKey="immediate" stroke="#86868b" strokeWidth={2} fill="url(#colorImmediate)" />
              <Area type="monotone" dataKey="hold" stroke="#34C759" strokeWidth={3} fill="url(#colorHold)" />
              <defs>
                <linearGradient id="colorImmediate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#86868b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#86868b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1d1d1f]">
        <div className="apple-card p-8 bg-white/50">
          <h4 className="text-[17px] font-semibold mb-3 tracking-tight-apple">Strategic Advantage I</h4>
          <p className="text-[15px] leading-relaxed text-[#86868b]">
            Traditional platforms execute forced conversions at non-transparent rates. By retaining absolute asset liquidity in USD via Raenest, you proactively prevent structural value erosion.
          </p>
        </div>
        <div className="apple-card p-8 bg-white/50">
          <h4 className="text-[17px] font-semibold mb-3 tracking-tight-apple">Strategic Advantage II</h4>
          <p className="text-[15px] leading-relaxed text-[#86868b]">
            Native USD spending directly from Raenest Virtual Cards bypasses standard double-conversion penalties when investing in international SaaS or developer tooling.
          </p>
        </div>
      </div>
    </div>
  );
}
