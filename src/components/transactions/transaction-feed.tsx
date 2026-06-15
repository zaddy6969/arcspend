"use client";

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Car,
  ChevronDown,
  Coffee,
  Download,
  Laptop,
  Plane,
  ReceiptText,
  Search,
  Share2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import type {
  ArcTransaction,
  TransactionSortOption,
} from "@/types/transactions";
import { buildReceiptText } from "@/lib/receipts";
import { downloadTransactionsCsv } from "@/lib/export";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
  formatTokenAmount,
} from "@/lib/format";

const filterOptions = [
  "All",
  "Income",
  "Expense",
  "Crypto",
  "Bills",
  "Food",
  "Shopping",
  "Transport",
] as const;

function getCategoryIcon(category: ArcTransaction["spendCategory"]) {
  if (category === "Food") {
    return Coffee;
  }

  if (category === "Shopping") {
    return ShoppingBag;
  }

  if (category === "Bills") {
    return ReceiptText;
  }

  if (category === "Transport") {
    return Car;
  }

  if (category === "Travel") {
    return Plane;
  }

  if (category === "Software") {
    return Laptop;
  }

  return ArrowLeftRight;
}

function statusClasses(status: ArcTransaction["status"]) {
  if (status === "Confirmed") {
    return "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20";
  }

  if (status === "Pending" || status === "Processing") {
    return "bg-amber-400/10 text-amber-200 ring-1 ring-amber-300/20";
  }

  return "bg-rose-400/10 text-rose-200 ring-1 ring-rose-300/20";
}

interface TransactionFeedProps {
  transactions: ArcTransaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("All");
  const [sortOrder, setSortOrder] = useState<TransactionSortOption>("Newest");
  const [visibleCount, setVisibleCount] = useState(8);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredTransactions = transactions
    .filter((transaction) => {
      const query = deferredQuery.trim().toLowerCase();

      const matchesQuery =
        query.length === 0 ||
        transaction.merchant.toLowerCase().includes(query) ||
        transaction.counterparty.toLowerCase().includes(query) ||
        transaction.walletLabel.toLowerCase().includes(query) ||
        transaction.token.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.spendCategory.toLowerCase().includes(query);

      if (!matchesQuery) {
        return false;
      }

      if (activeFilter === "All") {
        return true;
      }

      if (activeFilter === "Income") {
        return transaction.type === "Income";
      }

      if (activeFilter === "Expense") {
        return transaction.type === "Expense";
      }

      return transaction.spendCategory === activeFilter;
    })
    .sort((left, right) => {
      if (sortOrder === "Oldest") {
        return new Date(left.date).getTime() - new Date(right.date).getTime();
      }

      if (sortOrder === "Highest") {
        return right.fiatValue - left.fiatValue;
      }

      if (sortOrder === "Lowest") {
        return left.fiatValue - right.fiatValue;
      }

      return new Date(right.date).getTime() - new Date(left.date).getTime();
    });

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 4, filteredTransactions.length));
        }
      },
      {
        rootMargin: "160px",
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [filteredTransactions.length]);

  async function handleCopyReceipt(transaction: ArcTransaction) {
    await navigator.clipboard.writeText(buildReceiptText(transaction));
    setCopiedId(transaction.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  return (
    <section className="space-y-5">
      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] xl:flex xl:flex-1 xl:items-center">
            <label className="relative flex min-w-0 items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
              <input
                className="field-control pl-11"
                onChange={(event) =>
                  startTransition(() => {
                    setSearchQuery(event.target.value);
                    setVisibleCount(8);
                  })
                }
                placeholder="Search merchant, wallet, token, or category"
                type="search"
                value={searchQuery}
              />
            </label>

            <div className="relative">
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className="field-control appearance-none pr-10"
                onChange={(event) => {
                  setSortOrder(event.target.value as TransactionSortOption);
                  setVisibleCount(8);
                }}
                value={sortOrder}
              >
                <option value="Newest">Newest first</option>
                <option value="Oldest">Oldest first</option>
                <option value="Highest">Highest amount</option>
                <option value="Lowest">Lowest amount</option>
              </select>
            </div>
          </div>

          <button
            className="button-secondary w-full justify-center sm:w-auto"
            onClick={() =>
              downloadTransactionsCsv(filteredTransactions, "arcspend-transaction-feed.csv")
            }
            type="button"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((option) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === option
                  ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
              key={option}
              onClick={() => {
                setActiveFilter(option);
                setVisibleCount(8);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {visibleTransactions.length} of {filteredTransactions.length} transactions
          </p>
          <p className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan" />
            Swipe the action row on mobile for quick receipt and share controls.
          </p>
        </div>
      </div>

      {visibleTransactions.length > 0 ? (
        <div className="grid gap-4">
          {visibleTransactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.spendCategory);

            return (
              <article className="surface-card hover-lift p-5 sm:p-6" key={transaction.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="icon-shell mt-1">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {transaction.merchant}
                          </h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {transaction.walletLabel} on {transaction.network}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Activity
                          </p>
                          <p className="mt-1">
                            {transaction.category} / {transaction.spendCategory}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Counterparty
                          </p>
                          <p className="mt-1">{transaction.counterparty}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Timestamp
                          </p>
                          <p className="mt-1">{formatDateTime(transaction.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Fee
                          </p>
                          <p className="mt-1">{formatCurrency(transaction.fee)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {transaction.tags.map((tag) => (
                          <span
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[220px] space-y-4 lg:text-right">
                    <div>
                      <p
                        className={`text-2xl font-semibold ${
                          transaction.type === "Income" ? "text-emerald-300" : "text-white"
                        }`}
                      >
                        {transaction.type === "Income" ? "+" : "-"}
                        {formatCurrency(transaction.fiatValue)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatTokenAmount(transaction.amount, transaction.token)}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {formatRelativeTime(transaction.date)}
                      </p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end">
                      <button
                        className="button-secondary whitespace-nowrap"
                        onClick={() => void handleCopyReceipt(transaction)}
                        type="button"
                      >
                        <ReceiptText className="h-4 w-4" />
                        {copiedId === transaction.id ? "Copied" : "Receipt"}
                      </button>
                      <button className="button-secondary whitespace-nowrap" type="button">
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
            <Search className="h-6 w-6 text-cyan" />
          </div>
          <h3 className="text-xl font-semibold text-white">No matching transactions</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Try clearing the active filter or broadening the search term. ArcSpend AI
            recommends checking the wallet label and merchant name first.
          </p>
          <button
            className="button-primary mx-auto mt-5"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("All");
              setSortOrder("Newest");
            }}
            type="button"
          >
            Reset filters
          </button>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <div className="h-3 w-3 rounded-full bg-cyan/40" ref={sentinelRef} />
      </div>
    </section>
  );
}
