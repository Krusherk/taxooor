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

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 24,
  boxShadow: "0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#86868b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

const bigNumberStyle: React.CSSProperties = {
  fontSize: "clamp(28px, 5vw, 48px)",
  fontWeight: 700,
  letterSpacing: "-0.04em",
  lineHeight: 1.1,
};

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
      id: generateId(), date, platform,
      amount: parseFloat(amount), currency, description,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#1d1d1f" }}>
            Dashboard
          </h1>
          <p style={{ color: "#86868b", marginTop: 12, fontSize: 17 }}>
            Income tracking aligned with NTA 2026.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fff", color: "#1d1d1f",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 9999, padding: "12px 24px",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Download style={{ width: 16, height: 16 }} /> Export Report
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <div style={{ ...cardStyle, padding: 32 }}>
          <p style={labelStyle}>Total USD</p>
          <p style={bigNumberStyle}>{formatCurrency(totalUSD, "USD")}</p>
        </div>

        <div style={{ ...cardStyle, padding: 32, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...labelStyle, marginBottom: 8 }}>
            <span>Exchange Rate</span>
            <Edit2 style={{ width: 12, height: 12, opacity: 0.4 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ ...bigNumberStyle, color: "#86868b" }}>₦</span>
            <input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              onBlur={handleRateSave}
              onKeyDown={(e) => e.key === "Enter" && handleRateSave()}
              style={{ ...bigNumberStyle, background: "transparent", border: "none", outline: "none", width: 140 }}
            />
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 32, background: "#007AFF", borderColor: "transparent" }}>
          <p style={{ ...labelStyle, color: "rgba(255,255,255,0.7)" }}>Taxable NGN</p>
          <p style={{ ...bigNumberStyle, color: "#fff" }}>{formatCurrency(totalNGN, "NGN")}</p>
        </div>
      </div>

      {/* Income Form */}
      <div style={cardStyle}>
        <div style={{
          padding: "20px 32px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.4)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Log Income</h2>
        </div>

        <div style={{
          padding: 32,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
          alignItems: "end",
        }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-apple" style={{ width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} className="input-apple" style={{ width: "100%" }}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Currency</label>
            <div style={{ display: "flex", background: "rgba(0,0,0,0.05)", padding: 4, borderRadius: 14 }}>
              {(["USD", "NGN"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 15, fontWeight: 500,
                    border: "none", cursor: "pointer",
                    background: currency === c ? "#fff" : "transparent",
                    color: currency === c ? "#1d1d1f" : "#86868b",
                    boxShadow: currency === c ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Amount</label>
            <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-apple" style={{ width: "100%" }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Note (Optional)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text" placeholder="Client name, project..."
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="input-apple" style={{ flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button
                onClick={handleAdd}
                disabled={!amount || !date}
                style={{
                  width: 48, height: 48, borderRadius: 9999, border: "none", cursor: "pointer",
                  background: "#007AFF", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: (!amount || !date) ? 0.4 : 1,
                  flexShrink: 0,
                }}
              >
                <Plus style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div style={cardStyle}>
        <div style={{
          padding: "20px 32px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.4)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Recent Transactions</h2>
          <span style={{
            background: "rgba(0,0,0,0.05)", color: "#86868b",
            fontSize: 13, fontWeight: 600,
            padding: "4px 12px", borderRadius: 9999,
          }}>
            {entries.length}
          </span>
        </div>

        {entries.length === 0 ? (
          <div style={{ padding: "80px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>No income logged yet</p>
            <p style={{ color: "#86868b" }}>Add your first transaction above to see it here.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Platform", "Amount", "Note", ""].map((h, i) => (
                    <th key={h || i} style={{
                      padding: "12px 32px",
                      ...labelStyle,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      textAlign: h === "Amount" ? "right" : "left",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <td style={{ padding: "16px 32px", fontSize: 15 }}>
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td style={{ padding: "16px 32px" }}>
                      <span style={{
                        background: "rgba(0,0,0,0.05)", color: "#1d1d1f",
                        padding: "4px 12px", borderRadius: 9999,
                        fontSize: 13, fontWeight: 500,
                      }}>
                        {entry.platform}
                      </span>
                    </td>
                    <td style={{ padding: "16px 32px", textAlign: "right", fontWeight: 600, fontSize: 15 }}>
                      {formatCurrency(entry.amount, entry.currency)}
                    </td>
                    <td style={{ padding: "16px 32px", color: "#86868b", fontSize: 15, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.description || "—"}
                    </td>
                    <td style={{ padding: "16px 32px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: 8,
                          borderRadius: "50%", color: "#86868b",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <X style={{ width: 16, height: 16 }} />
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
