import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center">
      <section className="surface-card mx-auto w-full max-w-3xl p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
          <Compass className="h-6 w-6 text-cyan" />
        </div>
        <span className="ui-pill mt-6">
          <Sparkles className="h-3.5 w-3.5" />
          ArcSpend routing error
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          This page is off the portfolio map.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          The page you were looking for does not exist anymore, but the core ArcSpend flows are
          all still available from the main dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="button-primary" href="/dashboard">
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="button-secondary" href="/analytics">
            View analytics
          </Link>
        </div>
      </section>
    </main>
  );
}
