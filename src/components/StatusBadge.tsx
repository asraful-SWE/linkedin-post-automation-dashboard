import type { PostStatus } from "@/types";

type StatusBadgeProps = { status: PostStatus };

const config: Record<
  PostStatus,
  { dot: string; badge: string; label: string }
> = {
  pending: {
    dot: "bg-amber-400",
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    label: "Pending",
  },
  approved: {
    dot: "bg-blue-400",
    badge:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    label: "Approved",
  },
  published: {
    dot: "bg-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    label: "Published",
  },
  rejected: {
    dot: "bg-red-400",
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    label: "Rejected",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { dot, badge, label } = config[status] ?? config.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
