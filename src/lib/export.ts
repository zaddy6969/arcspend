import type { ArcTransaction } from "@/types/transactions";

const csvHeaders = [
  "id",
  "date",
  "type",
  "category",
  "spendCategory",
  "amount",
  "fiatValue",
  "token",
  "walletLabel",
  "merchant",
  "counterparty",
  "from",
  "to",
  "txHash",
  "status",
  "network",
  "fee",
  "note",
];

function escapeValue(value: string | number) {
  const serialized = String(value).replaceAll('"', '""');
  return `"${serialized}"`;
}

export function buildTransactionsCsv(transactions: ArcTransaction[]) {
  const rows = transactions.map((transaction) =>
    [
      transaction.id,
      transaction.date,
      transaction.type,
      transaction.category,
      transaction.spendCategory,
      transaction.amount,
      transaction.fiatValue,
      transaction.token,
      transaction.walletLabel,
      transaction.merchant,
      transaction.counterparty,
      transaction.from,
      transaction.to,
      transaction.txHash,
      transaction.status,
      transaction.network,
      transaction.fee,
      transaction.note,
    ]
      .map((value) => escapeValue(value))
      .join(","),
  );

  return [csvHeaders.join(","), ...rows].join("\n");
}

export function downloadTransactionsCsv(transactions: ArcTransaction[], filename: string) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([buildTransactionsCsv(transactions)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
