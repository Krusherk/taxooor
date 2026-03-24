"use client";

import type { IncomeEntry, AppSettings } from "./types";

const ENTRIES_KEY = "taxooor_entries";
const SETTINGS_KEY = "taxooor_settings";

const DEFAULT_SETTINGS: AppSettings = {
  exchangeRate: 1380,
  taxPotPercentage: 20,
  taxPotSaved: 0,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getEntries(): IncomeEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: IncomeEntry[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function addEntry(entry: IncomeEntry): IncomeEntry[] {
  const entries = getEntries();
  entries.unshift(entry);
  saveEntries(entries);
  return entries;
}

export function updateEntry(id: string, updated: Partial<IncomeEntry>): IncomeEntry[] {
  const entries = getEntries().map((e) =>
    e.id === id ? { ...e, ...updated } : e
  );
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string): IncomeEntry[] {
  const entries = getEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

export function getSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  if (isBrowser()) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getTotalUSD(entries: IncomeEntry[], rate: number): number {
  return entries.reduce((sum, e) => {
    if (e.currency === "USD") return sum + e.amount;
    return sum + e.amount / rate;
  }, 0);
}

export function getTotalNGN(entries: IncomeEntry[], rate: number): number {
  return entries.reduce((sum, e) => {
    if (e.currency === "NGN") return sum + e.amount;
    return sum + e.amount * rate;
  }, 0);
}
