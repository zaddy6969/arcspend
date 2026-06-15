"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { CategoryTotal } from "@/types/transactions";
import { formatCurrency } from "@/lib/format";

const colors = ["#6ee7f9", "#84f0ca", "#f6c177", "#ff8f70", "#38bdf8", "#c084fc"];

export function CategoryBreakdownChart({ data }: { data: CategoryTotal[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-400">
        Category totals will appear here when transactions are available.
      </div>
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="total"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} key={entry.category} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15, 23, 40, 0.92)",
            }}
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            labelStyle={{ color: "#e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {data.map((item, index) => (
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-3" key={item.category}>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm font-medium text-white">{item.category}</span>
            </div>
            <p className="text-sm text-slate-400">
              {formatCurrency(item.total)} across {item.count} transactions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
