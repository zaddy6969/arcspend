"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { PanelSkeleton } from "@/components/platform/panel-skeleton";
import { useAppState } from "@/components/providers/app-state-provider";
import { PageHeader } from "@/components/shared/page-header";
import { budgetBuckets, demoTransactions, forecastCards } from "@/data/demo-platform";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  getAvailableMonths,
  getCategoryTotals,
  getFinancialHealthScore,
  getMonthlySnapshot,
  getReportInsight,
  getTrendSeries,
} from "@/lib/metrics";
import type { TrendRange } from "@/types/transactions";

const TrendLineChart = dynamic(
  () => import("@/components/charts/trend-line-chart").then((module) => module.TrendLineChart),
  {
    ssr: false,
    loading: () => <PanelSkeleton className="p-6" lines={5} />,
  },
);

const CategoryBreakdownChart = dynamic(
  () =>
    import("@/components/charts/category-breakdown-chart").then(
      (module) => module.CategoryBreakdownChart,
    ),
  {
    ssr: false,
    loading: () => <PanelSkeleton className="p-6" lines={5} />,
  },
);

const trendRanges: TrendRange[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function AnalyticsPage() {
  const { demoMode, setDemoMode } = useAppState();
  const [activeRange, setActiveRange] = useState<TrendRange>("Monthly");
  const transactions = demoMode ? demoTransactions : [];
  const latestMonth = getAvailableMonths(transactions)[0] ?? "2026-06";
  const snapshot = getMonthlySnapshot(transactions, latestMonth);
  const trendData = getTrendSeries(transactions, activeRange);
  const categoryTotals = getCategoryTotals(snapshot.transactions);
  const healthScore = getFinancialHealthScore(snapshot);
  const savingsScore = Math.max(68, Math.min(96, Math.round(healthScore + 4)));

  if (!demoMode) {
    return (
      <section className="surface-card p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
          <Activity className="h-6 w-6 text-cyan" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-white">Analytics needs activity data</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          ArcSpend never leaves this page empty. Re-enable demo mode and the spending trend,
          category analysis, budget overview, and AI forecast will all come back instantly.
        </p>
        <button className="button-primary mx-auto mt-6" onClick={() => setDemoMode(true)} type="button">
          Restore demo analytics
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          <div className="flex flex-wrap gap-2">
            {trendRanges.map((range) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeRange === range
                    ? "bg-white text-slate-950"
                    : "bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]"
                }`}
                key={range}
                onClick={() => setActiveRange(range)}
                type="button"
              >
                {range}
              </button>
            ))}
          </div>
        }
        badge="Analytics"
        description="Interactive trend intelligence, category analysis, budget control, and AI forecasting across the entire ArcSpend portfolio."
        title="Analytics that feel like a real finance platform"
      />

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="ui-pill">
                <TrendingUp className="h-3.5 w-3.5" />
                Spending trend
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">
                {activeRange} spend versus inflow
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Analyze daily, weekly, monthly, and yearly motion without losing context on
                savings or incoming capital.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
              {snapshot.label}
            </div>
          </div>

          <div className="mt-8 rounded-[30px] border border-white/10 bg-slate-950/[0.45] p-4 sm:p-5">
            <TrendLineChart data={trendData} height={340} />
          </div>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="ui-pill">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI forecast
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-white">Where this month lands</h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-cyan" />
            </div>

            <div className="mt-6 grid gap-3">
              {forecastCards.map((forecast) => (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={forecast.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">{forecast.label}</p>
                    <span className="text-lg font-semibold text-cyan">{forecast.value}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{forecast.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <span className="ui-pill">
              <ShieldCheck className="h-3.5 w-3.5" />
              Financial health score
            </span>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-[-0.04em] text-white">
                  {healthScore}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Confidence stays strong with recurring bills inside plan and fee drag under
                  control.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                Savings score {savingsScore}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">Category analysis</span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Where the portfolio spends</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Food, shopping, crypto, bills, and transport stay separated so the AI can recommend
            action instead of dumping you into a generic ledger.
          </p>
          <div className="mt-6">
            <CategoryBreakdownChart data={categoryTotals.slice(0, 5)} />
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">Budget overview</span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Budget vs actual progress</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            ArcSpend highlights the categories where you are safely under budget and the ones
            worth optimizing before the month closes.
          </p>

          <div className="mt-8 space-y-4">
            {budgetBuckets.map((bucket) => {
              const progress = Math.min((bucket.actual / bucket.budget) * 100, 100);

              return (
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5" key={bucket.category}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{bucket.category}</h3>
                      <p className="mt-1 text-sm text-slate-400">{bucket.recommendation}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(bucket.actual)} / {formatCurrency(bucket.budget)}
                      </p>
                      <p className={`mt-1 text-sm ${bucket.trend <= 0 ? "text-emerald-300" : "text-amber-200"}`}>
                        {formatPercent(bucket.trend)} trend
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-white/[0.08]">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-cyan via-sky-300 to-amber-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-4">
        <article className="surface-card p-5">
          <p className="metric-label">Monthly spend</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(snapshot.expenses)}</p>
          <p className="mt-2 text-sm text-slate-400">Tracked expenses for {snapshot.label}</p>
        </article>
        <article className="surface-card p-5">
          <p className="metric-label">Monthly inflow</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(snapshot.income)}</p>
          <p className="mt-2 text-sm text-slate-400">Incoming capital across wallets</p>
        </article>
        <article className="surface-card p-5">
          <p className="metric-label">Most active category</p>
          <p className="mt-3 text-3xl font-semibold text-white">{snapshot.mostActiveCategory ?? "None"}</p>
          <p className="mt-2 text-sm text-slate-400">Highest activity during the selected month</p>
        </article>
        <article className="surface-card p-5">
          <p className="metric-label">AI note</p>
          <p className="mt-3 text-lg font-semibold text-white">{getReportInsight(snapshot)}</p>
          <p className="mt-2 text-sm text-slate-400">Generated from spending and trend signals</p>
        </article>
      </section>
    </div>
  );
}
