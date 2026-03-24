"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

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
  const savingsPercent = ((savings / traditionalNGN) * 100).toFixed(2);

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="border-b border-black pb-6">
        <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black leading-none">
          Arbitrage.
        </h1>
        <p className="ethos-label mt-4 text-black font-bold">
          FX LIQUIDITY PIPELINE COMPARISON
        </p>
      </div>

      <div className="bg-white/60 border border-black p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-md">
        <div>
          <label className="ethos-label text-black/60 block mb-2">WITHDRAWAL VOLUME (USD)</label>
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent font-serif text-3xl font-bold focus:outline-none border-b border-black/30 w-48"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[500, 1000, 5000, 10000].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`ethos-label px-3 py-1.5 border border-black transition-colors ${
                amount === preset ? "bg-black text-white" : "hover:bg-black/10 text-black"
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black bg-white/40 backdrop-blur-md">
        
        {/* Traditional Bank */}
        <div className="border-b lg:border-b-0 lg:border-r border-black flex flex-col bg-black/5">
          <div className="px-6 py-4 border-b border-black flex items-center justify-between">
            <h3 className="ethos-label text-black font-bold text-lg">TRADITIONAL WIRE</h3>
            <span className="ethos-label text-black/40 text-[10px]">LEGACY</span>
          </div>
          
          <div className="p-0 border-b border-black flex-1">
            <table className="w-full text-left font-mono text-sm border-collapse">
              <tbody>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">SETTLEMENT time</td>
                  <td className="p-4 font-bold">2–5 BUS. DAYS</td>
                </tr>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">FX SPREAD</td>
                  <td className="p-4 font-bold text-[#FE4A03]">-3.0% MARKET</td>
                </tr>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">FIXED FEE</td>
                  <td className="p-4 font-bold text-[#FE4A03]">${traditionalFee}.00</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-black text-black/60">APPLIED RATE</td>
                  <td className="p-4 font-bold">₦{traditionalRate.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-6">
            <p className="ethos-label text-black/60 mb-2">NET YIELD (NGN)</p>
            <p className="font-serif text-5xl text-black">{formatCurrency(traditionalNGN)}</p>
          </div>
        </div>

        {/* Raenest FastTrack */}
        <div className="flex flex-col bg-[#00FF88] relative">
          <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 ethos-label text-[10px] font-bold">
            OPTIMAL PIPELINE
          </div>
          <div className="px-6 py-4 border-b border-black">
            <h3 className="ethos-label text-black font-bold text-lg">RAENEST FASTTRACK</h3>
          </div>
          
          <div className="p-0 border-b border-black flex-1 bg-white/40">
            <table className="w-full text-left font-mono text-sm border-collapse">
              <tbody>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">SETTLEMENT time</td>
                  <td className="p-4 font-bold">INSTANT</td>
                </tr>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">FX SPREAD</td>
                  <td className="p-4 font-bold text-black">-0.5% MARKET</td>
                </tr>
                <tr className="border-b border-black border-dashed">
                  <td className="p-4 border-r border-black text-black/60">FIXED FEE</td>
                  <td className="p-4 font-bold text-black">${raenestFee}.00</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-black text-black/60">APPLIED RATE</td>
                  <td className="p-4 font-bold">₦{raenestRate.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-[#00FF88]">
            <p className="ethos-label text-black/60 mb-2">NET YIELD (NGN)</p>
            <p className="font-serif text-5xl text-black">{formatCurrency(raenestNGN)}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black bg-black text-white">
        <div className="p-8 border-b md:border-b-0 md:border-r border-white/20">
          <p className="ethos-label text-white/50 mb-2">ARBITRAGE ADVANTAGE</p>
          <p className="font-serif text-6xl text-[#00FF88]">{formatCurrency(savings)} <span className="text-xl font-mono text-white/50 lowercase">/ tx</span></p>
          <p className="ethos-label mt-4 text-[#00FF88]">+{savingsPercent}% DELTA</p>
        </div>
        <div className="p-8 flex flex-col justify-center">
          <p className="font-mono text-sm mb-4 leading-relaxed tracking-wider">
            ROUTING INSTITUTIONAL LIQUIDITY VIA RAENEST AVOIDS HIDDEN INTERMEDIARY FEES AND PREVENTS ASSET DEVALUATION FROM FORCED NAIRA CONVERSIONS.
          </p>
          <a href="https://www.raenest.com" target="_blank" rel="noopener noreferrer" className="btn-ethos-secondary w-max bg-white text-black border-white hover:bg-transparent hover:text-white pb-3 pt-3">
            {">"} SECURE USD ACCOUNT
          </a>
        </div>
      </div>
    </div>
  );
}
