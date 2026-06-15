"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Wallet,
  CalendarRange,
  Sparkles,
} from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { shortenAddress } from "@/lib/format";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    href: "/receipts",
    label: "Receipt Mode",
    icon: ReceiptText,
  },
  {
    href: "/report",
    label: "Monthly Report",
    icon: CalendarRange,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    connectWallet,
    demoMode,
    disconnectWallet,
    displayWalletAddress,
    isConnecting,
    isWalletConnected,
    walletError,
  } = useAppState();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:gap-6 lg:px-8">
      <aside className="shell-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between overflow-hidden p-6 lg:flex">
        <div className="space-y-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-sky-300 to-mint text-slate-950">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg text-white">ArcSpend</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Arc expense clarity
              </p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            Future-ready
          </span>
          <h2 className="text-xl">Mocked today, Arc-ready next</h2>
          <p className="text-sm leading-7 text-slate-400">
            Wallet connection is optional, Demo Data is first-class, and the app is ready
            for real explorer or RPC hooks when you want them.
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="metric-label">Wallet View</p>
            <p className="mt-2 break-all text-sm text-white">
              {shortenAddress(displayWalletAddress, 8, 6)}
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-4">
        <div className="shell-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">
                <Wallet className="h-3.5 w-3.5" />
                {demoMode ? "Demo Data Active" : "Live Sync Pending"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                {isWalletConnected ? "Connected Wallet" : "Demo Wallet"}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-400">
                {demoMode
                  ? "Dashboard metrics are powered by mock Arc Testnet activity so the app works instantly."
                  : "Real Arc sync is the next plug-in step. Re-enable Demo Mode anytime to preview the full experience."}
              </p>
              {walletError ? <p className="mt-2 text-sm text-coral">{walletError}</p> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isWalletConnected ? (
              <>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white">
                  {shortenAddress(displayWalletAddress)}
                </div>
                <button className="action-secondary" onClick={disconnectWallet} type="button">
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="action-primary"
                disabled={isConnecting}
                onClick={() => void connectWallet()}
                type="button"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>

        <nav className="shell-card flex gap-2 overflow-x-auto p-2 lg:hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}

