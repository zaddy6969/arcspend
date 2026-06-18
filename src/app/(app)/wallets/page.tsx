"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { PageHeader } from "@/components/shared/page-header";
import { demoTransactions, demoWallets } from "@/data/demo-platform";
import { formatCompactCurrency, formatCurrency, formatPercent, formatTokenAmount, shortenAddress } from "@/lib/format";
import { getTransactionsForWallet } from "@/lib/metrics";

export default function WalletsPage() {
  const { selectedWallet } = useAppState();
  const transactions = getTransactionsForWallet(demoTransactions, selectedWallet.id);

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
            {transactions.length} transactions on {selectedWallet.label}
          </div>
        }
        badge="Wallets"
        description="Switch between spending, trading, and treasury wallets while keeping balances, allocations, and wallet health visible."
        title="Multi-wallet management with portfolio context"
      />

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="ui-pill">
                <ShieldCheck className="h-3.5 w-3.5" />
                Portfolio overview
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">
                {selectedWallet.label}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                A premium view of wallet balances, allocation, and strategy-level health across
                USDC, EURC, ETH, BTC, and ARC.
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              {formatPercent(selectedWallet.monthlyChange)} monthly change
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Total balance</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {formatCurrency(selectedWallet.totalBalance)}
              </p>
              <p className="mt-2 text-sm text-slate-400">{selectedWallet.network}</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Savings estimate</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {formatCurrency(selectedWallet.savingsEstimate)}
              </p>
              <p className="mt-2 text-sm text-slate-400">Available to redirect into reserves</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Wallet address</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {shortenAddress(selectedWallet.address, 10, 6)}
              </p>
              <p className="mt-2 text-sm text-slate-400">{selectedWallet.role}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {selectedWallet.assets.map((asset) => (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5" key={asset.symbol}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: asset.accent }}
                      />
                      <h3 className="text-lg font-semibold text-white">{asset.symbol}</h3>
                      <span className="text-sm text-slate-400">{asset.name}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {formatTokenAmount(asset.balance, asset.symbol)} held in wallet
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(asset.fiatValue)}
                    </p>
                    <p className="mt-1 text-sm text-cyan">{formatPercent(asset.change)}</p>
                  </div>
                </div>
                <div className="mt-4 h-2.5 rounded-full bg-white/[0.08]">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${asset.allocation}%`,
                      background: `linear-gradient(90deg, ${asset.accent}, rgba(255,255,255,0.88))`,
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-400">{asset.allocation}% allocation</p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <span className="ui-pill">Wallet switching</span>
            <h2 className="mt-4 text-2xl font-semibold text-white">All portfolio wallets</h2>
            <div className="mt-6 space-y-3">
              {demoWallets.map((wallet) => (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4" key={wallet.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{wallet.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{wallet.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatCompactCurrency(wallet.totalBalance)}</p>
                      <p className="mt-1 text-sm text-cyan">{formatPercent(wallet.monthlyChange)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="ui-pill">AI allocation note</span>
                <h2 className="mt-4 text-2xl font-semibold text-white">Balance recommendations</h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-cyan" />
            </div>
            <div className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Keep stable operating spend inside Main Spending and offload long-tail software
                renewals to Treasury Vault.
              </p>
              <p>
                The Trading Desk can carry more BTC risk this month without hurting overall
                portfolio health, but bridge volume should stay below the last cycle.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
