"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { ReceiptCard } from "@/components/receipts/receipt-card";
import { buildReceiptText } from "@/lib/receipts";
import type { ArcTransaction } from "@/types/transactions";

interface ReceiptModalProps {
  onClose: () => void;
  transaction: ArcTransaction | null;
}

export function ReceiptModal({ onClose, transaction }: ReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, transaction]);

  if (!transaction) {
    return null;
  }

  async function handleCopy() {
    if (!transaction) {
      return;
    }

    await navigator.clipboard.writeText(buildReceiptText(transaction));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
      <div className="relative max-h-full w-full max-w-4xl overflow-auto">
        <button
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
        <ReceiptCard copied={copied} onCopy={() => void handleCopy()} showActions transaction={transaction} />
        {/* TODO: Add real receipt PDF export. */}
      </div>
    </div>
  );
}
