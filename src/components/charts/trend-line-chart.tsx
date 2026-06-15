"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { FlowPoint } from "@/types/transactions";

interface TrendLineChartProps {
  data: FlowPoint[];
  height?: number;
}

export function TrendLineChart({
  data,
  height = 320,
}: TrendLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] text-sm text-slate-400" style={{ height }}>
        Trend data will appear here once wallet activity is available.
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(value) => formatCompactCurrency(Number(value ?? 0))}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "20px",
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(8, 15, 28, 0.94)",
              boxShadow: "0 30px 80px rgba(2, 8, 23, 0.45)",
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value ?? 0)),
              name === "spent"
                ? "Spent"
                : name === "received"
                  ? "Received"
                  : "Savings",
            ]}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Line
            dataKey="received"
            dot={false}
            stroke="#67e8f9"
            strokeLinecap="round"
            strokeWidth={3}
            type="monotone"
          />
          <Line
            dataKey="spent"
            dot={false}
            stroke="#fb7185"
            strokeLinecap="round"
            strokeWidth={3}
            type="monotone"
          />
          <Line
            dataKey="savings"
            dot={false}
            stroke="#fbbf24"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
