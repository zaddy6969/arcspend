import type { ArcTransaction } from "@/types/transactions";

const csvHeaders = [
  "id",
  "date",
  "type",
  "category",
  "amount",
  "token",
  "from",
  "to",
  "txHash",
  "status",
  "network",
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
      transaction.amount,
      transaction.token,
      transaction.from,
      transaction.to,
      transaction.txHash,
      transaction.status,
      transaction.network,
    ]
      .map((value) => escapeValue(value))
      .join(","),
  );

  return [csvHeaders.join(","), ...rows].join("\n");
}

// TODO: Add real CSV download with live Arc wallet history and user-selected date ranges.
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

