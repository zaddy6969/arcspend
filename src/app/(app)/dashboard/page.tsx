"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  PlusCircle,
  QrCode,
  RefreshCcw,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AnimatedValue } from "@/components/platform/animated-value";
import { HealthRing } from "@/components/platform/health-ring";
import { PanelSkeleton } from "@/components/platform/panel-skeleton";
import { useAppState } from "@/components/providers/app-state-provider";
import { assistantPrompts, aiInsights, demoTransactions } from "@/data/demo-platform";
import {
  formatCurrency,
  formatCurrentDate,
  formatPercent,
  shortenAddress,
} from "@/lib/format";
import {
  getAvailableMonths,
  getCategoryTotals,
  getFinancialHealthScore,
  getMonthlySnapshot,
  getRecentTransactions,
  getTransactionsForWallet,
  getTrendSeries,
} from "@/lib/metrics";

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

const quickActions = [
  {
    href: "/transfer",
    title: "Send",
    description: "Move funds with address checks, fee estimates, and preview controls.",
    icon: Send,
  },
  {
    href: "/transfer",
    title: "Receive",
    description: "Share a polished QR address card with copy and download actions.",
    icon: QrCode,
  },
  {
    href: "/swap",
    title: "Swap",
    description: "Optimize rates, slippage, and route quality before execution.",
    icon: RefreshCcw,
  },
  {
    href: "/bridge",
    title: "Bridge",
    description: "Track cross-chain movement with live stage visibility.",
    icon: Route,
  },
  {
    href: "/wallets",
    title: "Add Funds",
    description: "Review wallet allocations and top up the right strategy wallet.",
    icon: PlusCircle,
  },
] as const;

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function DashboardPage() {
  const { selectedWallet } = useAppState();
  const transactions = getTransactionsForWallet(demoTransactions, selectedWallet.id);
  const latestMonth = getAvailableMonths(transactions)[0] ?? "2026-06";
  const snapshot = getMonthlySnapshot(transactions, latestMonth);
  const trendData = getTrendSeries(transactions, "Monthly");
  const categoryTotals = getCategoryTotals(transactions);
  const recentTransactions = getRecentTransactions(transactions, 4);
  const healthScore = getFinancialHealthScore(snapshot);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-5">
              <span className="ui-pill">
                <ShieldCheck className="h-3.5 w-3.5" />
                AI-powered expense command center
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  {getGreeting()}, {selectedWallet.label}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Track. Analyze. Optimize. Powered by AI. ArcSpend gives you a cleaner
                  spending command center across wallets, swaps, bridge activity, and day-to-day
                  decisions.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">ArcSpend Operator</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Investor demo profile
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-5">
                  <span>Wallet address</span>
                  <span>{shortenAddress(selectedWallet.address, 8, 6)}</span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span>Current network</span>
                  <span>{selectedWallet.network}</span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span>Current date</span>
                  <span>{formatCurrentDate()}</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="ui-pill">
                <Sparkles className="h-3.5 w-3.5" />
                AI health score
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Financial health remains premium
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Bridge activity is elevated this week, but cash runway and recurring bill
                coverage still keep the selected wallet inside the healthy range.
              </p>
            </div>
            <HealthRing score={healthScore} />
          </div>

          <div className="mt-6 grid gap-3">
            {aiInsights.slice(0, 2).map((insight) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={insight.title}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white">{insight.title}</p>
                  <span className="text-sm font-semibold text-cyan">{insight.metric}</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{insight.message}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="ui-pill">Portfolio card</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">
                Premium performance view
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Portfolio performance, monthly spending, and savings estimate all stay visible
                in one place so you can decide before your next move.
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              {formatPercent(selectedWallet.performance)} portfolio performance
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Total balance</p>
              <AnimatedValue
                className="mt-3 block text-3xl font-semibold tracking-[-0.04em] text-white"
                value={selectedWallet.totalBalance}
                variant="currency"
              />
              <p className="mt-2 text-sm text-slate-400">{formatPercent(selectedWallet.monthlyChange)} this month</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Spending this month</p>
              <AnimatedValue
                className="mt-3 block text-3xl font-semibold tracking-[-0.04em] text-white"
                value={snapshot.expenses}
                variant="currency"
              />
              <p className="mt-2 text-sm text-slate-400">{snapshot.label}</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Savings estimate</p>
              <AnimatedValue
                className="mt-3 block text-3xl font-semibold tracking-[-0.04em] text-white"
                value={snapshot.savingsEstimate}
                variant="currency"
              />
              <p className="mt-2 text-sm text-slate-400">Available to sweep into reserves</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Monthly change</p>
              <AnimatedValue
                className="mt-3 block text-3xl font-semibold tracking-[-0.04em] text-white"
                value={snapshot.monthlyChange}
                variant="percent"
              />
              <p className="mt-2 text-sm text-slate-400">Versus previous month</p>
            </div>
          </div>

          <div className="mt-8 rounded-[30px] border border-white/10 bg-slate-950/[0.45] p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="metric-label">Portfolio performance</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Spend, receive, and savings flow
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
                Last 6 months
              </div>
            </div>
            <TrendLineChart data={trendData} height={280} />
          </div>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="ui-pill">AI assistant widget</span>
                <h2 className="mt-4 text-2xl font-semibold text-white">Smart suggestions</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-cyan" />
            </div>
            <div className="mt-6 space-y-3">
              {assistantPrompts.map((prompt) => (
                <div
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300"
                  key={prompt}
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <p className="metric-label">Spending distribution</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Where the wallet is active</h2>
            <div className="mt-6">
              <CategoryBreakdownChart data={categoryTotals.slice(0, 5)} />
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="ui-pill">Quick actions</span>
              <h2 className="mt-4 text-2xl font-semibold text-white">Move faster from the dashboard</h2>
            </div>
            <Link className="button-secondary" href="/transactions">
              Full activity
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link className="surface-card hover-lift p-5" href={action.href} key={action.title}>
                  <div className="icon-shell">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{action.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="ui-pill">Recent activity</span>
              <h2 className="mt-4 text-2xl font-semibold text-white">Latest wallet motion</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
              {snapshot.transactionCount} tx this month
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {recentTransactions.map((transaction) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={transaction.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{transaction.merchant}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {transaction.category} / {transaction.spendCategory}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {transaction.type === "Income" ? "+" : "-"}
                      {formatCurrency(transaction.fiatValue)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{transaction.network}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
