"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Transaction } from "./types";

type InputPanelProps = {
  basePerMonth: number;
  onBasePerMonthChange: (value: number) => void;
  transactions: Transaction[];
  onTransactionsChange: (txs: Transaction[]) => void;
};

type ToastState = {
  message: string;
  tone: "success" | "error";
};

export function InputPanel({
  basePerMonth,
  onBasePerMonthChange,
  transactions,
  onTransactionsChange,
}: InputPanelProps) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [kind, setKind] = useState<"income" | "expense" | "subscription">(
    "expense"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const hasError = useMemo(() => {
    const value = Number(amount.replace(/\s/g, ""));
    if (!amount) return true;
    if (Number.isNaN(value)) return true;
    if (value <= 0) return true;
    if (value > 999999) return true;
    return false;
  }, [amount]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (hasError) {
      setToast({
        tone: "error",
        message: "Fyll i ett giltigt belopp.",
      });
      return;
    }
    const numeric = Number(amount.replace(/\s/g, ""));
    const trimmedLabel = label.trim() || "Ny post";

    const tx: Transaction = {
      id: uuid(),
      label: trimmedLabel,
      amount: Math.abs(numeric),
      kind,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    onTransactionsChange([...transactions, tx]);
    setToast({ tone: "success", message: "Tillagd ✓" });
    setLabel("");
    setAmount("");
    setKind("expense");
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      clearForm();
    }
  };

  const clearForm = () => {
    setLabel("");
    setAmount("");
    setKind("expense");
  };

  const clearAllTransactions = () => {
    if (transactions.length === 0) return;
    const ok = window.confirm("Rensa alla poster?");
    if (!ok) return;
    onTransactionsChange([]);
    setToast({ tone: "success", message: "Alla poster rensade." });
  };

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.kind === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.kind !== "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const hasDeficit = totalExpenses > totalIncome + basePerMonth;

  const removeTransaction = (id: string) => {
    onTransactionsChange(transactions.filter((t) => t.id !== id));
  };

  return (
    <section className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Dina poster
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fyll i inkomster, utgifter och prenumerationer.
          </p>
        </div>

        <button
          type="button"
          onClick={clearAllTransactions}
          className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline"
        >
          Rensa alla
        </button>
      </div>

      {/* Bas per månad */}
      <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4">
        <p className="label text-[11px] text-slate-500">Månadsbas</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              max={999999}
              value={basePerMonth || ""}
              onChange={(e) =>
                onBasePerMonthChange(
                  Math.max(0, Math.min(999999, Number(e.target.value || 0)))
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
              placeholder="28000"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-400">
              kr
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Din lön efter skatt, ungefär per månad.
        </p>
      </div>

      {/* Formulär */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="mt-6 space-y-4"
        aria-label="Lägg till post"
      >
        <div className="space-y-2">
          <p className="label text-[11px] text-slate-500">Ny post</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr,1fr,1fr]">
            <div className="relative">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                placeholder="Hyra, mat, gymkort…"
              />
            </div>

            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={999999}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full rounded-2xl border bg-white px-3.5 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  hasError
                    ? "border-rose-300 focus-visible:ring-rose-400"
                    : "border-slate-200 focus-visible:ring-indigo-500"
                }`}
                placeholder="1200"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-400">
                kr
              </span>
            </div>

            <div className="flex gap-2">
              <select
                value={kind}
                onChange={(e) =>
                  setKind(e.target.value as "income" | "expense" | "subscription")
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
              >
                <option value="income">Inkomst</option>
                <option value="expense">Utgift</option>
                <option value="subscription">Prenumeration</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {hasError ? "Fyll i ett belopp över 0 kr." : "Tryck Enter för att lägga till."}
          </div>
          <button
            type="submit"
            disabled={hasError || isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-50 border-t-transparent" />
            )}
            <span>Lägg till post</span>
          </button>
        </div>
      </form>

      {/* Summering */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:grid-cols-3 sm:text-sm">
        <div>
          <p className="label text-[11px] text-slate-500">Inkomster</p>
          <p className="number mt-1 font-semibold text-emerald-700">
            {new Intl.NumberFormat("sv-SE", {
              maximumFractionDigits: 0,
            }).format(totalIncome + basePerMonth)}{" "}
            kr
          </p>
        </div>
        <div>
          <p className="label text-[11px] text-slate-500">Utgifter</p>
          <p
            className={`number mt-1 font-semibold ${
              hasDeficit ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {new Intl.NumberFormat("sv-SE", {
              maximumFractionDigits: 0,
            }).format(totalExpenses)}{" "}
            kr
          </p>
        </div>
        <div>
          <p className="label text-[11px] text-slate-500">Kvar att leva på</p>
          <p
            className={`number mt-1 font-semibold ${
              hasDeficit ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {new Intl.NumberFormat("sv-SE", {
              maximumFractionDigits: 0,
            }).format(basePerMonth + totalIncome - totalExpenses)}{" "}
            kr
          </p>
        </div>
      </div>

      {/* Lista med poster */}
      <div className="mt-6">
        <p className="label text-[11px] text-slate-500">Poster</p>
        {transactions.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Inga poster än. Lägg till din första.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-1 items-center gap-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium ${
                      tx.kind === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : tx.kind === "subscription"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {tx.kind === "income"
                      ? "IN"
                      : tx.kind === "subscription"
                      ? "SUB"
                      : "UT"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-900">
                      {tx.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`number text-xs font-semibold ${
                      tx.kind === "income" ? "text-emerald-700" : "text-slate-900"
                    }`}
                  >
                    {tx.kind === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("sv-SE", {
                      maximumFractionDigits: 0,
                    }).format(tx.amount)}{" "}
                    kr
                  </p>
                  <button
                    type="button"
                    onClick={() => removeTransaction(tx.id)}
                    className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-xs font-medium text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                    aria-label={`Ta bort ${tx.label}`}
                  >
                    Ta bort
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-4">
          <div
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs shadow-lg ${
              toast.tone === "success"
                ? "bg-emerald-600 text-emerald-50"
                : "bg-rose-600 text-rose-50"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </section>
  );
}
