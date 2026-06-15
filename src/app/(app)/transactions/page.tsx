"use client";

import { useState } from "react";
import { ArrowLeftRight, Download } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { ReceiptModal } from "@/components/receipts/receipt-modal";
import { EmptyDataState } from "@/components/shared/empty-data-state";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { demoTransactions } from "@/data/demo-transactions";
import { downloadTransactionsCsv } from "@/lib/export";
import type { ArcTransaction } from "@/types/transactions";

export default function TransactionsPage() {
  const { demoMode, setDemoMode } = useAppState();
  const [selectedTransaction, setSelectedTransaction] = useState<ArcTransaction | null>(null);

  const transactions = demoMode ? demoTransactions : [];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <button
            className="action-secondary gap-2"
            disabled={transactions.length === 0}
            onClick={() => downloadTransactionsCsv(transactions, "arcspend-transactions.csv")}
            type="button"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
        badge="Transactions"
        description="Filter Arc wallet activity across income, expenses, bridge movement, fees, and every receipt-ready transaction."
        title="Full transaction history"
      />

      {!demoMode ? (
        <EmptyDataState
          actionLabel="Re-enable Demo Mode"
          description="There is no live Arc transaction feed wired in yet, so the table is empty while Demo Mode is off."
          onAction={() => setDemoMode(true)}
          title="No live history connected yet"
        />
      ) : null}

      <section className="shell-grid sm:grid-cols-3">
        <article className="shell-card p-5">
          <p className="metric-label">Visible Rows</p>
          <p className="mt-3 text-3xl font-semibold text-white">{transactions.length}</p>
        </article>
        <article className="shell-card p-5">
          <p className="metric-label">Receipt Mode</p>
          <p className="mt-3 text-lg text-white">Every row opens a clean ArcSpend receipt.</p>
        </article>
        <article className="shell-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <p className="text-sm leading-7 text-slate-400">
              Filters separate income, expense, send, receive, swap, bridge, and fee activity.
            </p>
          </div>
        </article>
      </section>

      <TransactionsTable
        interactive
        onOpenReceipt={(transaction) => setSelectedTransaction(transaction)}
        showExport
        transactions={transactions}
      />

      <ReceiptModal onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} />
    </div>
  );
}

