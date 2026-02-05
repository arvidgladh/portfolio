"use client";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { createTransaction } from "../lib/firestoreService";
import { TransactionType } from "../lib/firestoreSchema";
import { useBudgetData } from "../context/BudgetDataContext";
import { useToast } from "./ToastProvider";

export function TransactionForm() {
  const { userId } = useAppContext();
  const { userSettings } = useBudgetData();
  const { showToast } = useToast();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [source, setSource] = useState<"manual" | "import" | "subscription">(
    "manual"
  );
  const [notes, setNotes] = useState<string>("");

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

    const numericAmount = Number(amount.replace(",", "."));
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      const msg = "Belopp måste vara ett positivt tal.";
      setError(msg);
      return;
    }

    if (!date) {
      const msg = "Datum måste anges.";
      setError(msg);
      return;
    }

    if (!category.trim()) {
      const msg = "Kategori måste anges.";
      setError(msg);
      return;
    }

    if (!label.trim()) {
      const msg = "Titel/beskrivning måste anges.";
      setError(msg);
      return;
    }

    try {
      setIsSubmitting(true);

      await createTransaction(userId, {
        type,
        amount: numericAmount,
        currency: defaultCurrency,
        date,
        category: category.trim(),
        label: label.trim(),
        source,
        notes: notes.trim() || undefined,
      });

      showToast("Transaktionen har sparats.", "success");

      setAmount("");
      setDate("");
      setCategory("");
      setLabel("");
      setNotes("");
      setType("expense");
      setSource("manual");
    } catch (err: any) {
      console.error("createTransaction error:", err);
      const msg = err?.message ?? "Kunde inte spara transaktionen.";
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
      <h2 className="text-sm font-semibold mb-1">Lägg till transaktion</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Typ</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
          >
            <option value="expense">Utgift</option>
            <option value="income">Inkomst</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">
            Belopp ({defaultCurrency})
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="t.ex. 149.00"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Datum</label>
          <input
            type="date"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Kategori</label>
          <input
            type="text"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Mat, Hyra, Transport..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Titel / beskrivning</label>
        <input
          type="text"
          className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="t.ex. ICA Maxi, Spotify Premium..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Källa</label>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as "manual" | "import" | "subscription")
            }
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
          >
            <option value="manual">Manuell</option>
            <option value="import">Import</option>
            <option value="subscription">Abonnemang</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Anteckning (valfritt)</label>
          <input
            type="text"
            className="w-full border border-slate-700 rounded px-2 py-1 text-sm bg-slate-950/60"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kort notering..."
          />
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
        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-500 transition-colors"
      >
        {isSubmitting ? "Sparar..." : "Spara transaktion"}
      </button>
    </form>
  );
}
