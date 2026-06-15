"use client";

import { useState } from "react";
import { ArrowDown, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { swapPreview } from "@/data/demo-platform";
import { formatCurrency } from "@/lib/format";

const slippageOptions = ["0.10%", "0.50%", "1.00%"] as const;

export default function SwapPage() {
  const [fromAmount, setFromAmount] = useState("1250");
  const [slippage, setSlippage] = useState<(typeof slippageOptions)[number]>("0.50%");
  const numericAmount = Number(fromAmount || 0);
  const estimatedOutput = (numericAmount / 3220).toFixed(3);
  const feePreview = numericAmount * 0.0021 + 0.62;
  const priceImpact = Math.min(0.12 + numericAmount / 10000, 0.58).toFixed(2);

  return (
    <div className="space-y-5">
      <PageHeader
        badge="Swap"
        description="Token selection, price impact, slippage control, route optimization, and fee previews in a professional ArcSpend trading surface."
        title="Swap with route-aware execution"
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <RefreshCcw className="h-3.5 w-3.5" />
            Swap module
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Route optimized quote</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">From</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <input
                  className="bg-transparent text-4xl font-semibold tracking-[-0.04em] text-white outline-none"
                  onChange={(event) => setFromAmount(event.target.value)}
                  type="number"
                  value={fromAmount}
                />
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white">
                  {swapPreview.fromToken}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                <ArrowDown className="h-4 w-4 text-slate-200" />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Estimated output</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-4xl font-semibold tracking-[-0.04em] text-white">{estimatedOutput}</p>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white">
                  {swapPreview.toToken}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {slippageOptions.map((option) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  slippage === option
                    ? "bg-white text-slate-950"
                    : "bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]"
                }`}
                key={option}
                onClick={() => setSlippage(option)}
                type="button"
              >
                Slippage {option}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-4">
                <span>Price impact</span>
                <span>{priceImpact}%</span>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-4">
                <span>Network fee preview</span>
                <span>{formatCurrency(feePreview)}</span>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-4">
                <span>Route optimization</span>
                <span>{swapPreview.route}</span>
              </div>
            </div>
          </div>

          <button className="button-primary mt-6" type="button">
            Review swap
          </button>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <span className="ui-pill">
              <Sparkles className="h-3.5 w-3.5" />
              Route intelligence
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-white">Best execution path</h2>
            <div className="mt-6 space-y-3">
              {[
                "Arc DEX sources the starting quote.",
                "ZeroSlip Router compares price impact across pools.",
                "Arc Liquidity Pool finalizes the lowest-fee route.",
              ].map((step) => (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300" key={step}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <span className="ui-pill">
              <ShieldCheck className="h-3.5 w-3.5" />
              Preview summary
            </span>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                Estimated output {swapPreview.estimatedOutput} ETH
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                Baseline price impact {swapPreview.priceImpact}
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                Default slippage {slippage}
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                Fee preview {formatCurrency(feePreview)}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
