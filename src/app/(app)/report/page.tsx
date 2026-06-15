"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CalendarRange, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { useAppState } from "@/components/providers/app-state-provider";
import { EmptyDataState } from "@/components/shared/empty-data-state";
import { PageHeader } from "@/components/shared/page-header";
import { demoTransactions } from "@/data/demo-transactions";
import { formatCurrency } from "@/lib/format";
import {
  getAvailableMonths,
  getCategoryTotals,
  getDailySpendSeries,
  getMonthlySnapshot,
  getReportInsight,
} from "@/lib/metrics";

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

const DailySpendingChart = dynamic(
  () =>
    import("@/components/charts/daily-spending-chart").then(
      (module) => module.DailySpendingChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[320px] rounded-[28px] border border-white/10 bg-slate-950/30" />,
  },
);

export default function ReportPage() {
  const { demoMode, setDemoMode } = useAppState();
  const transactions = demoMode ? demoTransactions : [];
  const availableMonths = getAvailableMonths(transactions);

  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const activeMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : availableMonths[0] ?? "2026-06";

  const snapshot = getMonthlySnapshot(transactions, activeMonth);
  const categoryTotals = getCategoryTotals(snapshot.transactions);
  const dailySpending = getDailySpendSeries(snapshot.transactions);
  const insight = getReportInsight(snapshot);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            {snapshot.label}
          </div>
        }
        badge="Monthly Report"
        description="Review month-by-month expense totals, inflows, daily spend, category mix, and plain-language rules-based insight."
        title="Monthly Arc spending report"
      />

      {!demoMode ? (
        <EmptyDataState
          actionLabel="Re-enable Demo Mode"
          description="Monthly reporting is ready, but it needs either Demo Data or a future live Arc transaction feed to populate."
          onAction={() => setDemoMode(true)}
          title="No monthly report data available"
        />
      ) : null}

      <section className="shell-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="metric-label">Month Selector</p>
            <h2 className="mt-2 text-2xl">Choose the reporting month</h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3">
            <CalendarRange className="h-4 w-4 text-cyan" />
            <select
              className="bg-transparent text-sm text-white"
              onChange={(event) => setSelectedMonth(event.target.value)}
              value={activeMonth}
            >
              {availableMonths.length > 0 ? (
                availableMonths.map((month) => (
                  <option className="bg-slate-950" key={month} value={month}>
                    {getMonthlySnapshot(transactions, month).label}
                  </option>
                ))
              ) : (
                <option className="bg-slate-950" value={selectedMonth}>
                  No live months yet
                </option>
              )}
            </select>
          </div>
        </div>
      </section>

      <section className="shell-grid xl:grid-cols-5">
        <SummaryCard
          icon={TrendingDown}
          label="Total Spent"
          note="Send, swap, bridge, and fee activity."
          value={formatCurrency(snapshot.expenses)}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total Received"
          note="Receive transactions counted as inflow."
          value={formatCurrency(snapshot.income)}
        />
        <SummaryCard
          icon={Sparkles}
          label="Net Flow"
          note="Monthly inflow minus monthly spend."
          value={formatCurrency(snapshot.netFlow)}
        />
        <SummaryCard
          icon={CalendarRange}
          label="Most Active"
          note="Based on the highest category activity count."
          value={snapshot.mostActiveCategory ?? "None"}
        />
        <SummaryCard
          icon={Sparkles}
          label="Transactions"
          note="Number of recorded transactions in the selected month."
          value={String(snapshot.transactionCount)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="shell-card p-6">
          <p className="metric-label">Daily Spending</p>
          <h2 className="mt-2 text-2xl">Spend pattern across the month</h2>
          <div className="mt-6">
            <DailySpendingChart data={dailySpending} />
          </div>
        </div>
        <div className="shell-card p-6">
          <p className="metric-label">Category Summary</p>
          <h2 className="mt-2 text-2xl">Where the month concentrated</h2>
          <div className="mt-6">
            <CategoryBreakdownChart data={categoryTotals} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="shell-card p-6">
          <p className="metric-label">Insight</p>
          <h2 className="mt-2 text-2xl">Plain-language report note</h2>
          <p className="mt-5 text-lg leading-8 text-white">{insight}</p>
        </article>
        <article className="shell-card p-6">
          <p className="metric-label">Category Summary</p>
          <div className="mt-5 space-y-4">
            {categoryTotals.length > 0 ? (
              categoryTotals.map((item) => (
                <div
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                  key={item.category}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg text-white">{item.category}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.count} transactions
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-400">
                Category totals will populate when a selected month has transaction data.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
