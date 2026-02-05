// app/cases/paus-budgetvag/types.ts

export type TransactionKind = "income" | "expense" | "subscription";

export type Transaction = {
  id: string;
  label: string;
  amount: number; // alltid positivt, tolkas via kind
  kind: TransactionKind;
  createdAt: string; // ISO
};

export type ForecastPoint = {
  monthIndex: number;
  monthLabel: string;
  value: number;
};

export type SummaryStatus = "surplus" | "deficit" | "balanced";

export type SummaryStats = {
  average: number;
  best: number;
  worst: number;
  status: SummaryStatus;
};
