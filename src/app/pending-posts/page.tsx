"use client";

import { useCallback, useEffect } from "react";
import { MailCheck, RefreshCw } from "lucide-react";
import GenerateButton from "@/components/GenerateButton";
import PostCard from "@/components/PostCard";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ToastContainer from "@/components/Toast";
import { SkeletonPostCard } from "@/components/SkeletonCard";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/useToast";

export default function PendingPostsPage() {
  const { posts, loading, error, refetch, removePost } = usePosts("pending");
  const toast = useToast();

  useEffect(() => {
    if (error) toast.error("Failed to load posts", error);
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleActionCompleted = useCallback(
    (postId: number, action: "approved" | "rejected") => {
      removePost(postId);
      if (action === "approved") {
        toast.success(
          "Post Published! 🎉",
          "Your post is now live on LinkedIn.",
        );
      } else {
        toast.warning(
          "Post Rejected",
          "The post has been removed from pending.",
        );
      }
    },
    [removePost, toast],
  );

  const handleGenerated = useCallback(() => {
    refetch();
    toast.success("Post Generated!", "New post sent for approval.");
  }, [refetch, toast]);

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Pending Posts"
          description="Review and approve or reject AI-generated posts."
          badge={
            !loading && posts.length > 0 ? (
              <span className="rounded-full bg-amber-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {posts.length}
              </span>
            ) : undefined
          }
          action={
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={refetch}
                className="rounded-lg border border-zinc-200 bg-white p-2.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 min-h-10 min-w-10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={18} className="sm:size-[15px]" />
              </button>
              <GenerateButton onGenerated={handleGenerated} />
            </div>
          }
        />

        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonPostCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <EmptyState
            icon={<MailCheck size={24} />}
            title="No pending posts"
            description="All clear! Generate a new post to get started."
            action={<GenerateButton onGenerated={handleGenerated} />}
          />
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" style={{ gridAutoRows: 'max-content' }}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions
                onActionCompleted={handleActionCompleted}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
