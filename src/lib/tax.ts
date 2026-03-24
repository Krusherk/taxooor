import type { TaxBand, TaxBandResult, TaxResult, Deduction } from "./types";

export const TAX_BANDS: TaxBand[] = [
  { min: 0, max: 800_000, rate: 0, label: "Tax-Free Threshold" },
  { min: 800_001, max: 3_000_000, rate: 0.15, label: "₦800K – ₦3M" },
  { min: 3_000_001, max: 12_000_000, rate: 0.18, label: "₦3M – ₦12M" },
  { min: 12_000_001, max: 25_000_000, rate: 0.21, label: "₦12M – ₦25M" },
  { min: 25_000_001, max: 50_000_000, rate: 0.23, label: "₦25M – ₦50M" },
  { min: 50_000_001, max: null, rate: 0.25, label: "Above ₦50M" },
];

export function calculateTax(annualIncomeNGN: number, deductions: Deduction[] = []): TaxResult {
  const totalDeductions = deductions.reduce((sum, d) => {
    const allowed = d.maxAllowed ? Math.min(d.amount, d.maxAllowed) : d.amount;
    return sum + allowed;
  }, 0);

  const taxableIncome = Math.max(0, annualIncomeNGN - totalDeductions);
  let remaining = taxableIncome;
  const bandBreakdown: TaxBandResult[] = [];
  let totalTax = 0;

  for (const band of TAX_BANDS) {
    if (remaining <= 0) {
      bandBreakdown.push({ band, taxableInBand: 0, taxInBand: 0 });
      continue;
    }

    const bandWidth = band.max !== null ? band.max - band.min + 1 : Infinity;
    const taxableInBand = Math.min(remaining, bandWidth);
    const taxInBand = taxableInBand * band.rate;

    bandBreakdown.push({ band, taxableInBand, taxInBand });
    totalTax += taxInBand;
    remaining -= taxableInBand;
  }

  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
  const monthlyTaxGoal = totalTax / 12;

  let auditRisk: "low" | "medium" | "high" = "low";
  if (annualIncomeNGN > 50_000_000) auditRisk = "high";
  else if (annualIncomeNGN > 25_000_000) auditRisk = "medium";

  return {
    grossIncome: annualIncomeNGN,
    totalDeductions,
    taxableIncome,
    bandBreakdown,
    totalTax,
    effectiveRate,
    monthlyTaxGoal,
    auditRisk,
  };
}

export function calculateTinPenalty(months: number) {
  const breakdown: { month: number; amount: number; cumulative: number }[] = [];
  let total = 0;
  for (let i = 1; i <= months; i++) {
    const amount = i === 1 ? 50_000 : 25_000;
    total += amount;
    breakdown.push({ month: i, amount, cumulative: total });
  }
  return { type: "tin" as const, months, totalPenalty: total, breakdown };
}

export function calculateLatePenalty(months: number) {
  const breakdown: { month: number; amount: number; cumulative: number }[] = [];
  let total = 0;
  for (let i = 1; i <= months; i++) {
    const amount = i === 1 ? 100_000 : 50_000;
    total += amount;
    breakdown.push({ month: i, amount, cumulative: total });
  }
  return { type: "late-filing" as const, months, totalPenalty: total, breakdown };
}
