import { Copy, Download, Hash, Wallet } from "lucide-react";

import type { ArcTransaction } from "@/types/transactions";
import { formatDateTime, formatTokenAmount } from "@/lib/format";

interface ReceiptCardProps {
  copied?: boolean;
  onCopy?: () => void;
  showActions?: boolean;
  transaction: ArcTransaction;
}

export function ReceiptCard({
  copied = false,
  onCopy,
  showActions = false,
  transaction,
}: ReceiptCardProps) {
  return (
    <div className="shell-card overflow-hidden">
      <div className="border-b border-white/10 bg-hero p-6">
        <span className="eyebrow">ArcSpend Receipt</span>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="metric-label">Transaction Type</p>
            <h2 className="mt-2 text-3xl">{transaction.category}</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-right">
            <p className="metric-label">Amount</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatTokenAmount(transaction.amount, transaction.token)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <p className="metric-label">Category</p>
          <p className="mt-2 text-lg text-white">{transaction.category}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <p className="metric-label">Status</p>
          <p className="mt-2 text-lg text-white">{transaction.status}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <p className="metric-label">Date / Time</p>
          <p className="mt-2 text-lg text-white">{formatDateTime(transaction.date)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <p className="metric-label">Network</p>
          <p className="mt-2 text-lg text-white">{transaction.network}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="h-4 w-4" />
            <p className="metric-label">From Address</p>
          </div>
          <p className="mt-3 break-all text-sm leading-7 text-white">{transaction.from}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="h-4 w-4" />
            <p className="metric-label">To Address</p>
          </div>
          <p className="mt-3 break-all text-sm leading-7 text-white">{transaction.to}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 sm:col-span-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Hash className="h-4 w-4" />
            <p className="metric-label">Transaction Hash</p>
          </div>
          <p className="mt-3 break-all text-sm leading-7 text-white">{transaction.txHash}</p>
        </div>
      </div>

      {showActions ? (
        <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row">
          <button
            className="action-primary gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!onCopy}
            onClick={onCopy}
            type="button"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Receipt Copied" : "Copy Receipt"}
          </button>
          <button
            className="action-secondary gap-2 opacity-70"
            disabled
            type="button"
          >
            <Download className="h-4 w-4" />
            Export PDF Soon
          </button>
        </div>
      ) : null}
    </div>
  );
}
