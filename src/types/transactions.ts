export const transactionCategories = [
  "Send",
  "Receive",
  "Swap",
  "Bridge",
  "Gas/Fee",
  "Unknown",
] as const;

export const transactionFilters = [
  "All",
  "Income",
  "Expense",
  "Send",
  "Receive",
  "Swap",
  "Bridge",
  "Fee",
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
export type TransactionFilter = (typeof transactionFilters)[number];
export type TransactionType = "Income" | "Expense";
export type TransactionStatus = "Confirmed" | "Pending" | "Failed";

export interface ArcTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  token: "USDC" | "EURC";
  from: string;
  to: string;
  txHash: string;
  status: TransactionStatus;
  network: "Arc Testnet";
}

export interface CategoryTotal {
  category: TransactionCategory;
  total: number;
  count: number;
  share: number;
}

export interface FlowPoint {
  label: string;
  spent: number;
  received: number;
}

export interface DailySpendPoint {
  label: string;
  spent: number;
}

export interface MonthlySnapshot {
  month: string;
  label: string;
  transactions: ArcTransaction[];
  income: number;
  expenses: number;
  netFlow: number;
  transactionCount: number;
  mostActiveCategory: TransactionCategory | null;
  biggestExpense: ArcTransaction | null;
}

