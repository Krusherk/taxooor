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
import { Plus, Download, X, Edit2 } from "lucide-react";

export default function DashboardPage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [rate, setRate] = useState(1380);
  const [rateInput, setRateInput] = useState("1380");

  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
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
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-[56px] font-bold tracking-tighter-apple leading-none">
            Dashboard
          </h1>
          <p className="text-[#86868b] mt-3 md:mt-4 text-[17px]">
            Income tracking aligned with NTA 2026.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="btn-apple bg-white text-[#1d1d1f] hover:bg-gray-50 border border-black/5 shadow-sm flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-8 flex flex-col justify-center">
          <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Total USD</p>
          <p className="text-4xl lg:text-5xl font-bold tracking-tighter-apple">{formatCurrency(totalUSD, "USD")}</p>
        </div>

        <div className="apple-card p-8 flex flex-col justify-center relative group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Exchange Rate</p>
            <Edit2 className="w-3 h-3 text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-4xl lg:text-5xl font-bold tracking-tighter-apple text-[#86868b]">₦</span>
            <input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              onBlur={handleRateSave}
              onKeyDown={(e) => e.key === "Enter" && handleRateSave()}
              className="bg-transparent text-4xl lg:text-5xl font-bold tracking-tighter-apple focus:outline-none w-32 pb-1"
            />
          </div>
        </div>

        <div className="apple-card p-8 flex flex-col justify-center bg-[#007AFF] text-white border-transparent">
          <p className="text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-2">Taxable NGN</p>
          <p className="text-4xl lg:text-5xl font-bold tracking-tighter-apple">{formatCurrency(totalNGN, "NGN")}</p>
        </div>
      </div>

      <div className="apple-card overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-white/40">
          <h2 className="text-[17px] font-semibold">Log Income</h2>
        </div>
        
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-apple"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="input-apple appearance-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Currency</label>
            <div className="flex bg-black/5 p-1 rounded-[14px]">
              {(["USD", "NGN"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-1.5 rounded-[10px] text-[15px] font-medium transition-colors ${
                    currency === c ? "bg-white shadow-sm text-black" : "text-[#86868b] hover:text-black"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-apple"
            />
          </div>
          
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Note (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Client name, project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-apple flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button
                onClick={handleAdd}
                disabled={!amount || !date}
                className="btn-apple bg-[#007AFF] hover:bg-[#0066cc] w-12 h-12 p-0 flex items-center justify-center flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="apple-card overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-white/40">
          <h2 className="text-[17px] font-semibold">Recent Transactions</h2>
          <span className="bg-black/5 text-[#86868b] text-[13px] font-semibold px-3 py-1 rounded-full">
            {entries.length}
          </span>
        </div>
        
        {entries.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-xl font-semibold text-[#1d1d1f] mb-2">No income logged yet</p>
            <p className="text-[#86868b]">Add your first transaction above to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-black/5">Date</th>
                  <th className="px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-black/5">Platform</th>
                  <th className="px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-black/5 text-right">Amount</th>
                  <th className="px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-black/5">Note</th>
                  <th className="px-8 py-4 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider border-b border-black/5 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-black/5 text-[#1d1d1f] px-3 py-1 rounded-full text-[13px] font-medium">
                        {entry.platform}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-semibold">
                      {formatCurrency(entry.amount, entry.currency)}
                    </td>
                    <td className="px-8 py-5 text-[#86868b] truncate max-w-[200px]">
                      {entry.description || "—"}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-[#86868b] hover:text-[#FF3B30] p-2 rounded-full hover:bg-[#FF3B30]/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
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
