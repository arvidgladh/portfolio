"use client";

import { useEffect, useState } from "react";
import { useBudgetData } from "../context/BudgetDataContext";
import { useAppContext, AppLanguage } from "../context/AppContext";
import { upsertUserSettings } from "../lib/firestoreService";
import { UserSettings } from "../lib/firestoreSchema";
import { useI18n } from "../i18n/useI18n";
import { useToast } from "./ToastProvider";

export function SettingsPanel() {
  const { userSettings } = useBudgetData();
  const {
    userId,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
  } = useAppContext();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [maxSpending, setMaxSpending] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>("SEK");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSettings) return;
    setMonthlyIncome(
      userSettings.monthlyIncome
        ? String(userSettings.monthlyIncome)
        : ""
    );
    setMaxSpending(
      userSettings.maxMonthlySpending
        ? String(userSettings.maxMonthlySpending)
        : ""
    );
    setBaseCurrency(userSettings.baseCurrency || "SEK");
  }, [userSettings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setError(null);

    const incomeNum = Number(monthlyIncome.replace(",", "."));
    if (Number.isNaN(incomeNum) || incomeNum <= 0) {
      setError(t("onboarding.error.income"));
      return;
    }

    const maxNum = Number(maxSpending.replace(",", "."));
    if (Number.isNaN(maxNum) || maxNum <= 0) {
      setError(t("onboarding.error.maxSpending"));
      return;
    }

    const payload: UserSettings = {
      baseCurrency: baseCurrency || "SEK",
      monthlyIncome: incomeNum,
      maxMonthlySpending: maxNum,
      language,
      darkMode: isDarkMode,
      onboardingCompleted: userSettings?.onboardingCompleted ?? true,
    };

    try {
      setIsSaving(true);
      await upsertUserSettings(userId, payload);
      showToast(t("settings.saved"), "success");
    } catch (err: any) {
      console.error("Settings save error:", err);
      const msg =
        t("settings.errorPrefix") +
        ": " +
        (err?.message ?? "okänt fel");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLang = e.target.value as AppLanguage;
    setLanguage(nextLang);
  }

  return (
    <form
      onSubmit={handleSave}
      className="border border-slate-800 rounded-lg p-4 bg-slate-900/40"
    >
      <h2 className="text-sm font-semibold mb-1">
        {t("settings.title")}
      </h2>
      <p className="text-xs text-slate-400 mb-3">
        {t("settings.subtitle")}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Appinställningar */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-300">
            {t("settings.section.app")}
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              {t("settings.languageLabel")}
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            >
              <option value="sv">Svenska</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              id="darkMode"
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className="h-4 w-4"
            />
            <label
              htmlFor="darkMode"
              className="text-xs text-slate-200"
            >
              {t("settings.darkModeLabel")}
            </label>
          </div>
        </div>

        {/* Budgetmål */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-300">
            {t("settings.section.budget")}
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              {t("settings.incomeLabel")}
            </label>
            <input
              type="number"
              className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              {t("settings.maxSpendingLabel")}
            </label>
            <input
              type="number"
              className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
              value={maxSpending}
              onChange={(e) => setMaxSpending(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              {t("settings.currencyLabel")}
            </label>
            <input
              type="text"
              className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-3 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-500"
      >
        {isSaving ? t("settings.saving") : t("settings.saveButton")}
      </button>
    </form>
  );
}
