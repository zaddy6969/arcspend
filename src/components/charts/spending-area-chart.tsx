"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FlowPoint } from "@/types/transactions";
import { formatCurrency } from "@/lib/format";

export function SpendingAreaChart({ data }: { data: FlowPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-400">
        Spend and inflow activity will appear here once the selected wallet has tracked movement.
      </div>
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spentGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#6ee7f9" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#6ee7f9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="receivedGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#84f0ca" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#84f0ca" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(value, name) => [
              formatCurrency(Number(value ?? 0)),
              name === "spent" ? "Spent" : "Received",
            ]}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Area
            dataKey="received"
            fill="url(#receivedGradient)"
            stroke="#84f0ca"
            strokeWidth={2}
            type="monotone"
          />
          <Area
            dataKey="spent"
            fill="url(#spentGradient)"
            stroke="#6ee7f9"
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
