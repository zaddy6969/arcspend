interface PanelSkeletonProps {
  className?: string;
  lines?: number;
}

export function PanelSkeleton({
  className = "",
  lines = 4,
}: PanelSkeletonProps) {
  return (
    <div className={`surface-card ${className}`}>
      <div className="space-y-3">
        <div className="skeleton-line h-4 w-28" />
        <div className="skeleton-line h-10 w-2/3" />
        <div className="grid gap-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div className="skeleton-line h-3 w-full" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
