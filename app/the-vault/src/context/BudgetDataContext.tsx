// src/context/BudgetDataContext.tsx
// Hämtar transaktioner, abonnemang & userSettings från Firestore
// + bygger historik per månad till Budgetvågen

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useAppContext } from "./AppContext";
import {
  Transaction,
  Subscription,
  UserSettings,
  HistoricalMonth,
} from "../lib/firestoreSchema";
import {
  listenToTransactions,
  listenToSubscriptions,
  listenToUserSettings,
} from "../lib/firestoreService";

interface BudgetDataContextValue {
  transactions: Transaction[];
  subscriptions: Subscription[];
  historicalData: HistoricalMonth[];
  userSettings: UserSettings | null;
  isDataLoading: boolean;
  dataError: string | null;
}

const BudgetDataContext = createContext<BudgetDataContextValue | undefined>(
  undefined
);

export function BudgetDataProvider({ children }: { children: ReactNode }) {
  const { userId, isAuthReady } = useAppContext();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const [hasLoadedTx, setHasLoadedTx] = useState(false);
  const [hasLoadedSubs, setHasLoadedSubs] = useState(false);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;

    // Ingen user = inget att lyssna på
    if (!userId) {
      setTransactions([]);
      setSubscriptions([]);
      setUserSettings(null);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    setDataError(null);
    setHasLoadedTx(false);
    setHasLoadedSubs(false);
    setHasLoadedSettings(false);

    // --- Transaktioner -----------------------------------------------------
    const unsubTx = listenToTransactions(
      userId,
      (items: Transaction[]) => {
        setTransactions(items);
        setHasLoadedTx(true);
      }
    );

    // --- Abonnemang -------------------------------------------------------
    const unsubSubs = listenToSubscriptions(
      userId,
      (items: Subscription[]) => {
        setSubscriptions(items);
        setHasLoadedSubs(true);
      }
    );

    // --- User settings ----------------------------------------------------
    const unsubSettings = listenToUserSettings(
      userId,
      (settings: UserSettings | null) => {
        setUserSettings(settings);
        setHasLoadedSettings(true);
      }
    );

    return () => {
      unsubTx();
      unsubSubs();
      unsubSettings();
    };
  }, [userId, isAuthReady]);

  // När vi fått första snapshot från alla tre → dataladdning klar
  useEffect(() => {
    if (hasLoadedTx && hasLoadedSubs && hasLoadedSettings) {
      setIsDataLoading(false);
    }
  }, [hasLoadedTx, hasLoadedSubs, hasLoadedSettings]);

  // --- Bygg historik per månad från transaktioner -------------------------

  const historicalData: HistoricalMonth[] = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const map = new Map<
      string,
      { income: number; expense: number }
    >();

    for (const tx of transactions) {
      if (!tx.date) continue;
      const month = tx.date.slice(0, 7); // "YYYY-MM"

      const bucket =
        map.get(month) ?? { income: 0, expense: 0 };

      if (tx.type === "income") {
        bucket.income += tx.amount;
      } else {
        bucket.expense += tx.amount;
      }

      map.set(month, bucket);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, bucket]) => ({
        month,
        totalIncome: bucket.income,
        totalExpense: bucket.expense,
        net: bucket.income - bucket.expense,
      }));
  }, [transactions]);

  const value: BudgetDataContextValue = {
    transactions,
    subscriptions,
    historicalData,
    userSettings,
    isDataLoading,
    dataError,
  };

  return (
    <BudgetDataContext.Provider value={value}>
      {children}
    </BudgetDataContext.Provider>
  );
}

export function useBudgetData(): BudgetDataContextValue {
  const ctx = useContext(BudgetDataContext);
  if (!ctx) {
    throw new Error(
      "useBudgetData must be used within a BudgetDataProvider"
    );
  }
  return ctx;
}
