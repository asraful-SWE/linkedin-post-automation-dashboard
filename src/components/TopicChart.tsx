"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopicData {
  topic: string;
  engagement: number;
}

interface TopicChartProps {
  data: TopicData[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

export default function TopicChart({ data }: TopicChartProps) {
  const sorted = [...data].sort((a, b) => b.engagement - a.engagement).slice(0, 8);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Top Performing Topics</h3>
      {sorted.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400">No topic data available.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="topic"
                tick={{ fontSize: 12, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#fafafa",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="engagement" radius={[0, 6, 6, 0]} barSize={24}>
                {sorted.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
