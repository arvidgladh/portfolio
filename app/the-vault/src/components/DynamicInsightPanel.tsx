"use client";

import { useState } from "react";
import { useBudgetData } from "../context/BudgetDataContext";
import { useAppContext } from "../context/AppContext";
import { generate6MonthForecast } from "../lib/budgetWaveModel";
import { GeminiAnalysisResult } from "../lib/geminiClient";
import { useI18n } from "../i18n/useI18n";
import { useToast } from "./ToastProvider";

export function DynamicInsightPanel() {
  const { historicalData, userSettings } = useBudgetData();
  const { language } = useAppContext();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasHistory = historicalData && historicalData.length > 0;

  async function handleAnalyse() {
    if (!hasHistory) return;

    setIsLoading(true);
    setError(null);

    try {
      const forecast = generate6MonthForecast(historicalData);

      const res = await fetch("/api/gemini-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forecast,
          userSettings,
          language,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        const msg = `${t("insight.error.prefix")}: ${text.slice(
          0,
          160
        )}`;
        setError(msg);
        showToast(msg, "error");
        return;
      }

      const data = (await res.json()) as GeminiAnalysisResult;
      setAdvice(data.advice ?? null);
      if (!data.advice) {
        showToast(t("insight.empty.noAdvice"), "info");
      } else {
        showToast(
          language === "sv"
            ? "AI-analysen är uppdaterad."
            : "AI analysis updated.",
          "success"
        );
      }
    } catch (err: any) {
      console.error("DynamicInsightPanel error:", err);
      const msg = `${t("insight.error.prefix")}: ${
        err?.message ?? "okänt fel"
      }`;
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h2 className="text-sm font-semibold">
            {t("insight.title")}
          </h2>
          <p className="text-xs text-slate-400">
            {t("insight.subtitle")}
          </p>
        </div>

        <button
          type="button"
          disabled={!hasHistory || isLoading}
          onClick={handleAnalyse}
          className="inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-medium rounded bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-500 transition-colors"
        >
          {isLoading
            ? t("insight.loading")
            : hasHistory
            ? language === "sv"
              ? "Analysera prognosen"
              : "Analyse forecast"
            : language === "sv"
            ? "Vänta på historik"
            : "Waiting for history"}
        </button>
      </div>

      {!hasHistory && (
        <p className="text-xs text-slate-500">
          {t("insight.empty.needHistory")}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
          {error}
        </p>
      )}

      {advice && (
        <div className="mt-3 rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs leading-relaxed text-slate-100 whitespace-pre-line">
          {advice}
        </div>
      )}

      {!advice && hasHistory && !isLoading && !error && (
        <p className="mt-2 text-[11px] text-slate-500">
          {t("insight.empty.noAdvice")}
        </p>
      )}
    </section>
  );
}
