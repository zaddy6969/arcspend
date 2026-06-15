import type { ArcTransaction } from "@/types/transactions";
import { formatCurrency, formatDateTime, formatTokenAmount } from "@/lib/format";

export function buildReceiptText(transaction: ArcTransaction) {
  return [
    "ArcSpend Receipt",
    `Transaction type: ${transaction.category}`,
    `Amount: ${formatTokenAmount(transaction.amount, transaction.token)}`,
    `USD value: ${formatCurrency(transaction.fiatValue)}`,
    `Date/time: ${formatDateTime(transaction.date)}`,
    `Wallet: ${transaction.walletLabel}`,
    `Merchant: ${transaction.merchant}`,
    `From: ${transaction.from}`,
    `To: ${transaction.to}`,
    `Tx hash: ${transaction.txHash}`,
    `Status: ${transaction.status}`,
    `Spend category: ${transaction.spendCategory}`,
    `Network: ${transaction.network}`,
    `Fee: ${formatCurrency(transaction.fee)}`,
    `Note: ${transaction.note}`,
  ].join("\n");
}
