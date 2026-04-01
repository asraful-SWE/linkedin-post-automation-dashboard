interface ContentScoreBadgeProps {
  score?: number | null;
  size?: "sm" | "md";
}

function getScoreColor(score: number) {
  if (score >= 8) return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
  if (score >= 6) return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
  if (score >= 4) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
  return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
}

export default function ContentScoreBadge({ score, size = "sm" }: ContentScoreBadgeProps) {
  if (score == null || score === 0) return null;
  const rounded = Math.round(score * 10) / 10;
  const colorClass = getScoreColor(score);
  const sizeClass = size === "sm" ? "px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs" : "px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${colorClass} ${sizeClass}`}
      title={`Content quality score: ${rounded}/10`}
    >
      ★ {rounded}
    </span>
  );
}
