"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { useAppState } from "@/components/providers/app-state-provider";
import { demoTransactions } from "@/data/demo-transactions";

export default function SettingsPage() {
  const { demoMode } = useAppState();
  const transactions = demoMode ? demoTransactions : [];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Settings / Profile"
        description="Manage the wallet label, preferred display currency, CSV export, demo mode, and local app state for ArcSpend."
        title="Personalize the ArcSpend workspace"
      />
      <SettingsPanel transactions={transactions} />
    </div>
  );
}
