// Datastruktur & TypeScript-typer för den lokala (mockade) Firestore-lagret

export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string; // ISO 8601
  category: string;
  label: string;
  source: "manual" | "import" | "subscription";
  notes?: string;
  createdAt?: number;
}

export interface Subscription {
  id?: string;
  name: string;
  amountMonthly: number;
  currency: string;
  billingDay: number;
  category: string;
  isActive: boolean;
  nextBillingDate?: string;
  createdAt?: number;
}

export interface UserSettings {
  baseCurrency: string;
  monthlyIncome: number;
  maxMonthlySpending: number;
  language: "sv" | "en";
  darkMode: boolean;
  onboardingCompleted: boolean;
}

export interface HistoricalMonth {
  month: string; // "YYYY-MM"
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface BudgetForecastPoint {
  month: string; // "YYYY-MM"
  mean: number;
  lower: number;
  upper: number;
}

export interface BudgetForecastResult {
  forecast: BudgetForecastPoint[];
  metadata: {
    generatedAt: string;
    method: "probabilistic-kernel";
    version: string;
  };
}
