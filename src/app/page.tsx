import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Download,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { demoTransactions } from "@/data/demo-transactions";
import {
  getAvailableMonths,
  getCategoryTotals,
  getMonthlySnapshot,
  getRecentTransactions,
} from "@/lib/metrics";

const featureCards = [
  {
    title: "Track USDC income and expenses",
    description: "Separate inflow from outflow instantly and keep stablecoin activity readable.",
    icon: CircleDollarSign,
  },
  {
    title: "Auto-categorize send, receive, swap, bridge, fee",
    description: "ArcSpend organizes raw wallet motion into categories that make sense at a glance.",
    icon: Sparkles,
  },
  {
    title: "Monthly spending report",
    description: "See how each month moved, what changed, and where your wallet was most active.",
    icon: BarChart3,
  },
  {
    title: "Receipt mode for every transaction",
    description: "Open a clean receipt view for any transaction and copy the details in seconds.",
    icon: ReceiptText,
  },
  {
    title: "CSV export",
    description: "Take your history with you whenever you need to reconcile activity outside the app.",
    icon: Download,
  },
  {
    title: "Built for Arc users",
    description: "Designed around Arc spending clarity, demo-ready today and easy to wire to live data later.",
    icon: WalletCards,
  },
];

export default function LandingPage() {
  const latestMonth = getAvailableMonths(demoTransactions)[0];
  const summary = getMonthlySnapshot(demoTransactions, latestMonth);
  const categoryTotals = getCategoryTotals(summary.transactions).slice(0, 4);
  const recentTransactions = getRecentTransactions(demoTransactions, 4);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-14 px-6 pb-20 pt-8 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-sky-300 to-mint text-slate-950 shadow-[0_10px_30px_rgba(110,231,249,0.25)]">
            <CircleDollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg text-white">ArcSpend</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Track every USDC move on Arc, clearly.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link className="action-secondary" href="/dashboard">
            Launch Dashboard
          </Link>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <span className="eyebrow">
            <ShieldCheck className="h-3.5 w-3.5" />
            Premium Arc expense tracking
          </span>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Understand where your USDC goes on Arc
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              ArcSpend turns raw wallet activity into clear expenses, income, charts,
              receipts, and monthly reports.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="action-primary gap-2" href="/dashboard">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="action-secondary gap-2" href="/dashboard">
              View Demo
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="shell-card p-5">
              <p className="metric-label">Monthly Spending</p>
              <p className="metric-value">${summary.expenses.toLocaleString()}</p>
            </div>
            <div className="shell-card p-5">
              <p className="metric-label">Monthly Income</p>
              <p className="metric-value">${summary.income.toLocaleString()}</p>
            </div>
            <div className="shell-card p-5">
              <p className="metric-label">Transactions</p>
              <p className="metric-value">{summary.transactionCount}</p>
            </div>
          </div>
        </div>

        <div className="shell-card relative overflow-hidden p-6 sm:p-7">
          <div className="absolute inset-0 bg-hero opacity-60" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Live Preview</p>
                <h2 className="mt-2 text-2xl">Expense clarity in one view</h2>
              </div>
              <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                Demo Data
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <p className="metric-label">Net Flow</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  ${summary.netFlow.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Income minus tracked Arc spending for {summary.label}.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <p className="metric-label">Top Categories</p>
                <div className="mt-3 space-y-3">
                  {categoryTotals.map((item) => (
                    <div className="space-y-2" key={item.category}>
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>{item.category}</span>
                        <span>${item.total.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan via-sky-300 to-mint"
                          style={{ width: `${Math.min(item.share * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="metric-label">Recent Arc Activity</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {summary.label}
                </span>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                    key={transaction.id}
                  >
                    <div>
                      <p className="font-medium text-white">{transaction.category}</p>
                      <p className="text-sm text-slate-400">{transaction.token}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {transaction.type === "Income" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="eyebrow">What ArcSpend gives you</span>
            <h2 className="section-title">Submission-ready finance UX without paid APIs</h2>
            <p className="section-copy">
              ArcSpend is built to work in demo mode first, so the story is already clear:
              spending, income, receipts, reports, and a path to live Arc wallet data later.
            </p>
          </div>
          <div className="max-w-sm rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <p className="metric-label">Project Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              ArcSpend is a crypto expense tracker built for Arc users. It turns USDC and
              EURC wallet activity into clear expenses, income, receipts, charts, and
              monthly reports without needing any paid AI API.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6" key={feature.title}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="shell-card p-6">
          <span className="eyebrow">Demo-first foundation</span>
          <h2 className="mt-4 text-3xl">Ready now, easy to connect later</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Start with mocked Arc Testnet activity, keep the wallet connection optional, and
            plug in real explorer or RPC data when you are ready.
          </p>
          <div className="soft-divider my-6" />
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span>Wallet connection</span>
              <span className="text-cyan">Optional</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span>Receipt export</span>
              <span className="text-amber">UI ready</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span>CSV export</span>
              <span className="text-mint">Working</span>
            </div>
          </div>
        </div>

        <div className="shell-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-label">ArcSpend Workflow</p>
              <h2 className="mt-2 text-2xl">Raw transactions, clean decisions</h2>
            </div>
            <Link className="action-secondary" href="/dashboard">
              Open MVP
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
              <p className="metric-label">1</p>
              <h3 className="mt-3 text-lg">Ingest activity</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Demo data flows in even before a wallet is connected.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
              <p className="metric-label">2</p>
              <h3 className="mt-3 text-lg">Categorize motion</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Track send, receive, swap, bridge, fee, and unknown behavior separately.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
              <p className="metric-label">3</p>
              <h3 className="mt-3 text-lg">Export clarity</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Use receipts, monthly reports, and CSV export to make activity actionable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
