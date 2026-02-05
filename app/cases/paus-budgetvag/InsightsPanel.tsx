"use client";

import { useMemo, useState } from "react";
import type { ForecastPoint, SummaryStats } from "./types";

type Insight = {
  id: string;
  emoji: string;
  text: string;
};

type InsightsPanelProps = {
  forecast: ForecastPoint[];
  summary: SummaryStats | null;
};

function buildLocalInsights(forecast: ForecastPoint[], summary: SummaryStats | null): Insight[] {
  const insights: Insight[] = [];

  if (summary) {
    if (summary.status === "deficit") {
      insights.push({
        id: "deficit",
        emoji: "⚠️",
        text: "Dina utgifter överstiger inkomsten. Testa minska fasta kostnader eller öka månadsbasen.",
      });
    } else if (summary.status === "surplus") {
      insights.push({
        id: "surplus",
        emoji: "✅",
        text: "Du har ett överskott varje månad. Lägg undan en buffert för de svaga månaderna.",
      });
    }

    insights.push({
      id: "best-worst",
      emoji: "📊",
      text: `Bästa månad ca ${Math.round(summary.best).toLocaleString("sv-SE")} kr · sämsta ca ${Math.round(summary.worst).toLocaleString("sv-SE")} kr.`,
    });
  }

  if (forecast.length === 0) {
    insights.push({
      id: "empty",
      emoji: "💬",
      text: "Fyll i inkomster och utgifter för att få riktade tips.",
    });
  }

  return insights;
}

export default function InsightsPanel({ forecast, summary }: InsightsPanelProps) {
  const [open, setOpen] = useState(false);
  const insights = useMemo(() => buildLocalInsights(forecast, summary), [forecast, summary]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6 lg:p-7">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-50 text-lg">
            💡
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Insikter
            </p>
            <p className="text-xs text-slate-600">
              Snabba råd baserat på din våg.
            </p>
          </div>
        </div>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] text-slate-600 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        >
          ›
        </div>
      </button>

      {open && (
        <div className="mt-5 space-y-4 text-[13px] text-slate-700">
          <ul className="space-y-3">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-2.5"
              >
                <span className="mt-[1px] text-base">{insight.emoji}</span>
                <p className="leading-relaxed">{insight.text}</p>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500">
            Den här prototypen använder enkla regler – i en riktig produkt hade vi använt AI för mer precisa råd.
          </p>
        </div>
      )}
    </section>
  );
}
