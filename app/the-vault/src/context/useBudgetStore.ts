// useBudgetStore.ts
import { create } from "zustand";
import { buildForecast, buildSummary } from "../lib/forecast-logic";
import type {
  Transaction,
  Subscription,
  ForecastPoint,
  SummaryStats,
} from "../types";

interface BudgetState {
  // 1. Basdata (Input)
  basePerMonth: number;
  transactions: Transaction[];
  subscriptions: Subscription[];
  // 2. Beräknad Data (Output)
  forecast: ForecastPoint[];
  summary: SummaryStats | null;

  // 3. Åtgärder
  setBasePerMonth: (base: number) => void;
  addTransaction: (tx: Transaction) => void;
  addSubscription: (sub: Subscription) => void;
  
  // 4. Funktionalitet
  recalculateForecast: () => void; // Utför beräkningarna
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  basePerMonth: 28000,
  transactions: [],
  subscriptions: [],
  forecast: [],
  summary: null,

  setBasePerMonth: (base: number) => set({ basePerMonth: Math.max(0, base) }),

  addTransaction: (tx: Transaction) =>
    set((state) => ({
      transactions: [...state.transactions, tx],
    })),

  addSubscription: (sub: Subscription) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, sub],
    })),

  recalculateForecast: () => {
    const { basePerMonth, transactions, subscriptions } = get();
    // ANROPAR VÅR LOGIK:
    const newForecast = buildForecast(basePerMonth, transactions, subscriptions); 
    const newSummary = buildSummary(newForecast);

    set({
      forecast: newForecast,
      summary: newSummary,
    });
  },
}));
