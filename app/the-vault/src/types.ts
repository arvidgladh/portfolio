// FILE: app/the-vault/src/types.ts

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  kind: "income" | "expense" | "subscription";
  createdAt: string;
};

export type Subscription = {
  id: string;
  name: string;
  amountMonthly: number;
  billingDay: number;
  active: boolean;
};

export type ForecastPoint = {
  id: string;
  label: string;
  baseline: number;
  bestCase: number;
  worstCase: number;
};

export type SummaryStatus = "surplus" | "deficit" | "balanced";

export type SummaryStats = {
  averagePerMonth: number;
  bestMonthValue: number;
  worstMonthValue: number;
  status: SummaryStatus;
};
