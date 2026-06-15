"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailySpendPoint } from "@/types/transactions";
import { formatCurrency } from "@/lib/format";

export function DailySpendingChart({ data }: { data: DailySpendPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-400">
        Daily spending bars will appear once a month has transaction data.
      </div>
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15, 23, 40, 0.92)",
            }}
            formatter={(value) => [formatCurrency(Number(value ?? 0)), "Daily Spend"]}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Bar dataKey="spent" fill="#6ee7f9" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
