import { jsPDF } from "jspdf";
import type { IncomeEntry, TaxResult } from "./types";
import { formatCurrency } from "./utils";

export function generateTaxReport(
  entries: IncomeEntry[],
  taxResult: TaxResult,
  exchangeRate: number,
  totalUSD: number,
  totalNGN: number
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(0, 135, 81); // Nigerian green
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("taxooor", 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Nigerian Freelancer Tax Report — 2026 NTA Compliance", 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG")}`, 14, 35);
  y = 50;

  // Earnings Summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Earnings Summary", 14, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Exchange Rate: ₦${exchangeRate.toLocaleString()} / $1`, 14, y);
  y += 7;
  doc.text(`Total Entries: ${entries.length}`, 14, y);
  y += 7;
  doc.text(`Total in USD: ${formatCurrency(totalUSD, "USD")}`, 14, y);
  y += 7;
  doc.text(`Total in NGN: ${formatCurrency(totalNGN, "NGN")}`, 14, y);
  y += 12;

  // Tax Breakdown
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Calculation Breakdown", 14, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Gross Income: ${formatCurrency(taxResult.grossIncome)}`, 14, y);
  y += 7;
  doc.text(`Deductions: ${formatCurrency(taxResult.totalDeductions)}`, 14, y);
  y += 7;
  doc.text(`Taxable Income: ${formatCurrency(taxResult.taxableIncome)}`, 14, y);
  y += 10;

  // Band table
  doc.setFont("helvetica", "bold");
  doc.text("Band", 14, y);
  doc.text("Rate", 80, y);
  doc.text("Taxable", 110, y);
  doc.text("Tax", 155, y);
  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 190, y);
  y += 5;
  doc.setFont("helvetica", "normal");

  for (const br of taxResult.bandBreakdown) {
    if (br.taxableInBand > 0) {
      doc.text(br.band.label, 14, y);
      doc.text(`${(br.band.rate * 100).toFixed(0)}%`, 80, y);
      doc.text(formatCurrency(br.taxableInBand), 110, y);
      doc.text(formatCurrency(br.taxInBand), 155, y);
      y += 7;
    }
  }

  y += 3;
  doc.line(14, y, 190, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Tax: ${formatCurrency(taxResult.totalTax)}`, 14, y);
  y += 7;
  doc.text(`Effective Rate: ${taxResult.effectiveRate.toFixed(2)}%`, 14, y);
  y += 7;
  doc.text(`Monthly Savings Goal: ${formatCurrency(taxResult.monthlyTaxGoal)}`, 14, y);
  y += 15;

  // Raenest Recommendation
  doc.setFillColor(0, 135, 81);
  doc.rect(14, y - 3, pageWidth - 28, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Raenest Recommendation", 20, y + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Use Raenest to receive USD payments, avoid forced NGN conversions at bad rates,",
    20,
    y + 13
  );
  doc.text(
    "and withdraw when exchange rates are favourable. Save up to 3-5% on every payout.",
    20,
    y + 20
  );

  doc.save("taxooor-tax-report.pdf");
}
