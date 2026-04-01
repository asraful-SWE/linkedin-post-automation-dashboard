import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export default function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
