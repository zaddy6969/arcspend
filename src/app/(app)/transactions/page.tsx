"use client";

import { Activity, Clock3, Sparkles, Wallet } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionFeed } from "@/components/transactions/transaction-feed";
import { demoTransactions } from "@/data/demo-platform";
import { formatCurrency } from "@/lib/format";
import {
  getAverageSpend,
  getAvailableMonths,
  getMonthlySnapshot,
  getPendingTransactions,
} from "@/lib/metrics";

export default function TransactionsPage() {
  const { demoMode, setDemoMode } = useAppState();
  const transactions = demoMode ? demoTransactions : [];
  const latestMonth = getAvailableMonths(transactions)[0] ?? "2026-06";
  const snapshot = getMonthlySnapshot(transactions, latestMonth);
  const pendingCount = getPendingTransactions(transactions).length;
  const averageSpend = getAverageSpend(transactions);

  if (!demoMode) {
    return (
      <section className="surface-card p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
          <Activity className="h-6 w-6 text-cyan" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-white">Transaction history is ready</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          The redesigned card-based activity feed, filters, and infinite scrolling are already
          wired up. Re-enable demo mode to populate the feed while live sync is still pending.
        </p>
        <button className="button-primary mx-auto mt-6" onClick={() => setDemoMode(true)} type="button">
          Re-enable demo mode
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        badge="Transactions"
        description="Search, filter, sort, export, and infinitely browse premium transaction cards across wallets, tokens, categories, and networks."
        title="A transaction feed built for actual finance workflows"
      />

      <section className="grid gap-5 lg:grid-cols-4">
        <article className="surface-card p-5">
          <p className="metric-label">Visible history</p>
          <p className="mt-3 text-3xl font-semibold text-white">{transactions.length}</p>
          <p className="mt-2 text-sm text-slate-400">Across the current demo portfolio</p>
        </article>
        <article className="surface-card p-5">
          <p className="metric-label">Pending or processing</p>
          <p className="mt-3 text-3xl font-semibold text-white">{pendingCount}</p>
          <p className="mt-2 text-sm text-slate-400">Bridge and treasury renewals still in flight</p>
        </article>
        <article className="surface-card p-5">
          <p className="metric-label">Average expense</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(averageSpend)}</p>
          <p className="mt-2 text-sm text-slate-400">Average card or on-chain outflow</p>
        </article>
        <article className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="icon-shell">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-label">AI recommendation</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Filter by software and crypto first. That is where the highest-value savings
                opportunities appear in {snapshot.label}.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="icon-shell">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-label">Wallet coverage</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">All strategy wallets</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The feed merges core spending, trading activity, and treasury operations into one
            searchable timeline without collapsing wallet context.
          </p>
        </article>

        <article className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="icon-shell">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-label">Infinite scrolling</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Fast, mobile-friendly activity review</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Cards reveal more rows as you scroll, and the mobile action strip is designed for
            touch-first review without a cramped data table.
          </p>
        </article>
      </section>

      <TransactionFeed transactions={transactions} />
    </div>
  );
}
