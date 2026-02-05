// src/lib/budgetWaveModel.ts
// Probabilistisk 6-månadersmodell (kernel-baserad budgetvåg)

import {
  HistoricalMonth,
  BudgetForecastPoint,
  BudgetForecastResult,
} from "./firestoreSchema";

// Helper: format YYYY-MM
function addMonths(base: string, offset: number): string {
  const [year, month] = base.split("-").map(Number);
  const date = new Date(year, month - 1);
  date.setMonth(date.getMonth() + offset);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// Simple kernel smoother (very light)
function kernelSmooth(values: number[]): number {
  if (values.length === 0) return 0;

  // Weighted average: nearer values matter more
  const weights = values.map((_, i) => 1 / (1 + Math.abs(i - (values.length - 1))));
  const weightedSum = values.reduce((sum, v, i) => sum + v * weights[i], 0);
  const weightTotal = weights.reduce((sum, w) => sum + w, 0);

  return weightedSum / weightTotal;
}

export function generate6MonthForecast(
  history: HistoricalMonth[]
): BudgetForecastResult {
  if (!history || history.length === 0) {
    return {
      forecast: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        method: "probabilistic-kernel",
        version: "1.0",
      },
    };
  }

  // Extract net values
  const nets = history.map((h) => h.net);

  // Compute mean trend using kernel smoothing
  const meanTrend = kernelSmooth(nets);

  // Compute uncertainty bands (simple variance-based estimate)
  const variance =
    nets.length > 1
      ? nets.reduce((s, v) => s + Math.pow(v - meanTrend, 2), 0) /
        (nets.length - 1)
      : 0;

  // 1 std deviation approximation
  const std = Math.sqrt(variance);

  // Lower and upper bounds
  const lowerBand = meanTrend - std * 1.2;
  const upperBand = meanTrend + std * 1.2;

  // Determine last month in history
  const lastMonth = history[history.length - 1].month;

  const forecast: BudgetForecastPoint[] = [];

  for (let i = 1; i <= 6; i++) {
    const month = addMonths(lastMonth, i);

    forecast.push({
      month,
      mean: Math.round(meanTrend),
      lower: Math.round(lowerBand),
      upper: Math.round(upperBand),
    });
  }

  return {
    forecast,
    metadata: {
      generatedAt: new Date().toISOString(),
      method: "probabilistic-kernel",
      version: "1.0",
    },
  };
}
