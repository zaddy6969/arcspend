import type { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ actions, badge, description, title }: PageHeaderProps) {
  return (
    <section className="shell-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="eyebrow">{badge}</span>
          <div className="space-y-3">
            <h1 className="section-title">{title}</h1>
            <p className="section-copy">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

