import type { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ actions, badge, description, title }: PageHeaderProps) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="ui-pill">{badge}</span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
