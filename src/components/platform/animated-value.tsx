"use client";

import { useEffect, useState } from "react";

interface AnimatedValueProps {
  value: number;
  variant?: "currency" | "number" | "percent";
  className?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}

function formatValue(
  value: number,
  variant: NonNullable<AnimatedValueProps["variant"]>,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
) {
  if (variant === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  if (variant === "percent") {
    return `${value >= 0 ? "+" : ""}${value.toFixed(maximumFractionDigits)}%`;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

export function AnimatedValue({
  value,
  variant = "number",
  className,
  minimumFractionDigits = 0,
  maximumFractionDigits = variant === "percent" ? 1 : 0,
  prefix = "",
  suffix = "",
}: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    let frameId = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;

      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {formatValue(
        displayValue,
        variant,
        minimumFractionDigits,
        maximumFractionDigits,
      )}
      {suffix}
    </span>
  );
}
