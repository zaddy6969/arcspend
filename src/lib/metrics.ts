import type {
  ArcTransaction,
  CategoryTotal,
  DailySpendPoint,
  FlowPoint,
  MonthlySnapshot,
  TransactionCategory,
} from "@/types/transactions";
import { formatMonthLabel, formatShortDate } from "@/lib/format";

const expenseCategories = new Set<TransactionCategory>(["Send", "Swap", "Bridge", "Gas/Fee"]);

export function isExpenseTransaction(transaction: ArcTransaction) {
  return expenseCategories.has(transaction.category);
}

export function isIncomeTransaction(transaction: ArcTransaction) {
  return transaction.category === "Receive";
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
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getExpenseTotal(transactions: ArcTransaction[]) {
  return transactions
    .filter((transaction) => isExpenseTransaction(transaction))
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getTrackedBalance(transactions: ArcTransaction[]) {
  return getIncomeTotal(transactions) - getExpenseTotal(transactions);
}

export function getBiggestExpense(transactions: ArcTransaction[]) {
  const expenses = transactions.filter((transaction) => isExpenseTransaction(transaction));

  if (expenses.length === 0) {
    return null;
  }

  return [...expenses].sort((left, right) => right.amount - left.amount)[0];
}

export function getMostActiveCategory(transactions: ArcTransaction[]) {
  const categoryMap = new Map<TransactionCategory, { count: number; total: number }>();

  transactions.forEach((transaction) => {
    const current = categoryMap.get(transaction.category) ?? { count: 0, total: 0 };
    categoryMap.set(transaction.category, {
      count: current.count + 1,
      total: current.total + transaction.amount,
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
  const totals = new Map<TransactionCategory, { total: number; count: number }>();

  transactions.forEach((transaction) => {
    const current = totals.get(transaction.category) ?? { total: 0, count: 0 };
    totals.set(transaction.category, {
      total: current.total + transaction.amount,
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
      };

      if (isIncomeTransaction(transaction)) {
        current.received += transaction.amount;
      }

      if (isExpenseTransaction(transaction)) {
        current.spent += transaction.amount;
      }

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

export function getMonthlySnapshot(
  transactions: ArcTransaction[],
  month: string,
): MonthlySnapshot {
  const monthlyTransactions = getMonthlyTransactions(transactions, month);
  const income = getIncomeTotal(monthlyTransactions);
  const expenses = getExpenseTotal(monthlyTransactions);

  return {
    month,
    label: formatMonthLabel(month),
    transactions: monthlyTransactions,
    income,
    expenses,
    netFlow: income - expenses,
    transactionCount: monthlyTransactions.length,
    mostActiveCategory: getMostActiveCategory(monthlyTransactions),
    biggestExpense: getBiggestExpense(monthlyTransactions),
  };
}

export function getReportInsight(snapshot: MonthlySnapshot) {
  if (snapshot.transactions.length === 0) {
    return "No live Arc transactions are available for this month yet. Re-enable Demo Mode to preview the full report experience.";
  }

  const insights: string[] = [];

  if (snapshot.expenses > snapshot.income) {
    insights.push("You spent more than you received this month.");
  } else if (snapshot.income > snapshot.expenses) {
    insights.push("You received more than you spent this month.");
  } else {
    insights.push("Your spending and income were balanced this month.");
  }

  if (snapshot.mostActiveCategory) {
    insights.push(`Your highest activity category was ${snapshot.mostActiveCategory}.`);
  }

  const inflowCount = snapshot.transactions.filter((transaction) =>
    isIncomeTransaction(transaction),
  ).length;

  if (inflowCount > 0) {
    insights.push("Most of your inflow came from Receive transactions.");
  }

  return insights.join(" ");
}

