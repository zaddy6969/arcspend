"use client";

import { useState } from "react";
import { Funnel } from "lucide-react";

import { EmptyDataState } from "@/components/shared/empty-data-state";
import { downloadTransactionsCsv } from "@/lib/export";
import { formatCurrency, formatFullDate, shortenAddress } from "@/lib/format";
import { isExpenseTransaction, isIncomeTransaction } from "@/lib/metrics";
import type { ArcTransaction, TransactionFilter } from "@/types/transactions";
import { transactionFilters } from "@/types/transactions";

interface TransactionsTableProps {
  interactive?: boolean;
  limit?: number;
  onOpenReceipt: (transaction: ArcTransaction) => void;
  showExport?: boolean;
  transactions: ArcTransaction[];
}

const badgeStyles: Record<string, string> = {
  Send: "border-coral/20 bg-coral/10 text-coral",
  Receive: "border-mint/20 bg-mint/10 text-mint",
  Swap: "border-cyan/20 bg-cyan/10 text-cyan",
  Bridge: "border-amber/20 bg-amber/10 text-amber",
  "Gas/Fee": "border-sky-300/20 bg-sky-300/10 text-sky-300",
  Unknown: "border-white/15 bg-white/5 text-slate-300",
};

function matchesFilter(transaction: ArcTransaction, filter: TransactionFilter) {
  switch (filter) {
    case "All":
      return true;
    case "Income":
      return isIncomeTransaction(transaction);
    case "Expense":
      return isExpenseTransaction(transaction);
    case "Fee":
      return transaction.category === "Gas/Fee";
    default:
      return transaction.category === filter;
  }
}

export function TransactionsTable({
  interactive = false,
  limit,
  onOpenReceipt,
  showExport = false,
  transactions,
}: TransactionsTableProps) {
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>("All");

  const filteredTransactions = transactions.filter((transaction) =>
    matchesFilter(transaction, activeFilter),
  );
  const visibleTransactions = typeof limit === "number"
    ? filteredTransactions.slice(0, limit)
    : filteredTransactions;

  return (
    <div className="shell-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="metric-label">Transaction Ledger</p>
          <h2 className="mt-2 text-2xl">Wallet activity with receipt access</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            {filteredTransactions.length} visible transactions
          </div>
          {showExport ? (
            <button
              className="action-secondary"
              onClick={() =>
                downloadTransactionsCsv(transactions, "arcspend-transactions.csv")
              }
              type="button"
            >
              Export CSV
            </button>
          ) : null}
        </div>
      </div>

      {interactive ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="mr-2 flex items-center gap-2 text-sm text-slate-400">
            <Funnel className="h-4 w-4" />
            Filters
          </div>
          {transactionFilters.map((filter) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      ) : null}

      {visibleTransactions.length === 0 ? (
        <div className="mt-6">
          <EmptyDataState
            description="There are no transactions in the current mode yet. Re-enable Demo Mode or connect real Arc history later."
            title="No transactions to display"
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Type</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Token</th>
                  <th className="px-4 py-4 font-medium">From</th>
                  <th className="px-4 py-4 font-medium">To</th>
                  <th className="px-4 py-4 font-medium">Tx Hash</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.02]">
                {visibleTransactions.map((transaction) => (
                  <tr className="hover:bg-white/[0.03]" key={transaction.id}>
                    <td className="px-4 py-4 text-white">{formatFullDate(transaction.date)}</td>
                    <td className="px-4 py-4 text-slate-300">{transaction.type}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyles[transaction.category]}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white">
                      {transaction.type === "Income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{transaction.token}</td>
                    <td className="px-4 py-4 text-slate-300">
                      {shortenAddress(transaction.from, 8, 6)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {shortenAddress(transaction.to, 8, 6)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {shortenAddress(transaction.txHash, 10, 8)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{transaction.status}</td>
                    <td className="px-4 py-4">
                      <button
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                        onClick={() => onOpenReceipt(transaction)}
                        type="button"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

