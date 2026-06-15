import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { aiInsights, demoTransactions, demoWallets } from "@/data/demo-platform";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  getAvailableMonths,
  getMonthlySnapshot,
  getPortfolioBalance,
  getPortfolioChange,
  getRecentTransactions,
} from "@/lib/metrics";

export default function LandingPage() {
  const latestMonth = getAvailableMonths(demoTransactions)[0] ?? "2026-06";
  const snapshot = getMonthlySnapshot(demoTransactions, latestMonth);
  const portfolioBalance = getPortfolioBalance(demoWallets);
  const portfolioChange = getPortfolioChange(demoWallets);
  const recentTransactions = getRecentTransactions(demoTransactions, 3);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1560px] flex-col gap-8 px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <header className="surface-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-sky-300 to-amber-300 text-slate-950 shadow-[0_24px_60px_rgba(103,232,249,0.25)]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl text-white">ArcSpend</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                Track. Analyze. Optimize. Powered by AI.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-secondary" href="/wallets">
              Wallets
            </Link>
            <Link className="button-primary" href="/dashboard">
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <ShieldCheck className="h-3.5 w-3.5" />
            Premium crypto expense intelligence
          </span>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            A funded-startup feel for AI-powered crypto expense management.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            ArcSpend turns wallet activity into a polished portfolio command center with AI
            insights, premium analytics, multi-wallet management, transfer guardrails, and
            transaction intelligence that feels investor-demo ready.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href="/dashboard">
              Launch ArcSpend
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="button-secondary" href="/analytics">
              Explore analytics
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Portfolio balance</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(portfolioBalance)}</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Monthly change</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatPercent(portfolioChange)}</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Tracked spend</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(snapshot.expenses)}</p>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="ui-pill">
                <Sparkles className="h-3.5 w-3.5" />
                Live product preview
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-white">What the AI sees</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-cyan" />
          </div>
          <div className="mt-6 grid gap-3">
            {aiInsights.slice(0, 3).map((insight) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={insight.title}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{insight.title}</p>
                  <span className="text-sm font-semibold text-cyan">{insight.metric}</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{insight.message}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <Wallet className="h-3.5 w-3.5" />
            Product pillars
          </span>
          <div className="mt-6 grid gap-4">
            {[
              "Premium dashboard with AI insights, health score, and quick actions.",
              "Interactive analytics across daily, weekly, monthly, and yearly patterns.",
              "Multi-wallet portfolio management for spending, trading, and treasury flows.",
              "Professional send, receive, swap, and bridge experiences with previews.",
            ].map((item) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300" key={item}>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">Recent portfolio motion</span>
          <div className="mt-6 space-y-3">
            {recentTransactions.map((transaction) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={transaction.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{transaction.merchant}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {transaction.walletLabel} / {transaction.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(transaction.fiatValue)}</p>
                    <p className="mt-1 text-sm text-slate-500">{transaction.network}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
