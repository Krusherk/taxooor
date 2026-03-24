import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function ComparePage() {
  const [amount, setAmount] = useState(1000);
  const [exchangeRate] = useState(1380);

  const traditionalSpread = 0.03;
  const traditionalFee = 25;
  const traditionalRate = exchangeRate * (1 - traditionalSpread);
  const traditionalNGN = (amount - traditionalFee) * traditionalRate;

  const raenestSpread = 0.005;
  const raenestFee = 2;
  const raenestRate = exchangeRate * (1 - raenestSpread);
  const raenestNGN = (amount - raenestFee) * raenestRate;

  const savings = raenestNGN - traditionalNGN;
  const savingsPercent = ((savings / traditionalNGN) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Compare FX
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Traditional limits vs Raenest FastTrack.
          </p>
        </div>
      </div>

      <div className="apple-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider block mb-3">Withdrawal Volume</label>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold tracking-tighter-apple text-[#86868b]">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent text-4xl font-bold tracking-tighter-apple focus:outline-none w-48 pb-1 border-b border-transparent focus:border-[#007AFF] transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[500, 1000, 5000, 10000].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all ${
                amount === preset ? "bg-[#1d1d1f] text-white shadow-md" : "bg-black/5 text-[#1d1d1f] hover:bg-black/10"
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Traditional Bank */}
        <div className="flex flex-col gap-4">
          <div className="apple-card p-8 flex-1 bg-white/50">
            <h3 className="text-xl font-bold mb-6 text-[#1d1d1f]">Traditional Bank</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Settlement Time</span>
                <span className="font-semibold text-[15px]">2–5 Days</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Spread Markup</span>
                <span className="font-semibold text-[15px] text-[#FF3B30]">-3.0%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Fixed Fee</span>
                <span className="font-semibold text-[15px] text-[#FF3B30]">${traditionalFee}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[#86868b] text-[15px]">Applied Rate</span>
                <span className="font-semibold text-[15px]">₦{traditionalRate.toFixed(0)} / $1</span>
              </div>
            </div>
          </div>
          <div className="apple-card p-8 opacity-80 backdrop-blur-md">
            <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Net Value Received</p>
            <p className="text-4xl font-bold tracking-tighter-apple text-[#86868b]">{formatCurrency(traditionalNGN)}</p>
          </div>
        </div>

        {/* Raenest FastTrack */}
        <div className="flex flex-col gap-4">
          <div className="apple-card p-8 flex-1 border-2 border-[#007AFF]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#007AFF] text-white px-4 py-1.5 rounded-bl-2xl text-[12px] font-bold tracking-wide">
              RECOMMENDED
            </div>
            <h3 className="text-xl font-bold mb-6 text-[#007AFF]">Raenest FastTrack</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Settlement Time</span>
                <span className="font-semibold text-[15px]">Instant</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Spread Markup</span>
                <span className="font-semibold text-[15px] text-[#34C759]">-0.5%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[#86868b] text-[15px]">Fixed Fee</span>
                <span className="font-semibold text-[15px] text-[#34C759]">${raenestFee}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[#86868b] text-[15px]">Applied Rate</span>
                <span className="font-semibold text-[15px]">₦{raenestRate.toFixed(0)} / $1</span>
              </div>
            </div>
          </div>
          <div className="apple-card p-8 bg-[#007AFF] text-white border-transparent">
            <p className="text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-2">Net Value Received</p>
            <p className="text-4xl font-bold tracking-tighter-apple">{formatCurrency(raenestNGN)}</p>
          </div>
        </div>

      </div>

      <div className="apple-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-white to-[#007AFF]/5">
        <div>
          <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Arbitrage Advantage</p>
          <div className="flex items-baseline gap-4">
            <p className="text-5xl font-bold tracking-tighter-apple text-[#34C759]">+{formatCurrency(savings)}</p>
            <span className="bg-[#34C759]/10 text-[#34C759] font-bold px-3 py-1 rounded-full text-sm">+{savingsPercent}%</span>
          </div>
          <p className="text-[#86868b] mt-3 text-[15px] max-w-lg">
            Retain more of your income by circumventing legacy intermediary fees and poor conversion spreads.
          </p>
        </div>
        <a href="https://www.raenest.com" target="_blank" rel="noopener noreferrer" className="btn-apple bg-[#007AFF] hover:bg-[#0066cc] flex items-center justify-center gap-2 px-8 py-4 whitespace-nowrap text-[16px]">
          Create USD Account <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
