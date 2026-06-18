import type {
  ArcTransaction,
  CategoryTotal,
  DailySpendPoint,
  DemoWallet,
  FlowPoint,
  MonthlySnapshot,
  SpendCategory,
  TrendRange,
} from "@/types/transactions";
import {
  formatMonthLabel,
  formatMonthShortLabel,
  formatShortDate,
  formatWeekLabel,
} from "@/lib/format";

const expenseCategories = new Set([
  "Send",
  "Swap",
  "Bridge",
  "Gas/Fee",
  "Card Purchase",
  "Bill Pay",
]);

const budgetMap: Record<SpendCategory, number> = {
  Food: 850,
  Shopping: 1500,
  Crypto: 3200,
  Bills: 3100,
  Transport: 420,
  Travel: 700,
  Software: 1800,
};

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + diff);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date: Date) {
  return date.toISOString().slice(0, 7);
}

function valueForTotals(transaction: ArcTransaction) {
  return transaction.fiatValue;
}

export function isExpenseTransaction(transaction: ArcTransaction) {
  return expenseCategories.has(transaction.category);
}

export function isIncomeTransaction(transaction: ArcTransaction) {
  return transaction.type === "Income";
}

export function sortTransactionsByDate(transactions: ArcTransaction[]) {
  return [...transactions].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
}

export function getAvailableMonths(transactions: ArcTransaction[]) {
  const months = new Set(transactions.map((transaction) => transaction.date.slice(0, 7)));
  return [...months].sort((left, right) => right.localeCompare(left));
}

export function getMonthlyTransactions(transactions: ArcTransaction[], month: string) {
  return sortTransactionsByDate(
    transactions.filter((transaction) => transaction.date.slice(0, 7) === month),
  );
}

export function getIncomeTotal(transactions: ArcTransaction[]) {
  return transactions
    .filter((transaction) => isIncomeTransaction(transaction))
    .reduce((total, transaction) => total + valueForTotals(transaction), 0);
}

export function getExpenseTotal(transactions: ArcTransaction[]) {
  return transactions
    .filter((transaction) => isExpenseTransaction(transaction))
    .reduce((total, transaction) => total + valueForTotals(transaction), 0);
}

export function getTrackedBalance(transactions: ArcTransaction[]) {
  return getIncomeTotal(transactions) - getExpenseTotal(transactions);
}

export function getBiggestExpense(transactions: ArcTransaction[]) {
  const expenses = transactions.filter((transaction) => isExpenseTransaction(transaction));

  if (expenses.length === 0) {
    return null;
  }

  return [...expenses].sort(
    (left, right) => valueForTotals(right) - valueForTotals(left),
  )[0];
}

export function getMostActiveCategory(transactions: ArcTransaction[]) {
  const categoryMap = new Map<SpendCategory, { count: number; total: number }>();

  transactions
    .filter((transaction) => isExpenseTransaction(transaction))
    .forEach((transaction) => {
      const current = categoryMap.get(transaction.spendCategory) ?? {
        count: 0,
        total: 0,
      };

      categoryMap.set(transaction.spendCategory, {
        count: current.count + 1,
        total: current.total + valueForTotals(transaction),
      });
    });

  const [entry] = [...categoryMap.entries()].sort((left, right) => {
    const byCount = right[1].count - left[1].count;
    if (byCount !== 0) {
      return byCount;
    }

    return right[1].total - left[1].total;
  });

  return entry?.[0] ?? null;
}

export function getCategoryTotals(transactions: ArcTransaction[]): CategoryTotal[] {
  const totals = new Map<SpendCategory, { total: number; count: number }>();

  transactions
    .filter((transaction) => isExpenseTransaction(transaction))
    .forEach((transaction) => {
      const current = totals.get(transaction.spendCategory) ?? { total: 0, count: 0 };

      totals.set(transaction.spendCategory, {
        total: current.total + valueForTotals(transaction),
        count: current.count + 1,
      });
    });

  const overallTotal = [...totals.values()].reduce((sum, item) => sum + item.total, 0);

  return [...totals.entries()]
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      share: overallTotal === 0 ? 0 : data.total / overallTotal,
      budget: budgetMap[category],
    }))
    .sort((left, right) => right.total - left.total);
}

export function getRecentTransactions(transactions: ArcTransaction[], limit = 6) {
  return sortTransactionsByDate(transactions).slice(0, limit);
}

export function getFlowSeries(transactions: ArcTransaction[]): FlowPoint[] {
  const grouped = new Map<string, FlowPoint>();

  sortTransactionsByDate(transactions)
    .reverse()
    .forEach((transaction) => {
      const key = transaction.date.slice(0, 10);
      const current = grouped.get(key) ?? {
        label: formatShortDate(transaction.date),
        spent: 0,
        received: 0,
        savings: 0,
      };

      if (isIncomeTransaction(transaction)) {
        current.received += valueForTotals(transaction);
      }

      if (isExpenseTransaction(transaction)) {
        current.spent += valueForTotals(transaction);
      }

      current.savings = Math.max(current.received - current.spent, 0);
      grouped.set(key, current);
    });

  return [...grouped.values()];
}

export function getDailySpendSeries(transactions: ArcTransaction[]): DailySpendPoint[] {
  return getFlowSeries(transactions).map((point) => ({
    label: point.label,
    spent: point.spent,
  }));
}

