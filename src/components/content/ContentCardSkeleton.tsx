export default function ContentCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Image skeleton */}
      <div className="h-40 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      
      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        
        {/* Title */}
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        
        {/* Summary */}
        <div className="mb-1 h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="mb-1 h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="mb-4 h-3 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        
        {/* Tags */}
        <div className="mb-4 flex gap-1">
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-14 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-10 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
        
        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
