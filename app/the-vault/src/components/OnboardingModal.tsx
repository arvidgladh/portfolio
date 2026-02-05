"use client";

import { useEffect, useState } from "react";
import { useBudgetData } from "../context/BudgetDataContext";
import { useAppContext } from "../context/AppContext";
import { upsertUserSettings } from "../lib/firestoreService";
import { UserSettings } from "../lib/firestoreSchema";
import { useI18n } from "../i18n/useI18n";
import { useToast } from "./ToastProvider";

export function OnboardingModal() {
  const { userSettings } = useBudgetData();
  const { userId, language, setLanguage } = useAppContext();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [maxSpending, setMaxSpending] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>("SEK");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSettings || !userSettings.onboardingCompleted) {
      setIsOpen(true);
      if (userSettings) {
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
      }
    } else {
      setIsOpen(false);
    }
  }, [userSettings]);

  if (!isOpen) return null;

  function goNext() {
    setStep((prev) => (prev === 3 ? 3 : ((prev + 1) as 1 | 2 | 3)));
  }
  function goBack() {
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as 1 | 2 | 3)));
  }

  async function handleSave() {
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
      darkMode: true,
      onboardingCompleted: true,
    };

    try {
      setIsSaving(true);
      await upsertUserSettings(userId, payload);
      showToast(
        language === "sv"
          ? "Din grundbudget är sparad."
          : "Your base budget has been saved.",
        "success"
      );
      setIsOpen(false);
    } catch (err: any) {
      console.error("Onboarding save error:", err);
      const msg =
        err?.message ??
        (language === "sv"
          ? "Kunde inte spara dina uppgifter."
          : "Could not save your details.");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            Onboarding · Steg {step}/3
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            {language === "sv" ? "Hoppa över" : "Skip"}
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">
              {t("onboarding.step1.title")}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("onboarding.step1.body")}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">
              {t("onboarding.step2.title")}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("onboarding.step2.body")}
            </p>
            <p className="text-[11px] text-slate-500">
              {t("onboarding.step2.caption")}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">
              {t("onboarding.step3.title")}
            </h2>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  {t("onboarding.step3.incomeLabel")}
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-900/60"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="t.ex. 28000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">
                  {t("onboarding.step3.maxSpendingLabel")}
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-900/60"
                  value={maxSpending}
                  onChange={(e) => setMaxSpending(e.target.value)}
                  placeholder="t.ex. 23000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Valuta</label>
                <input
                  type="text"
                  className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-900/60"
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  placeholder="SEK, EUR..."
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            disabled={step === 1}
            onClick={goBack}
            className="text-[11px] text-slate-400 disabled:opacity-40"
          >
            {language === "sv" ? "Tillbaka" : "Back"}
          </button>

          <div className="flex gap-2">
            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                className="px-3 py-1.5 text-[11px] font-medium rounded bg-slate-700 text-white hover:bg-slate-600"
              >
                {language === "sv" ? "Nästa" : "Next"}
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="px-3 py-1.5 text-[11px] font-medium rounded bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-500"
              >
                {isSaving
                  ? t("settings.saving")
                  : t("onboarding.step3.cta")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
