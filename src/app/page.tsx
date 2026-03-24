"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency, generateId } from "@/lib/utils";
import type { IncomeEntry, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";
import {
  getEntries,
  addEntry,
  deleteEntry,
  getSettings,
  saveSettings,
  getTotalUSD,
  getTotalNGN,
} from "@/lib/store";
import { calculateTax } from "@/lib/tax";
import { generateTaxReport } from "@/lib/pdf";

export default function DashboardPage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [rate, setRate] = useState(1380);
  const [rateInput, setRateInput] = useState("1380");

  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [description, setDescription] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(getEntries());
    const s = getSettings();
    setRate(s.exchangeRate);
    setRateInput(s.exchangeRate.toString());
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const totalUSD = getTotalUSD(entries, rate);
  const totalNGN = getTotalNGN(entries, rate);

  const handleAdd = useCallback(() => {
    if (!amount || !date) return;
    const entry: IncomeEntry = {
      id: generateId(),
      date,
      platform,
      amount: parseFloat(amount),
      currency,
      description,
    };
    setEntries(addEntry(entry));
    setAmount("");
    setDescription("");
  }, [amount, date, platform, currency, description]);

  const handleDelete = useCallback((id: string) => {
    setEntries(deleteEntry(id));
  }, []);

  const handleRateSave = useCallback(() => {
    const newRate = parseFloat(rateInput) || 1380;
    setRate(newRate);
    saveSettings({ exchangeRate: newRate });
  }, [rateInput]);

  const handleExportPDF = useCallback(() => {
    const taxResult = calculateTax(totalNGN);
    generateTaxReport(entries, taxResult, rate, totalUSD, totalNGN);
  }, [entries, totalNGN, totalUSD, rate]);

  if (!mounted) return null;

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-black pb-6 gap-6">
        <div>
          <h1 className="ethos-title text-5xl md:text-7xl font-semibold text-black">
            Ledger.
          </h1>
          <p className="ethos-label mt-4 text-black font-bold">
            INCOME AGGREGATION SYSTEM / NTA 2026
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="btn-ethos whitespace-nowrap"
        >
          {">"} EXPORT TAX CERTIFICATE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black bg-white/40 backdrop-blur-md">
        <div className="p-6 md:border-r border-black border-b md:border-b-0">
          <p className="ethos-label mb-2">GROSS RECEIPTS (USD)</p>
          <p className="text-4xl font-serif text-black">{formatCurrency(totalUSD, "USD")}</p>
        </div>

        <div className="p-6 md:border-r border-black border-b md:border-b-0">
          <p className="ethos-label mb-2 flex items-center justify-between">
            <span>FX RATE INDEX</span>
            <span className="text-[10px] bg-black text-white px-1 py-0.5">EDITABLE</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="font-serif text-4xl text-black">₦</span>
            <input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              onBlur={handleRateSave}
              onKeyDown={(e) => e.key === "Enter" && handleRateSave()}
              className="bg-transparent font-serif text-4xl text-black w-32 focus:outline-none border-b border-black/30 pb-0.5"
            />
          </div>
        </div>

        <div className="p-6 bg-black text-white">
          <p className="ethos-label mb-2 text-white/70">TOTAL TAXABLE YIELD (NGN)</p>
          <p className="text-4xl font-serif text-[#00FF88]">{formatCurrency(totalNGN, "NGN")}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-black">
        <div className="px-6 py-4 border-b border-black bg-white flex justify-between items-center">
          <h2 className="ethos-label font-bold text-black">NEW ENTRY PROTOCOL</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-0">
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black">
            <span className="ethos-label px-4 py-2 bg-black/5 border-b border-black text-[10px]">DATE</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-ethos flex-1 px-4 py-3 bg-transparent border-0"
            />
          </div>
          
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black">
            <span className="ethos-label px-4 py-2 bg-black/5 border-b border-black text-[10px]">PLATFORM</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="input-ethos flex-1 px-4 py-3 bg-transparent border-0 appearance-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black">
            <span className="ethos-label px-4 py-2 bg-black/5 border-b border-black text-[10px]">CURRENCY</span>
            <div className="flex flex-1">
              {(["USD", "NGN"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 transition-colors font-mono text-sm ${
                    currency === c ? "bg-black text-white" : "hover:bg-black/5 text-black"
                  } ${c === "USD" ? "border-r border-black" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black">
            <span className="ethos-label px-4 py-2 bg-black/5 border-b border-black text-[10px]">AMOUNT</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-ethos flex-1 px-4 py-3 bg-transparent border-0"
            />
          </div>
          
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black">
            <span className="ethos-label px-4 py-2 bg-black/5 border-b border-black text-[10px]">MEMO</span>
            <input
              type="text"
              placeholder="..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-ethos flex-1 px-4 py-3 bg-transparent border-0"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!amount || !date}
            className="btn-ethos h-full md:border-l-0"
          >
            [+] LOG
          </button>
        </div>
      </div>

      <div className="bg-white border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black bg-black text-white flex justify-between items-center">
          <h2 className="ethos-label">TRANSACTION LOG</h2>
          <span className="ethos-label opacity-70">COUNT: {entries.length}</span>
        </div>
        
        {entries.length === 0 ? (
          <div className="p-16 text-center bg-white/50 backdrop-blur-sm">
            <p className="ethos-label text-black/50">NO RECORDS FOUND. AWAITING INPUT.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f0f0f0] border-b border-black">
                <tr>
                  <th className="px-6 py-3 ethos-label font-bold text-[10px] text-black border-r border-black">DATE</th>
                  <th className="px-6 py-3 ethos-label font-bold text-[10px] text-black border-r border-black">PLATFORM</th>
                  <th className="px-6 py-3 ethos-label font-bold text-[10px] text-black border-r border-black text-right">AMOUNT</th>
                  <th className="px-6 py-3 ethos-label font-bold text-[10px] text-black border-r border-black">MEMO</th>
                  <th className="px-6 py-3 ethos-label font-bold text-[10px] text-black text-right">ACT</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm text-black">
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-black last:border-0 hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-6 py-4 border-r border-black">
                      {new Date(entry.date).toLocaleDateString("en-NG", { year: "numeric", month: "2-digit", day: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 border-r border-black">
                      <span className="bg-black text-white px-2 py-1 text-xs">{entry.platform}</span>
                    </td>
                    <td className="px-6 py-4 text-right border-r border-black font-bold">
                      {formatCurrency(entry.amount, entry.currency)}
                    </td>
                    <td className="px-6 py-4 border-r border-black truncate max-w-[200px]">
                      {entry.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-[#FE4A03] hover:underline"
                      >
                        [X]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
