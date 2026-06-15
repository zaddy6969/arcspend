"use client";

import { useState } from "react";
import {
  Copy,
  Download,
  QrCode,
  Send,
  Share2,
  ShieldCheck,
} from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { PageHeader } from "@/components/shared/page-header";
import { receiveQrPattern } from "@/data/demo-platform";
import { formatCurrency, shortenAddress } from "@/lib/format";

function isValidRecipient(value: string) {
  if (value.length === 0) {
    return false;
  }

  return /^0x[a-fA-F0-9]{40}$/.test(value) || value.endsWith(".eth");
}

function buildQrSvg(address: string) {
  const size = 8;
  const margin = 10;
  const dimension = receiveQrPattern.length * size + margin * 2;

  const rects = receiveQrPattern
    .flatMap((row, rowIndex) =>
      row.split("").map((cell, cellIndex) =>
        cell === "1"
          ? `<rect x="${margin + cellIndex * size}" y="${margin + rowIndex * size}" width="${size}" height="${size}" rx="1.4" fill="#0f172a" />`
          : "",
      ),
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}"><rect width="${dimension}" height="${dimension}" rx="28" fill="#f8fafc" />${rects}<text x="${dimension / 2}" y="${dimension - 16}" text-anchor="middle" font-family="Arial" font-size="10" fill="#475569">${address}</text></svg>`;
}

export default function TransferPage() {
  const { displayWalletAddress, selectedWallet } = useAppState();
  const [recipient, setRecipient] = useState("alexvault.eth");
  const [amount, setAmount] = useState("1200");
  const [token, setToken] = useState("USDC");
  const isValid = isValidRecipient(recipient);
  const feeEstimate = Number(amount || 0) * 0.0018 + 1.24;
  const totalSpend = Number(amount || 0) + feeEstimate;

  async function handleCopyAddress() {
    await navigator.clipboard.writeText(displayWalletAddress);
  }

  async function handleShareAddress() {
    if (navigator.share) {
      await navigator.share({
        title: "ArcSpend receive address",
        text: displayWalletAddress,
      });
      return;
    }

    await navigator.clipboard.writeText(displayWalletAddress);
  }

  function handleDownloadQr() {
    const svg = buildQrSvg(displayWalletAddress);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "arcspend-receive-qr.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        badge="Send / Receive"
        description="Validated outbound transfers, polished receive flows, live fee previews, and wallet-safe guardrails in one premium surface."
        title="Move funds with confidence"
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="ui-pill">
                <Send className="h-3.5 w-3.5" />
                Send flow
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-white">Address-safe transfer</h2>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-medium ${isValid ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-300/10 text-amber-200"}`}>
              {isValid ? "Address verified" : "Needs review"}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="metric-label">Recipient or ENS</span>
              <input
                className="field-control"
                onChange={(event) => setRecipient(event.target.value)}
                placeholder="0x... or ens.eth"
                value={recipient}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="metric-label">Amount</span>
                <input
                  className="field-control"
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  value={amount}
                />
              </label>
              <label className="grid gap-2">
                <span className="metric-label">Token</span>
                <select className="field-control" onChange={(event) => setToken(event.target.value)} value={token}>
                  <option value="USDC">USDC</option>
                  <option value="EURC">EURC</option>
                  <option value="ETH">ETH</option>
                  <option value="ARC">ARC</option>
                </select>
              </label>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="metric-label">Transaction preview</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-4">
                  <span>From wallet</span>
                  <span>{selectedWallet.label}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Destination</span>
                  <span>{recipient}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Estimated fee</span>
                  <span>{formatCurrency(feeEstimate)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Total cost</span>
                  <span>{formatCurrency(totalSpend)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="button-primary" disabled={!isValid} type="button">
              Send {token}
            </button>
            <button className="button-secondary" type="button">
              Save draft
            </button>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <QrCode className="h-3.5 w-3.5" />
            Receive flow
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Share your wallet beautifully</h2>
          <div className="mt-6 flex justify-center">
            <div className="rounded-[32px] bg-slate-50 p-5 shadow-[0_28px_70px_rgba(248,250,252,0.16)]">
              <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
                {receiveQrPattern.flatMap((row, rowIndex) =>
                  row.split("").map((cell, cellIndex) => (
                    <span
                      className={`h-2.5 w-2.5 rounded-[2px] ${cell === "1" ? "bg-slate-950" : "bg-transparent"}`}
                      key={`${rowIndex}-${cellIndex}`}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <p className="metric-label">Receive address</p>
            <p className="mt-3 break-all text-sm text-white">{displayWalletAddress}</p>
            <p className="mt-2 text-sm text-slate-400">
              {selectedWallet.label} / {selectedWallet.network}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="button-secondary" onClick={() => void handleCopyAddress()} type="button">
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button className="button-secondary" onClick={() => void handleShareAddress()} type="button">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="button-secondary" onClick={handleDownloadQr} type="button">
              <Download className="h-4 w-4" />
              Download QR
            </button>
          </div>

          <div className="mt-6 rounded-[26px] border border-cyan/20 bg-cyan/10 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-cyan" />
              <div>
                <p className="font-semibold text-white">Smart guardrail</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  ArcSpend recommends using the receive QR for first-time counterparties and
                  confirming the address ending in {shortenAddress(displayWalletAddress, 4, 4)}.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
