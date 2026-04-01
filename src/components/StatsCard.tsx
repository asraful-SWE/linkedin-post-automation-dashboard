import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type ColorVariant = "blue" | "emerald" | "amber" | "purple" | "rose";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: ColorVariant;
}

const colorConfig: Record<
  ColorVariant,
  { bg: string; iconBg: string; iconColor: string }
> = {
  blue: {
    bg: "bg-white dark:bg-zinc-900",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "bg-white dark:bg-zinc-900",
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-white dark:bg-zinc-900",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  purple: {
    bg: "bg-white dark:bg-zinc-900",
    iconBg: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  rose: {
    bg: "bg-white dark:bg-zinc-900",
    iconBg: "bg-rose-50 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
};

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
  color = "blue",
}: StatsCardProps) {
  const { bg, iconBg, iconColor } = colorConfig[color];

  return (
    <div
      className={`rounded-2xl border border-zinc-200 p-3 sm:p-4 lg:p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 ${bg}`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {typeof value === "number" && !Number.isInteger(value)
              ? value.toFixed(1)
              : value}
          </p>
          {(subtitle || trendValue) && (
            <div className="mt-2 flex items-center gap-1.5">
              {trend === "up" && (
                <TrendingUp size={13} className="text-emerald-500" />
              )}
              {trend === "down" && (
                <TrendingDown size={13} className="text-red-500" />
              )}
              {trend === "neutral" && (
                <Minus size={13} className="text-zinc-400" />
              )}
              <p
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : trend === "down"
                      ? "text-red-500 dark:text-red-400"
                      : "text-zinc-400"
                }`}
              >
                {trendValue ?? subtitle}
              </p>
            </div>
          )}
        </div>
        <div className={`shrink-0 rounded-xl p-3 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
