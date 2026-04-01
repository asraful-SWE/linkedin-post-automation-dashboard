"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Image as ImageIcon, AlertCircle } from "lucide-react";
import type { PostItem } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";
import ApproveRejectButtons from "@/components/ApproveRejectButtons";
import ContentScoreBadge from "@/components/ContentScoreBadge";
import GoalBadge from "@/components/GoalBadge";

const PREVIEW_LENGTH = 200;

type PostCardProps = {
  post: PostItem;
  showActions?: boolean;
  onActionCompleted?: (postId: number, action: "approved" | "rejected") => void;
};

export default function PostCard({
  post,
  showActions = true,
  onActionCompleted,
}: PostCardProps) {
  const [imageUrl, setImageUrl] = useState(post.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expanded, setExpanded] = useState(false);

  const isLong = post.content.length > PREVIEW_LENGTH;
  const displayContent =
    isLong && !expanded
      ? post.content.slice(0, PREVIEW_LENGTH) + "…"
      : post.content;

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {post.topic}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <GoalBadge goal={post.post_goal} />
          <ContentScoreBadge score={post.content_score} />
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Content with smooth expand/collapse */}
      <div className="mb-3 sm:mb-4 transition-all duration-300 ease-in-out">
        <p className="whitespace-pre-wrap text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-700 dark:text-zinc-300">
          {displayContent}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {expanded ? (
              <>
                <ChevronUp size={13} /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={13} /> Show more
              </>
            )}
          </button>
        )}
      </div>

      

      {/* Existing image */}
      {post.image_url && post.status !== "pending" && (
        <div className="mb-3 sm:mb-4 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 sm:px-4 py-2 sm:py-3 dark:bg-zinc-800/50">
          <ImageIcon size={13} className="text-zinc-400" />
          <a
            href={post.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            {post.image_url}
          </a>
        </div>
      )}

      {/* Actions */}
      {showActions && post.status === "pending" && (
        <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 border-t border-zinc-100 pt-4 sm:pt-5 dark:border-zinc-800">
          <ImageUpload
            imageUrl={imageUrl}
            onImageUrlChange={(val) => {
              setImageUrl(val);
              setImageFile(null);
            }}
            onFileChange={(f) => {
              setImageFile(f);
              if (f) setImageUrl("");
            }}
          />
          <ApproveRejectButtons
            postId={post.id}
            imageUrl={imageUrl || undefined}
            imageFile={imageFile}
            onCompleted={onActionCompleted}
          />
        </div>
      )}

      {/* LinkedIn ID */}
      {post.linkedin_post_id && (
        <p className="mt-2 sm:mt-3 text-[10px] text-zinc-400">
          LinkedIn ID: {post.linkedin_post_id}
        </p>
      )}
    </article>
  );
}
