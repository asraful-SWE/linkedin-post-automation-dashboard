"use client";

import { X } from "lucide-react";

type SortBy = "score" | "date" | "source";

interface FilterPanelProps {
  sources: string[];
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  showUsed: boolean;
  onShowUsedChange: (show: boolean) => void;
  sortBy: SortBy;
  onSortByChange: (sort: SortBy) => void;
}

const sourceLabels: Record<string, string> = {
  hackernews: "Hacker News",
  reddit: "Reddit",
  devto: "Dev.to",
  medium: "Medium",
  techcrunch: "TechCrunch",
};

export default function FilterPanel({
  sources,
  selectedSource,
  onSourceChange,
  minScore,
  onMinScoreChange,
  showUsed,
  onShowUsedChange,
  sortBy,
  onSortByChange,
}: FilterPanelProps) {
  const handleClearFilters = () => {
    onSourceChange(null);
    onMinScoreChange(0);
    onShowUsedChange(false);
    onSortByChange("score");
  };
  
  const hasFilters = selectedSource || minScore > 0 || showUsed || sortBy !== "score";
  
  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-4">
        {/* Source Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Source</label>
          <select
            value={selectedSource || ""}
            onChange={(e) => onSourceChange(e.target.value || null)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {sourceLabels[source] || source}
              </option>
            ))}
          </select>
        </div>
        
        {/* Min Score */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">
            Min Score: {minScore}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="h-2 w-32 cursor-pointer accent-blue-600"
          />
        </div>
        
        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="score">Score</option>
            <option value="date">Date</option>
            <option value="source">Source</option>
          </select>
        </div>
        
        {/* Show Used Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showUsed"
            checked={showUsed}
            onChange={(e) => onShowUsedChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showUsed" className="text-xs text-zinc-600 dark:text-zinc-400">
            Show used
          </label>
        </div>
        
        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
