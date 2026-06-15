import type { ArcTransaction } from "@/types/transactions";
import { formatDateTime, formatTokenAmount } from "@/lib/format";

export function buildReceiptText(transaction: ArcTransaction) {
  return [
    "ArcSpend Receipt",
    `Transaction type: ${transaction.category}`,
    `Amount: ${formatTokenAmount(transaction.amount, transaction.token)}`,
    `Date/time: ${formatDateTime(transaction.date)}`,
    `From: ${transaction.from}`,
    `To: ${transaction.to}`,
    `Tx hash: ${transaction.txHash}`,
    `Status: ${transaction.status}`,
    `Category: ${transaction.category}`,
    `Network: ${transaction.network}`,
  ].join("\n");
}

