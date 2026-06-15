import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}

export function SummaryCard({ icon: Icon, label, note, value }: SummaryCardProps) {
  return (
    <article className="shell-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="metric-label">{label}</p>
          <p className="text-3xl font-semibold text-white">{value}</p>
          <p className="text-sm leading-7 text-slate-400">{note}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

