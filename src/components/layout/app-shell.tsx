"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  RefreshCcw,
  Route,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { demoWallets } from "@/data/demo-platform";
import { formatCompactCurrency, formatCurrentDate, formatPercent, shortenAddress } from "@/lib/format";

const desktopNavigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    href: "/wallets",
    label: "Wallets",
    icon: Wallet,
  },
  {
    href: "/transfer",
    label: "Send / Receive",
    icon: Send,
  },
  {
    href: "/swap",
    label: "Swap",
    icon: RefreshCcw,
  },
  {
    href: "/bridge",
    label: "Bridge",
    icon: Route,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

const mobileNavigation = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard,
  },
  {
    href: "/analytics",
    label: "Insights",
    icon: BarChart3,
  },
  {
    href: "/transactions",
    label: "Activity",
    icon: ArrowLeftRight,
  },
  {
    href: "/wallets",
    label: "Wallets",
    icon: Wallet,
  },
  {
    href: "/transfer",
    label: "Move",
    icon: Send,
  },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/transfer") {
    return pathname === "/transfer" || pathname === "/swap" || pathname === "/bridge";
  }

  return pathname === href;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    connectWallet,
    demoMode,
    disconnectWallet,
    displayWalletAddress,
    isConnecting,
    isWalletConnected,
    selectedWallet,
    selectedWalletId,
    setSelectedWalletId,
    walletError,
  } = useAppState();

  return (
    <div className="page-shell">
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="surface-card sticky top-4 hidden h-[calc(100vh-2rem)] flex-col justify-between p-6 lg:flex">
          <div className="space-y-6">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-sky-300 to-amber-300 text-slate-950 shadow-[0_24px_60px_rgba(103,232,249,0.25)]">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl text-white">ArcSpend</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Track. Analyze. Optimize.
                </p>
              </div>
            </Link>

            <nav className="space-y-2">
              {desktopNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-950 shadow-[0_20px_40px_rgba(255,255,255,0.12)]"
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {isActive ? <span className="h-2 w-2 rounded-full bg-slate-950" /> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="ui-pill">Wallet switcher</span>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  3 wallets
                </span>
              </div>
              <div className="space-y-2">
                {demoWallets.map((wallet) => (
                  <button
                    className={`w-full rounded-[24px] border px-4 py-3 text-left transition ${
                      selectedWalletId === wallet.id
                        ? "border-cyan/30 bg-cyan/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                    key={wallet.id}
                    onClick={() => setSelectedWalletId(wallet.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{wallet.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {wallet.role}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {formatCompactCurrency(wallet.totalBalance)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="ui-pill">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Pulse
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {selectedWallet.healthScore}/100 financial health
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Savings runway is healthy, but software renewals and bridge volume are
                    where the next optimization should focus.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="metric-label">Selected wallet</p>
                <span className="text-sm font-medium text-cyan">
                  {formatPercent(selectedWallet.monthlyChange)}
                </span>
              </div>
              <p className="mt-3 break-all text-sm text-white">
                {shortenAddress(selectedWallet.address, 10, 6)}
              </p>
            </div>
          </div>
        </aside>

        <div className="bottom-nav-safe space-y-4">
          <div className="surface-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ui-pill lg:hidden">
                    <CircleDollarSign className="h-3.5 w-3.5" />
                    ArcSpend
                  </span>
                  <span className="ui-pill">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {demoMode ? "Submission build active" : "Presentation mode paused"}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
                    {selectedWallet.network}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {selectedWallet.label}
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    {shortenAddress(displayWalletAddress, 10, 6)} | {formatCurrentDate()}
                  </p>
                  {walletError ? <p className="mt-2 text-sm text-rose-300">{walletError}</p> : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white">
                  {formatCompactCurrency(selectedWallet.totalBalance)}
                </div>
                {isWalletConnected ? (
                  <>
                    <div className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan">
                      Connected wallet
                    </div>
                    <button className="button-secondary" onClick={disconnectWallet} type="button">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    className="button-primary"
                    disabled={isConnecting}
                    onClick={() => void connectWallet()}
                    type="button"
                  >
                    {isConnecting ? "Connecting..." : "Connect wallet"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <main className="space-y-5">{children}</main>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-30 w-[min(92vw,560px)] -translate-x-1/2 rounded-[28px] border border-white/10 bg-slate-950/80 p-2 shadow-[0_24px_80px_rgba(2,8,23,0.55)] backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(pathname, item.href);

            return (
              <Link
                className={`flex flex-col items-center gap-1 rounded-[20px] px-2 py-3 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
