// FILE: app/the-vault/src/lib/forecast-logic.ts
import type { ForecastPoint, Subscription, SummaryStats, Transaction } from "../types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun"];

export function buildForecast(
  basePerMonth: number,
  transactions: Transaction[],
  subscriptions: Subscription[]
): ForecastPoint[] {
  const subsTotal = subscriptions.reduce((sum, sub) => sum + sub.amountMonthly, 0);
  const income = transactions
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.kind !== "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const baseline = Math.max(0, basePerMonth + income - expenses - subsTotal);

  return MONTH_LABELS.map((label, idx) => ({
    id: `m-${idx}`,
    label,
    baseline,
    bestCase: Math.round(baseline * 1.15),
    worstCase: Math.round(baseline * 0.75),
  }));
}

export function buildSummary(forecast: ForecastPoint[]): SummaryStats | null {
  if (!forecast.length) return null;

  const averages = forecast.map((p) => p.baseline);
  const averagePerMonth = averages.reduce((sum, v) => sum + v, 0) / averages.length;
  const bestMonthValue = Math.max(...forecast.map((p) => p.bestCase));
  const worstMonthValue = Math.min(...forecast.map((p) => p.worstCase));

  let status: SummaryStats["status"] = "balanced";
  if (averagePerMonth > 0 && worstMonthValue >= 0) status = "surplus";
  if (averagePerMonth <= 0 || worstMonthValue < 0) status = "deficit";

  return { averagePerMonth, bestMonthValue, worstMonthValue, status };
}
