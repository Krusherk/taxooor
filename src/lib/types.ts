export interface IncomeEntry {
  id: string;
  date: string;
  platform: string;
  amount: number;
  currency: "USD" | "NGN";
  description: string;
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
  maxAllowed?: number;
}

export interface TaxBand {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

export interface TaxBandResult {
  band: TaxBand;
  taxableInBand: number;
  taxInBand: number;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  bandBreakdown: TaxBandResult[];
  totalTax: number;
  effectiveRate: number;
  monthlyTaxGoal: number;
  auditRisk: "low" | "medium" | "high";
}

export interface AppSettings {
  exchangeRate: number;
  taxPotPercentage: number;
  taxPotSaved: number;
}

export interface PenaltyResult {
  type: "tin" | "late-filing";
  months: number;
  totalPenalty: number;
  breakdown: { month: number; amount: number; cumulative: number }[];
}

export type Platform =
  | "Upwork"
  | "Fiverr"
  | "Toptal"
  | "Direct Client"
  | "Freelancer.com"
  | "99designs"
  | "Andela"
  | "Other";

export const PLATFORMS: Platform[] = [
  "Upwork",
  "Fiverr",
  "Toptal",
  "Direct Client",
  "Freelancer.com",
  "99designs",
  "Andela",
  "Other",
];
