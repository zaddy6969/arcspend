"use client";

import { useState } from "react";
import { BellRing, Database, ShieldCheck, Sparkles, Stars } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  const { clearLocalData, demoMode, selectedWallet } = useAppState();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  return (
    <div className="space-y-5">
      <PageHeader
        badge="Settings"
        description="Review presentation-mode defaults, AI notifications, wallet context, and the local preferences that power your ArcSpend submission build."
        title="Preference controls that still feel premium"
      />

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card p-6 sm:p-8">
          <span className="ui-pill">
            <ShieldCheck className="h-3.5 w-3.5" />
            Workspace controls
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Core experience settings</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Presentation mode</p>
                  <p className="mt-2 text-sm text-slate-400">
                    ArcSpend stays locked to a curated portfolio scenario so the submission build
                    always opens in a polished, investor-ready state.
                  </p>
                </div>
                <span className="rounded-full bg-cyan px-4 py-2 text-sm font-medium text-slate-950">
                  {demoMode ? "Locked On" : "Paused"}
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Primary wallet</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Current default wallet is {selectedWallet.label}.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
                  Active
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start gap-4">
                <div className="icon-shell">
                  <Stars className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Recommended live demo flow</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Start on the landing page, open the dashboard, switch wallets, review
                    analytics, then walk through send/receive, swap, and bridge to show the
                    full product story in under two minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-5">
          <div className="surface-card p-6">
            <span className="ui-pill">
              <BellRing className="h-3.5 w-3.5" />
              AI notifications
            </span>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">Budget warnings</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Alert when any category crosses the healthy threshold.
                    </p>
                  </div>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium ${alertsEnabled ? "bg-cyan text-slate-950" : "bg-white/[0.08] text-slate-300"}`}
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    type="button"
                  >
                    {alertsEnabled ? "On" : "Off"}
                  </button>
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">Daily digest</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Receive the AI summary of spend, savings, and bridge activity.
                    </p>
                  </div>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium ${dailyDigest ? "bg-cyan text-slate-950" : "bg-white/[0.08] text-slate-300"}`}
                    onClick={() => setDailyDigest(!dailyDigest)}
                    type="button"
                  >
                    {dailyDigest ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <span className="ui-pill">
              <Database className="h-3.5 w-3.5" />
              Local state
            </span>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Reset demo preferences, selected wallet state, and cached wallet connection data if
              you want to return ArcSpend to a clean investor-demo state.
            </p>
            <button className="button-secondary mt-6" onClick={clearLocalData} type="button">
              Clear local state
            </button>
          </div>

          <div className="surface-card p-6">
            <span className="ui-pill">
              <Sparkles className="h-3.5 w-3.5" />
              AI recommendation
            </span>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Keep budget warnings and daily digest enabled for the strongest submission story,
              then use wallet switching and analytics as the main proof of product depth.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
