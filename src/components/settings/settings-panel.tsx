"use client";

import { Download, RefreshCcw, Trash2, Wallet } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { downloadTransactionsCsv } from "@/lib/export";
import { shortenAddress } from "@/lib/format";
import type { ArcTransaction } from "@/types/transactions";

export function SettingsPanel({ transactions }: { transactions: ArcTransaction[] }) {
  const {
    clearLocalData,
    demoMode,
    disconnectWallet,
    displayWalletAddress,
    isWalletConnected,
    setDemoMode,
  } = useAppState();

  return (
    <div className="shell-grid lg:grid-cols-[1fr_1fr]">
      <section className="shell-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="metric-label">Wallet Address</p>
            <h2 className="text-2xl">Profile source</h2>
          </div>
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
          <p className="break-all text-sm leading-7 text-white">{displayWalletAddress}</p>
          <p className="mt-3 text-sm text-slate-400">
            {isWalletConnected
              ? `Connected wallet: ${shortenAddress(displayWalletAddress, 10, 8)}`
              : "Using the demo wallet until a browser wallet is connected."}
          </p>
        </div>
        {isWalletConnected ? (
          <button className="action-secondary mt-5" onClick={disconnectWallet} type="button">
            Disconnect Wallet
          </button>
        ) : null}
      </section>

      <section className="shell-card p-6">
        <p className="metric-label">Preferences</p>
        <h2 className="mt-2 text-2xl">App controls</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg text-white">Preferred currency</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Reports and dashboard totals are shown in USD.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white">
                USD
              </span>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg text-white">Demo mode</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Keep the full ArcSpend experience active with mock Arc Testnet transactions.
                </p>
              </div>
              <button
                aria-pressed={demoMode}
                className={`relative flex h-10 w-20 items-center rounded-full p-1 transition ${
                  demoMode ? "bg-cyan" : "bg-white/10"
                }`}
                onClick={() => setDemoMode(!demoMode)}
                type="button"
              >
                <span
                  className={`h-8 w-8 rounded-full bg-slate-950 transition ${
                    demoMode ? "translate-x-10" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="shell-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <p className="metric-label">Export CSV</p>
            <h2 className="text-2xl">Take your data with you</h2>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-400">
          Export the current visible transaction dataset as a CSV file for review or
          reconciliation.
        </p>
        <button
          className="action-primary mt-6 gap-2"
          disabled={transactions.length === 0}
          onClick={() => downloadTransactionsCsv(transactions, "arcspend-settings-export.csv")}
          type="button"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </section>

      <section className="shell-card p-6">
        <p className="metric-label">Local Data</p>
        <h2 className="mt-2 text-2xl">Reset the local profile</h2>
        <div className="mt-6 space-y-4">
          <button className="action-secondary w-full justify-center gap-2" onClick={clearLocalData} type="button">
            <RefreshCcw className="h-4 w-4" />
            Clear Local Data
          </button>
          <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-1 h-5 w-5 text-coral" />
              <div>
                <p className="text-lg text-white">What gets cleared</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Demo mode preference, saved wallet address state, and local ArcSpend app
                  settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

