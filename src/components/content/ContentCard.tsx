"use client";

import { ExternalLink, Bookmark, BookmarkCheck, Sparkles, CheckCircle, Clock, Tag } from "lucide-react";
import type { ContentItem } from "@/types";
import Image from "next/image";

interface ContentCardProps {
  content: ContentItem;
  isBookmarked?: boolean;
  onGeneratePost: () => void;
  onMarkUsed: () => void;
  onToggleBookmark: () => void;
}

const sourceColors: Record<string, string> = {
  hackernews: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  reddit: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  devto: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  medium: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  techcrunch: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const sourceLabels: Record<string, string> = {
  hackernews: "Hacker News",
  reddit: "Reddit",
  devto: "Dev.to",
  medium: "Medium",
  techcrunch: "TechCrunch",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500 text-white";
  if (score >= 60) return "bg-blue-500 text-white";
  if (score >= 40) return "bg-yellow-500 text-white";
  return "bg-zinc-400 text-white";
}

function formatTimeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ContentCard({
  content,
  isBookmarked = false,
  onGeneratePost,
  onMarkUsed,
  onToggleBookmark,
}: ContentCardProps) {
  const sourceColor = sourceColors[content.source] || "bg-zinc-100 text-zinc-700";
  const sourceLabel = sourceLabels[content.source] || content.source;
  const scoreColor = getScoreColor(content.score);
  
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Image */}
      {content.image_url && (
        <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={content.image_url}
            alt={content.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sourceColor}`}>
              {sourceLabel}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor}`}>
              {content.score.toFixed(0)}
            </span>
            {content.used_for_post && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                <CheckCircle size={10} />
                Used
              </span>
            )}
          </div>
          <button
            onClick={onToggleBookmark}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} className="text-blue-600" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
        
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white">
          {content.title}
        </h3>
        
        {/* Summary */}
        {content.summary && (
          <p className="mb-3 line-clamp-3 flex-1 text-xs text-zinc-600 dark:text-zinc-400">
            {content.summary}
          </p>
        )}
        
        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {content.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-0.5 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
            {content.tags.length > 4 && (
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800">
                +{content.tags.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Meta */}
        <div className="mb-3 flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatTimeAgo(content.published_at || content.created_at)}
          </span>
          {content.author && (
            <span className="truncate">by {content.author}</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={onGeneratePost}
            disabled={content.used_for_post}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={14} />
            Generate Post
          </button>
          
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            title="Open original"
          >
            <ExternalLink size={14} />
          </a>
          
          {!content.used_for_post && (
            <button
              onClick={onMarkUsed}
              className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              title="Mark as used"
            >
              <CheckCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
