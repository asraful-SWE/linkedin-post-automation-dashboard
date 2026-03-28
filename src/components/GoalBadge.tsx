import type { PostGoal } from "@/types";

const goalConfig: Record<PostGoal, { label: string; color: string }> = {
  educational: { label: "📚 Educational", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  viral: { label: "🔥 Viral", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
  authority: { label: "👑 Authority", color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  story: { label: "📖 Story", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  engagement: { label: "💬 Engagement", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

interface GoalBadgeProps {
  goal?: PostGoal | string | null;
}

export default function GoalBadge({ goal }: GoalBadgeProps) {
  if (!goal) return null;
  const config = goalConfig[goal as PostGoal];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
