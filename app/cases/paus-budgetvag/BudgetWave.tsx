"use client";

import { memo, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastPoint, SummaryStats } from "./types";

type BudgetWaveProps = {
  data: ForecastPoint[];
  summary: SummaryStats | null;
  isLoading?: boolean;
};

function formatCurrency(value: number): string {
  const rounded = Math.round(value);
  return new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: 0,
  }).format(rounded) + " kr";
}

function formatShort(value: number): string {
  const rounded = Math.round(value);
  if (Math.abs(rounded) >= 1000) {
    return `${Math.round(rounded / 1000)}k`;
  }
  return `${rounded}`;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload as ForecastPoint;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 number">
        {formatCurrency(point.value)}
      </p>
    </div>
  );
};

const BudgetWaveComponent = ({ data, summary, isLoading }: BudgetWaveProps) => {
  const domainMax = useMemo(() => {
    if (!data.length) return 10000;
    const max = Math.max(...data.map((d) => d.value));
    return max <= 0 ? 10000 : max * 1.15;
  }, [data]);

  const isNegativeAll = useMemo(() => {
    if (!data.length) return false;
    return data.every((d) => d.value <= 0);
  }, [data]);

  return (
    <section
      aria-labelledby="budgetvag-heading"
      className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="budgetvag-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
          >
            Din budgetvåg
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sex månader framåt, med osäkerhet som grått fält.
          </p>
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3 text-xs sm:text-sm">
            <div className="space-y-0.5">
              <p className="label text-[11px] text-slate-500">Varje månad</p>
              <p className="number text-sm font-semibold text-slate-900">
                {formatCurrency(summary.average)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="label text-[11px] text-slate-500">
                Om allt går bra
              </p>
              <p className="number text-sm font-semibold text-emerald-600">
                {formatCurrency(summary.best)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="label text-[11px] text-slate-500">
                Om det går dåligt
              </p>
              <p className="number text-sm font-semibold text-rose-600">
                {formatCurrency(summary.worst)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 h-[260px] w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-900/95 px-3 py-3 sm:h-[320px] sm:px-4 sm:py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="waveArea"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isNegativeAll ? "#fb7185" : "#4f46e5"}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor={isNegativeAll ? "#fb7185" : "#4f46e5"}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#1f2933"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, domainMax]}
                tickFormatter={formatShort}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isNegativeAll ? "#fb7185" : "#6366f1"}
                strokeWidth={2.2}
                fill="url(#waveArea)"
                animationDuration={400}
                animationEasing="ease-out"
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export const BudgetWave = memo(BudgetWaveComponent);
