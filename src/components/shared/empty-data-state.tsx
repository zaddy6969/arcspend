import { DatabaseZap } from "lucide-react";

interface EmptyDataStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyDataState({
  actionLabel,
  description,
  onAction,
  title,
}: EmptyDataStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/40 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
        <DatabaseZap className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <button className="action-primary mt-6" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

