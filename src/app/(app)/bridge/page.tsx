"use client";

import { useState } from "react";
import { ArrowRight, Route, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { bridgePreview, bridgeStages } from "@/data/demo-platform";
import { formatCurrency } from "@/lib/format";

const chains = ["Arc", "Ethereum", "Base"] as const;

export default function BridgePage() {
  const [sourceChain, setSourceChain] = useState<(typeof chains)[number]>("Arc");
  const [destinationChain, setDestinationChain] = useState<(typeof chains)[number]>("Ethereum");
  const [amount, setAmount] = useState("1600");
  const fee = Number(amount || 0) * 0.0022 + 1.8;

  return (
    <div className="space-y-5">
      <PageHeader
        badge="Bridge"
        description="Cross-chain routing, token and amount controls, and a polished stage tracker so bridge activity never feels opaque."
        title="Bridge flows with real progress visibility"
      />

      <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <Route className="h-3.5 w-3.5" />
            Bridge route
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Cross-chain transfer setup</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="metric-label">Source chain</span>
              <select className="field-control" onChange={(event) => setSourceChain(event.target.value as (typeof chains)[number])} value={sourceChain}>
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="metric-label">Destination chain</span>
              <select className="field-control" onChange={(event) => setDestinationChain(event.target.value as (typeof chains)[number])} value={destinationChain}>
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="metric-label">Token</span>
              <select className="field-control" defaultValue={bridgePreview.token}>
                <option value="USDC">USDC</option>
                <option value="EURC">EURC</option>
                <option value="ETH">ETH</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="metric-label">Amount</span>
              <input
                className="field-control"
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                value={amount}
              />
            </label>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="metric-label">Estimated settlement</p>
                <p className="mt-2 text-3xl font-semibold text-white">{bridgePreview.eta}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-cyan" />
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-4">
                <span>Fee preview</span>
                <span>{formatCurrency(fee)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Route</span>
                <span>
                  {sourceChain} to {destinationChain}
                </span>
              </div>
            </div>
          </div>

          <button className="button-primary mt-6" type="button">
            Review bridge
          </button>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <span className="ui-pill">
              <Sparkles className="h-3.5 w-3.5" />
              Progress tracker
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-white">Bridge stages</h2>

            <div className="mt-6 grid gap-4">
              {bridgeStages.map((stage, index) => (
                <div className="flex items-start gap-4" key={stage.label}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                        stage.state === "complete"
                          ? "bg-emerald-400 text-slate-950"
                          : stage.state === "current"
                            ? "bg-cyan text-slate-950"
                            : "bg-white/[0.08] text-slate-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < bridgeStages.length - 1 ? <div className="mt-2 h-10 w-px bg-white/10" /> : null}
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-semibold text-white">{stage.label}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{stage.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <span className="ui-pill">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security note
            </span>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {bridgePreview.securityNote} ArcSpend will flag unusual bridge fee spikes and
              destination mismatch before final confirmation.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
