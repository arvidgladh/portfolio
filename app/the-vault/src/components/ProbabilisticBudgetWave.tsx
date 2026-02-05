"use client";

import React, { FC, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Types
 * Du kan byta dessa till dina befintliga ForecastPoint/SummaryStats
 * om du redan har dem i en separat types-fil – strukturen är densamma.
 */
export type ProbabilisticPoint = {
  id: string;
  label: string; // t.ex. "Jan", "Feb", "Mar"
  baseline: number; // förväntat värde
  bestCase: number; // om allt går bra
  worstCase: number; // om det går dåligt
};

export type ProbabilisticSummary = {
  averagePerMonth: number;
  bestMonthValue: number;
  worstMonthValue: number;
};

type Props = {
  data?: ProbabilisticPoint[];      // kan vara tom/null → vi visar fallback
  summary?: ProbabilisticSummary | null;
  loading?: boolean;
};

/**
 * Hjälpare för svensk valutaformat
 */
function formatKr(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString("sv-SE", {
    maximumFractionDigits: 0,
  })} kr`;
}

/**
 * Tooltip-komponent för grafen
 */
const BudgetWaveTooltip: FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload as ProbabilisticPoint;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl shadow-slate-900/5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 space-y-0.5 text-xs">
        <p className="text-slate-900 number">
          Varje månad · {formatKr(point.baseline)}
        </p>
        <p className="text-emerald-600 number">
          Om allt går bra · {formatKr(point.bestCase)}
        </p>
        <p className="text-rose-600 number">
          Om det går dåligt · {formatKr(point.worstCase)}
        </p>
      </div>
    </div>
  );
};

/**
 * Fallback-data om användaren inte fyllt i något än
 * – hellre en lugn "demo-våg" än tom yta.
 */
const FALLBACK_DATA: ProbabilisticPoint[] = [
  {
    id: "m1",
    label: "Jan",
    baseline: 18000,
    bestCase: 22000,
    worstCase: 14000,
  },
  {
    id: "m2",
    label: "Feb",
    baseline: 17000,
    bestCase: 21000,
    worstCase: 13000,
  },
  {
    id: "m3",
    label: "Mar",
    baseline: 19000,
    bestCase: 23000,
    worstCase: 15000,
  },
  {
    id: "m4",
    label: "Apr",
    baseline: 20000,
    bestCase: 24000,
    worstCase: 16000,
  },
  {
    id: "m5",
    label: "Maj",
    baseline: 16000,
    bestCase: 20000,
    worstCase: 12000,
  },
  {
    id: "m6",
    label: "Jun",
    baseline: 17500,
    bestCase: 21500,
    worstCase: 13500,
  },
];

const ProbabilisticBudgetWave: FC<Props> = ({ data, summary, loading }) => {
  const hasRealData = !!data && data.length > 0;
  const chartData = hasRealData ? data! : FALLBACK_DATA;

  const maxValue = useMemo(() => {
    const values = chartData.flatMap((d) => [
      d.baseline,
      d.bestCase,
      d.worstCase,
    ]);
    const max = Math.max(...values, 0);
    return max <= 0 ? 10000 : max * 1.1; // lite luft ovanför kurvan
  }, [chartData]);

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-900/5 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Vänster: Titel + graf */}
        <div className="flex-1 space-y-6">
          {/* Rubriker */}
          <header>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Din budgetvåg
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Se din ekonomi framåt
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Kurvan visar vad du i snitt har kvar varje månad. Det grå
              området visar osäkerhet – bästa och sämsta rimliga utfall.
            </p>
          </header>

          {/* Graf */}
          <div className="h-[280px] rounded-2xl bg-slate-50/80 p-4 sm:h-[340px] sm:p-5">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    {/* Lätt glow under huvudlinjen */}
                    <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    {/* Osäkerhetsband (best/worst) */}
                    <linearGradient id="uncertaintyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#e5e7eb" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    domain={[0, maxValue]}
                    tickMargin={8}
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                    tickFormatter={(v: number) =>
                      `${Math.round(v / 1000)
                        .toString()
                        .replace(".", ",")}k`
                    }
                  />

                  <Tooltip content={<BudgetWaveTooltip />} />

                  {/* Osäkerhetsband – fyllt mellan worstCase och bestCase */}
                  <Area
                    type="monotone"
                    dataKey="bestCase"
                    stackId="uncertainty"
                    stroke="none"
                    fill="url(#uncertaintyFill)"
                    fillOpacity={0.9}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="worstCase"
                    stackId="uncertainty"
                    stroke="none"
                    fill="url(#uncertaintyFill)"
                    fillOpacity={0.9}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                  />

                  {/* Baslinje – din förväntade månad */}
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="#4f46e5"
                    strokeWidth={2.4}
                    fill="url(#baselineGradient)"
                    dot={false}
                    isAnimationActive
                    animationDuration={600}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {!hasRealData && !loading && (
            <p className="text-xs text-slate-500">
              Exemplet ovan bygger på en typisk svensk månadslön. När du fyller
              i dina egna siffror uppdateras budgetvågen direkt.
            </p>
          )}
        </div>

        {/* Höger: Snabb stats-översikt */}
        <aside className="w-full max-w-xs space-y-4 lg:w-80">
          <p className="text-xs text-slate-500">
            Siffrorna nedan sammanfattar de kommande månaderna. Alla värden
            visas efter skatt och utgifter.
          </p>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-900/5">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Varje månad
              </dt>
              <dd className="mt-1 text-xl font-semibold text-slate-900 number">
                {summary ? formatKr(summary.averagePerMonth) : "—"}
              </dd>
              <p className="mt-1 text-xs text-slate-500">
                I snitt kvar att leva på.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm shadow-emerald-900/5">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
                Om allt går bra
              </dt>
              <dd className="mt-1 text-xl font-semibold text-emerald-800 number">
                {summary ? formatKr(summary.bestMonthValue) : "—"}
              </dd>
              <p className="mt-1 text-xs text-emerald-700">
                Marginalen när månaderna går din väg.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4 shadow-sm shadow-rose-900/5">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-rose-700">
                Om det går dåligt
              </dt>
              <dd className="mt-1 text-xl font-semibold text-rose-800 number">
                {summary ? formatKr(summary.worstMonthValue) : "—"}
              </dd>
              <p className="mt-1 text-xs text-rose-700">
                Lägsta rimliga nivå under perioden.
              </p>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
};

export default ProbabilisticBudgetWave;
