"use client";

import { useState } from "react";
import type { PostItem } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";
import ApproveRejectButtons from "@/components/ApproveRejectButtons";

type PostCardProps = {
  post: PostItem;
  showActions?: boolean;
  onActionCompleted?: (postId: number, action: "approved" | "rejected") => void;
};

export default function PostCard({ post, showActions = true, onActionCompleted }: PostCardProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{post.topic}</h3>
          <p className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleString()}</p>
        </div>
        <StatusBadge status={post.status} />
      </div>

      <p className="mb-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">{post.content}</p>

      {showActions && post.status === "pending" && (
        <div className="space-y-3">
          <ImageUpload
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            onFileChange={setImageFile}
          />
          <ApproveRejectButtons
            postId={post.id}
            imageUrl={imageUrl || undefined}
            imageFile={imageFile}
            onCompleted={onActionCompleted}
          />
        </div>
      )}
    </article>
  );
}
