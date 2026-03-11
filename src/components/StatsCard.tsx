import { type ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({ title, value, icon, subtitle, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
          {subtitle && (
            <p className={`text-xs font-medium ${
              trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-zinc-400"
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
