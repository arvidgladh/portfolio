"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "./types";

type OnboardingWizardProps = {
  onApply: (basePerMonth: number, txs: Transaction[]) => void;
};

type Step = 0 | 1 | 2 | 3;

export function OnboardingWizard({ onApply }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>(0);
  const [income, setIncome] = useState<string>("28000");
  const [expenses, setExpenses] = useState<string>("20000");
  const [subscriptions, setSubscriptions] = useState<string>("450");

  const incomeValue = useMemo(
    () => Math.max(0, Math.min(999999, Number(income || 0))),
    [income]
  );
  const expensesValue = useMemo(
    () => Math.max(0, Math.min(999999, Number(expenses || 0))),
    [expenses]
  );
  const subsValue = useMemo(
    () => Math.max(0, Math.min(999999, Number(subscriptions || 0))),
    [subscriptions]
  );

  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return incomeValue > 0;
    if (step === 2) return expensesValue >= 0;
    if (step === 3) return true;
    return false;
  }, [step, incomeValue, expensesValue]);

  useEffect(() => {
    if (step !== 3) return;
    const base = incomeValue;
    const txs: Transaction[] = [
      {
        id: "onb-hyra",
        label: "Hyra",
        amount: Math.round(expensesValue * 0.45),
        kind: "expense",
        createdAt: new Date().toISOString(),
      },
      {
        id: "onb-mat",
        label: "Mat",
        amount: Math.round(expensesValue * 0.3),
        kind: "expense",
        createdAt: new Date().toISOString(),
      },
      {
        id: "onb-ovrigt",
        label: "Övrigt",
        amount: Math.max(0, expensesValue - Math.round(expensesValue * 0.75)),
        kind: "expense",
        createdAt: new Date().toISOString(),
      },
      {
        id: "onb-sub",
        label: "Prenumerationer",
        amount: subsValue,
        kind: "subscription",
        createdAt: new Date().toISOString(),
      },
    ];
    onApply(base, txs);
  }, [step, incomeValue, expensesValue, subsValue, onApply]);

  const goNext = () => {
    if (!canNext) return;
    setStep((prev): Step => (prev < 3 ? ((prev + 1) as Step) : prev));
  };

  const goBack = () => {
    setStep((prev): Step => (prev > 0 ? ((prev - 1) as Step) : prev));
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label text-[11px] text-slate-500">Kom igång</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Se din ekonomi framåt
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tre snabba steg, sedan ritar vi din budgetvåg.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="number">
            Steg {step + 1} av 4
          </span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${
                  i <= step ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl bg-slate-50 p-4 sm:p-5">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                Så här funkar det
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Du fyller i ungefärliga siffror.</li>
                <li>• Vi ritar sex månader framåt.</li>
                <li>• Du kan finslipa allt i dashboarden sen.</li>
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                Vad tjänar du per månad?
              </p>
              <p className="text-xs text-slate-600">
                Din lön efter skatt, avrunda hellre än att vara exakt.
              </p>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={999999}
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                  placeholder="28000"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-400">
                  kr
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                Ungefär vad spenderar du?
              </p>
              <p className="text-xs text-slate-600">
                Totalt per månad på hyra, mat, allt.
              </p>
              <div className="relative mt-2">
                <input
                  type="range"
                  min={0}
                  max={Math.max(incomeValue || 30000, 10000)}
                  value={expensesValue}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span>Lite</span>
                <span className="number text-sm font-semibold text-slate-900">
                  {new Intl.NumberFormat("sv-SE", {
                    maximumFractionDigits: 0,
                  }).format(expensesValue)}{" "}
                  kr
                </span>
                <span>Mycket</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                Prenumerationer varje månad?
              </p>
              <p className="text-xs text-slate-600">
                Streaming, gymkort, appar – uppskatta summan.
              </p>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={999999}
                  value={subscriptions}
                  onChange={(e) => setSubscriptions(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                  placeholder="450"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-400">
                  kr
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:p-5">
          <div>
            <p className="label text-[11px] text-slate-500">
              Förhandskoll (exempel)
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Vi bygger en enkel bild av dina kommande månader. Du kan alltid
              justera allt senare.
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-white p-3">
              <div className="flex items-center justify-between">
                <span>Inkomst</span>
                <span className="number font-semibold text-emerald-700">
                  {new Intl.NumberFormat("sv-SE", {
                    maximumFractionDigits: 0,
                  }).format(incomeValue)}{" "}
                  kr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Utgifter</span>
                <span className="number font-semibold text-rose-600">
                  {new Intl.NumberFormat("sv-SE", {
                    maximumFractionDigits: 0,
                  }).format(expensesValue)}{" "}
                  kr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prenumerationer</span>
                <span className="number font-semibold text-slate-900">
                  {new Intl.NumberFormat("sv-SE", {
                    maximumFractionDigits: 0,
                  }).format(subsValue)}{" "}
                  kr
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Kvar att leva på</span>
                <span
                  className={`number font-semibold ${
                    incomeValue - expensesValue - subsValue < 0
                      ? "text-rose-600"
                      : "text-emerald-700"
                  }`}
                >
                  {new Intl.NumberFormat("sv-SE", {
                    maximumFractionDigits: 0,
                  }).format(
                    incomeValue - expensesValue - subsValue
                  )}{" "}
                  kr
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-2xl px-4 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tillbaka
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {step < 3 ? "Nästa" : "Rita min budgetvåg"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
