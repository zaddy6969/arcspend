interface HealthRingProps {
  score: number;
  label?: string;
}

export function HealthRing({ score, label = "Health score" }: HealthRingProps) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(score, 100)) / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="-rotate-90" height="112" viewBox="0 0 112 112" width="112">
        <circle
          cx="56"
          cy="56"
          fill="transparent"
          r={radius}
          stroke="rgba(148, 163, 184, 0.16)"
          strokeWidth="10"
        />
        <circle
          cx="56"
          cy="56"
          fill="transparent"
          r={radius}
          stroke="url(#healthRingGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
        <defs>
          <linearGradient id="healthRingGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="55%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold text-white">{score}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}
