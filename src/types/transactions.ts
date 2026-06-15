export const assetSymbols = ["USDC", "EURC", "ETH", "BTC", "ARC"] as const;

export const spendCategories = [
  "Food",
  "Shopping",
  "Crypto",
  "Bills",
  "Transport",
  "Travel",
  "Software",
] as const;

export const transactionCategories = [
  "Send",
  "Receive",
  "Swap",
  "Bridge",
  "Gas/Fee",
  "Card Purchase",
  "Bill Pay",
  "Top Up",
] as const;

export const transactionFilters = [
  "All",
  "Income",
  "Expense",
  "Fee",
  "Send",
  "Receive",
  "Swap",
  "Bridge",
  "Food",
  "Shopping",
  "Crypto",
  "Bills",
  "Transport",
] as const;

export const transactionSortOptions = [
  "Newest",
  "Oldest",
  "Highest",
  "Lowest",
] as const;

export type AssetSymbol = (typeof assetSymbols)[number];
export type SpendCategory = (typeof spendCategories)[number];
export type TransactionCategory = (typeof transactionCategories)[number];
export type TransactionFilter = (typeof transactionFilters)[number];
export type TransactionSortOption = (typeof transactionSortOptions)[number];
export type TransactionType = "Income" | "Expense";
export type TransactionStatus = "Confirmed" | "Pending" | "Failed" | "Processing";
export type TrendRange = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface WalletAsset {
  symbol: AssetSymbol;
  name: string;
  balance: number;
  fiatValue: number;
  allocation: number;
  change: number;
  accent: string;
}

export interface DemoWallet {
  id: string;
  label: string;
  role: string;
  address: string;
  network: string;
  totalBalance: number;
  monthlyChange: number;
  spendingThisMonth: number;
  savingsEstimate: number;
  performance: number;
  healthScore: number;
  assets: WalletAsset[];
}

export interface ArcTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  spendCategory: SpendCategory;
  amount: number;
  fiatValue: number;
  token: AssetSymbol;
  from: string;
  to: string;
  txHash: string;
  status: TransactionStatus;
  network: string;
  walletId: string;
  walletLabel: string;
  merchant: string;
  counterparty: string;
  note: string;
  fee: number;
  method: string;
  tags: string[];
  chain: string;
}

export interface CategoryTotal {
  category: SpendCategory;
  total: number;
  count: number;
  share: number;
  budget: number;
}

export interface FlowPoint {
  label: string;
  spent: number;
  received: number;
  savings: number;
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
  mostActiveCategory: SpendCategory | null;
  biggestExpense: ArcTransaction | null;
  savingsEstimate: number;
  monthlyChange: number;
  feeTotal: number;
  averageTransaction: number;
}

export interface BudgetBucket {
  category: SpendCategory;
  budget: number;
  actual: number;
  trend: number;
  recommendation: string;
}

export interface InsightItem {
  title: string;
  message: string;
  metric: string;
  tone: "positive" | "warning" | "neutral";
}

export interface ForecastCard {
  label: string;
  value: string;
  note: string;
  trend: "up" | "down" | "neutral";
}

export interface BridgeStage {
  label: string;
  detail: string;
  state: "complete" | "current" | "upcoming";
}
