export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 lg:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-8 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2 sm:gap-3">
        <div className="space-y-2 sm:space-y-3 flex-1">
          <div className="h-4 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="space-y-2 sm:space-y-3 mb-4">
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-4/6 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="animate-pulse border-b border-zinc-100 dark:border-zinc-800">
      <td className="px-4 py-3">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
      </td>
      <td className="px-4 py-3">
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </td>
    </tr>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Block */}
      <div className="h-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
      {/* Chart */}
      <div className="h-72 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