export function getMonthlyChange(
  transactions: ArcTransaction[],
  month: string,
) {
  const availableMonths = getAvailableMonths(transactions);
  const currentIndex = availableMonths.indexOf(month);

  if (currentIndex === -1 || currentIndex === availableMonths.length - 1) {
    return 0;
  }

  const current = getExpenseTotal(getMonthlyTransactions(transactions, month));
  const previous = getExpenseTotal(
    getMonthlyTransactions(transactions, availableMonths[currentIndex + 1]),
  );

  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function getMonthlySnapshot(
  transactions: ArcTransaction[],
  month: string,
): MonthlySnapshot {
  const monthlyTransactions = getMonthlyTransactions(transactions, month);
  const income = getIncomeTotal(monthlyTransactions);
  const expenses = getExpenseTotal(monthlyTransactions);
  const feeTotal = monthlyTransactions.reduce((sum, transaction) => sum + transaction.fee, 0);
  const transactionCount = monthlyTransactions.length;

  return {
    month,
    label: formatMonthLabel(month),
    transactions: monthlyTransactions,
    income,
    expenses,
    netFlow: income - expenses,
    transactionCount,
    mostActiveCategory: getMostActiveCategory(monthlyTransactions),
    biggestExpense: getBiggestExpense(monthlyTransactions),
    savingsEstimate: Math.max(income - expenses, 0),
    monthlyChange: getMonthlyChange(transactions, month),
    feeTotal,
    averageTransaction:
      transactionCount === 0 ? 0 : expenses / Math.max(transactionCount, 1),
  };
}

export function getReportInsight(snapshot: MonthlySnapshot) {
  if (snapshot.transactions.length === 0) {
    return "No transactions are available for the selected month yet, so ArcSpend cannot generate a full narrative summary.";
  }

  const insights: string[] = [];

  if (snapshot.monthlyChange > 0) {
    insights.push("Monthly spend is trending up compared with the previous period.");
  } else if (snapshot.monthlyChange < 0) {
    insights.push("Monthly spend cooled down versus the previous period.");
  } else {
    insights.push("Monthly spend is pacing evenly against the previous period.");
  }

  if (snapshot.mostActiveCategory) {
    insights.push(`Most activity came from ${snapshot.mostActiveCategory}.`);
  }

  if (snapshot.feeTotal > 0) {
    insights.push("Fee drag remains manageable and below the unhealthy threshold.");
  }

  return insights.join(" ");
}

export function getFinancialHealthScore(snapshot: MonthlySnapshot) {
  if (snapshot.transactionCount === 0) {
    return 60;
  }

  const savingsRatio = snapshot.income === 0 ? 0 : snapshot.savingsEstimate / snapshot.income;
  const feePenalty = Math.min(snapshot.feeTotal / 25, 12);
  const changePenalty = snapshot.monthlyChange > 10 ? Math.min(snapshot.monthlyChange, 12) : 0;

  return Math.max(
    52,
    Math.min(96, Math.round(78 + savingsRatio * 20 - feePenalty - changePenalty)),
  );
}

export function getPortfolioBalance(wallets: DemoWallet[]) {
  return wallets.reduce((total, wallet) => total + wallet.totalBalance, 0);
}

export function getPortfolioChange(wallets: DemoWallet[]) {
  if (wallets.length === 0) {
    return 0;
  }

  return (
    wallets.reduce((total, wallet) => total + wallet.monthlyChange, 0) / wallets.length
  );
}

export function getTransactionsForWallet(
  transactions: ArcTransaction[],
  walletId: string,
) {
  return sortTransactionsByDate(
    transactions.filter((transaction) => transaction.walletId === walletId),
  );
}

export function getSpendingForWallet(
  transactions: ArcTransaction[],
  walletId: string,
) {
  return getExpenseTotal(getTransactionsForWallet(transactions, walletId));
}

export function getTrendSeries(
  transactions: ArcTransaction[],
  range: TrendRange,
) {
  const sorted = sortTransactionsByDate(transactions).reverse();
  const grouped = new Map<string, FlowPoint>();

  sorted.forEach((transaction) => {
    const date = new Date(transaction.date);
    let key = dateKey(date);
    let label = formatShortDate(transaction.date);

    if (range === "Weekly") {
      const weekStart = startOfWeek(date);
      key = dateKey(weekStart);
      label = formatWeekLabel(weekStart.toISOString());
    }

    if (range === "Monthly" || range === "Yearly") {
      key = monthKey(date);
      label = range === "Monthly"
        ? formatMonthShortLabel(transaction.date)
        : formatMonthLabel(key);
    }

    const current = grouped.get(key) ?? {
      label,
      spent: 0,
      received: 0,
      savings: 0,
    };

    if (isIncomeTransaction(transaction)) {
      current.received += valueForTotals(transaction);
    }

    if (isExpenseTransaction(transaction)) {
      current.spent += valueForTotals(transaction);
    }

    current.savings = Math.max(current.received - current.spent, 0);
    grouped.set(key, current);
  });

  const values = [...grouped.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map((entry) => entry[1]);

  if (range === "Daily") {
    return values.slice(-7);
  }

  if (range === "Weekly") {
    return values.slice(-8);
  }

  if (range === "Monthly") {
    return values.slice(-6);
  }

  return values.slice(-12);
}

export function getPendingTransactions(transactions: ArcTransaction[]) {
  return transactions.filter((transaction) => transaction.status !== "Confirmed");
}

export function getAverageSpend(transactions: ArcTransaction[]) {
  const expenses = transactions.filter((transaction) => isExpenseTransaction(transaction));

  if (expenses.length === 0) {
    return 0;
  }

  return expenses.reduce((sum, transaction) => sum + valueForTotals(transaction), 0) / expenses.length;
}
