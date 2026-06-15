"use client";

import { useState } from "react";
import { ChevronRight, ReceiptText } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { ReceiptCard } from "@/components/receipts/receipt-card";
import { ReceiptModal } from "@/components/receipts/receipt-modal";
import { EmptyDataState } from "@/components/shared/empty-data-state";
import { PageHeader } from "@/components/shared/page-header";
import { demoTransactions } from "@/data/demo-transactions";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { buildReceiptText } from "@/lib/receipts";
import type { ArcTransaction } from "@/types/transactions";

export default function ReceiptsPage() {
  const { demoMode, setDemoMode } = useAppState();
  const transactions = demoMode ? demoTransactions : [];

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    demoTransactions[0]?.id ?? null,
  );
  const [modalTransaction, setModalTransaction] = useState<ArcTransaction | null>(null);
  const [copiedReceiptId, setCopiedReceiptId] = useState<string | null>(null);
  const selectedTransaction =
    transactions.find((transaction) => transaction.id === selectedTransactionId) ??
    transactions[0] ??
    null;

  async function handleCopy() {
    if (!selectedTransaction) {
      return;
    }

    await navigator.clipboard.writeText(buildReceiptText(selectedTransaction));
    setCopiedReceiptId(selectedTransaction.id);
    window.setTimeout(() => setCopiedReceiptId(null), 1800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Receipt Mode"
        description="Open transaction-grade receipts with wallet addresses, network details, hashes, status, and copy-ready formatting."
        title="Beautiful receipts for every Arc transaction"
      />

      {!demoMode ? (
        <EmptyDataState
          actionLabel="Re-enable Demo Mode"
          description="Receipt Mode needs transaction data to render. Live Arc receipt generation will slot in once the wallet sync layer is connected."
          onAction={() => setDemoMode(true)}
          title="No receipts available right now"
        />
      ) : null}

      {selectedTransaction ? (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Receipt Queue</p>
                <h2 className="mt-2 text-2xl">Select a transaction</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                {transactions.length} receipts
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {transactions.map((transaction) => (
                <button
                  className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${
                    selectedTransaction.id === transaction.id
                      ? "border-cyan/30 bg-cyan/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                  key={transaction.id}
                  onClick={() => setSelectedTransactionId(transaction.id)}
                  type="button"
                >
                  <div>
                    <p className="font-medium text-white">{transaction.category}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatShortDate(transaction.date)} · {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <ReceiptCard
              copied={copiedReceiptId === selectedTransaction.id}
              onCopy={() => void handleCopy()}
              showActions
              transaction={selectedTransaction}
            />
            <button
              className="action-secondary gap-2"
              onClick={() => setModalTransaction(selectedTransaction)}
              type="button"
            >
              <ReceiptText className="h-4 w-4" />
              Open Modal View
            </button>
          </div>
        </section>
      ) : null}

      <ReceiptModal onClose={() => setModalTransaction(null)} transaction={modalTransaction} />
    </div>
  );
}
