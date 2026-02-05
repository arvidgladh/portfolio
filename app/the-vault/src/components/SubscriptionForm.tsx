"use client";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useBudgetData } from "../context/BudgetDataContext";
import { createSubscription } from "../lib/firestoreService";
import { useToast } from "./ToastProvider";

export function SubscriptionForm() {
  const { userId } = useAppContext();
  const { userSettings } = useBudgetData();
  const { showToast } = useToast();

  const [name, setName] = useState<string>("");
  const [amountMonthly, setAmountMonthly] = useState<string>("");
  const [billingDay, setBillingDay] = useState<string>("1");
  const [category, setCategory] = useState<string>("");

  const [isActive, setIsActive] = useState<boolean>(true);
  const [nextBillingDate, setNextBillingDate] = useState<string>("");

  const defaultCurrency = userSettings?.baseCurrency ?? "SEK";

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!userId) {
      const msg = "Ingen användare är inloggad.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!name.trim()) {
      const msg = "Namn på abonnemang måste anges.";
      setError(msg);
      return;
    }

    const numericAmount = Number(amountMonthly.replace(",", "."));
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      const msg = "Månadskostnad måste vara ett positivt tal.";
      setError(msg);
      return;
    }

    const numericBillingDay = Number(billingDay);
    if (
      Number.isNaN(numericBillingDay) ||
      numericBillingDay < 1 ||
      numericBillingDay > 31
    ) {
      const msg = "Debiteringsdag måste vara mellan 1 och 31.";
      setError(msg);
      return;
    }

    if (!category.trim()) {
      const msg = "Kategori måste anges.";
      setError(msg);
      return;
    }

    try {
      setIsSubmitting(true);

      await createSubscription(userId, {
        name: name.trim(),
        amountMonthly: numericAmount,
        currency: defaultCurrency,
        billingDay: numericBillingDay,
        category: category.trim(),
        isActive,
        nextBillingDate: nextBillingDate || undefined,
      });

      showToast("Abonnemanget har sparats.", "success");

      setName("");
      setAmountMonthly("");
      setBillingDay("1");
      setCategory("");
      setNextBillingDate("");
      setIsActive(true);
    } catch (err: any) {
      console.error("createSubscription error:", err);
      const msg = err?.message ?? "Kunde inte spara abonnemanget.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-slate-800 p-4 bg-slate-900/40 hover:border-slate-700 transition-colors"
    >
      <h2 className="text-sm font-semibold mb-1">Lägg till abonnemang</h2>

      <div className="space-y-1">
        <label className="text-xs font-medium">Namn</label>
        <input
          type="text"
          className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Netflix, Gymkort, Mobilabonnemang..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">
            Månadskostnad ({defaultCurrency})
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={amountMonthly}
            onChange={(e) => setAmountMonthly(e.target.value)}
            placeholder="t.ex. 129.00"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Debiteringsdag</label>
          <input
            type="number"
            min={1}
            max={31}
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={billingDay}
            onChange={(e) => setBillingDay(e.target.value)}
            placeholder="1–31"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Kategori</label>
        <input
          type="text"
          className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Underhållning, Träning..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        <div className="space-y-1">
          <label className="text-xs font-medium">
            Nästa debiteringsdatum (valfritt)
          </label>
          <input
            type="date"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={nextBillingDate}
            onChange={(e) => setNextBillingDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-xs">
            Aktivt abonnemang
          </label>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-500 transition-colors"
      >
        {isSubmitting ? "Sparar..." : "Spara abonnemang"}
      </button>
    </form>
  );
}
