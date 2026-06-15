"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ArrowDownCircle,
  Landmark,
  ReceiptText,
  Scale,
  TrendingDown,
  Wallet,
} from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { useAppState } from "@/components/providers/app-state-provider";
import { ReceiptModal } from "@/components/receipts/receipt-modal";
import { EmptyDataState } from "@/components/shared/empty-data-state";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { demoTransactions } from "@/data/demo-transactions";
import { formatCurrency, formatFullDate } from "@/lib/format";
import {
  getAvailableMonths,
  getCategoryTotals,
  getFlowSeries,
  getMonthlySnapshot,
  getRecentTransactions,
  getTrackedBalance,
} from "@/lib/metrics";
import type { ArcTransaction } from "@/types/transactions";

const SpendingAreaChart = dynamic(
  () =>
    import("@/components/charts/spending-area-chart").then((module) => module.SpendingAreaChart),
  {
    ssr: false,
    loading: () => <div className="h-[320px] rounded-[28px] border border-white/10 bg-slate-950/30" />,
  },
);

const CategoryBreakdownChart = dynamic(
  () =>
    import("@/components/charts/category-breakdown-chart").then(
      (module) => module.CategoryBreakdownChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[320px] rounded-[28px] border border-white/10 bg-slate-950/30" />,
  },
);

export default function DashboardPage() {
  const { demoMode, isWalletConnected, setDemoMode } = useAppState();
  const [selectedTransaction, setSelectedTransaction] = useState<ArcTransaction | null>(null);

  const transactions = demoMode ? demoTransactions : [];
  const activeMonth = getAvailableMonths(transactions)[0] ?? "2026-06";
  const snapshot = getMonthlySnapshot(transactions, activeMonth);
  const balance = getTrackedBalance(transactions);
  const recentTransactions = getRecentTransactions(transactions, 6);
  const chartData = getFlowSeries(snapshot.transactions);
  const categoryTotals = getCategoryTotals(snapshot.transactions);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Dashboard"
        description="Track balance, spending, income, category mix, and the latest wallet motion from one premium ArcSpend overview."
        title="Arc wallet flow at a glance"
      />

      {!demoMode ? (
        <EmptyDataState
          actionLabel="Re-enable Demo Mode"
          description="Live Arc transaction sync has not been plugged in yet, so the dashboard is currently empty outside Demo Mode."
          onAction={() => setDemoMode(true)}
          title="Live dashboard sync coming soon"
        />
      ) : null}

      <section className="shell-grid xl:grid-cols-3">
        <SummaryCard
          icon={Wallet}
          label="Total Balance"
          note="Tracked stablecoin balance across the current dataset."
          value={formatCurrency(balance)}
        />
        <SummaryCard
          icon={TrendingDown}
          label="Monthly Spending"
          note={`Expense activity recorded in ${snapshot.label}.`}
          value={formatCurrency(snapshot.expenses)}
        />
        <SummaryCard
          icon={ArrowDownCircle}
          label="Monthly Income"
          note={`Receive activity recorded in ${snapshot.label}.`}
          value={formatCurrency(snapshot.income)}
        />
        <SummaryCard
          icon={Scale}
          label="Net Flow"
          note="Income minus tracked expenses for the selected month."
          value={formatCurrency(snapshot.netFlow)}
        />
        <SummaryCard
          icon={Landmark}
          label="Biggest Expense"
          note={
            snapshot.biggestExpense
              ? `${snapshot.biggestExpense.category} on ${formatFullDate(snapshot.biggestExpense.date)}`
              : "No expense transaction recorded."
          }
          value={
            snapshot.biggestExpense
              ? formatCurrency(snapshot.biggestExpense.amount)
              : formatCurrency(0)
          }
        />
        <SummaryCard
          icon={ReceiptText}
          label="Transaction Count"
          note={isWalletConnected ? "Wallet connected, demo activity still active." : "Using Demo Data right now."}
          value={String(snapshot.transactionCount)}
        />
      </section>

      <section className="shell-grid xl:grid-cols-[1.2fr_0.8fr]">
        <div className="shell-card p-6">
          <div className="mb-5">
            <p className="metric-label">Spending Chart</p>
            <h2 className="mt-2 text-2xl">Daily spent vs received</h2>
          </div>
          <SpendingAreaChart data={chartData} />
        </div>
        <div className="shell-card p-6">
          <div className="mb-5">
            <p className="metric-label">Category Breakdown</p>
            <h2 className="mt-2 text-2xl">How activity is distributed</h2>
          </div>
          <CategoryBreakdownChart data={categoryTotals} />
        </div>
      </section>

      <TransactionsTable
        limit={6}
        onOpenReceipt={(transaction) => setSelectedTransaction(transaction)}
        transactions={recentTransactions}
      />

      <ReceiptModal onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} />
    </div>
  );
}
