"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, FileText, X } from "lucide-react";
import GenerateButton from "@/components/GenerateButton";
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";
import ApproveRejectButtons from "@/components/ApproveRejectButtons";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ToastContainer from "@/components/Toast";
import ContentScoreBadge from "@/components/ContentScoreBadge";
import GoalBadge from "@/components/GoalBadge";
import { SkeletonTableRow } from "@/components/SkeletonCard";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/useToast";
import type { PostItem, PostStatus } from "@/types";

type FilterTab = "all" | PostStatus;
const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "published", label: "Published" },
  { key: "rejected", label: "Rejected" },
];

export default function PostsPage() {
  const {
    posts,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    refetch,
    removePost,
  } = usePosts("all");
  const toast = useToast();

  const [previewPost, setPreviewPost] = useState<PostItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    if (error) toast.error("Failed to load posts", error);
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = {
      all: posts.length,
      pending: 0,
      approved: 0,
      published: 0,
      rejected: 0,
    };
    for (const p of posts)
      base[p.status as PostStatus] = (base[p.status as PostStatus] ?? 0) + 1;
    return base;
  }, [posts]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setStatusFilter(tab === "all" ? undefined : (tab as PostStatus));
  };

  const handleActionCompleted = useCallback(
    (postId: number, action: "approved" | "rejected") => {
      removePost(postId);
      setPreviewPost(null);
      if (action === "approved")
        toast.success("Published! 🎉", "Post is now live on LinkedIn.");
      else toast.warning("Rejected", "Post has been rejected.");
    },
    [removePost, toast],
  );

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="space-y-6">
        <PageHeader
          title="Posts"
          description="Browse all generated posts and manage approvals."
          action={<GenerateButton onGenerated={refetch} />}
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  className={`ml-1.5 text-[11px] ${activeTab === tab.key ? "opacity-70" : "opacity-60"}`}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-800/50">
                  {[
                    "Topic / Goal",
                    "Content",
                    "Created",
                    "Score",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [0, 1, 2, 3, 4].map((i) => <SkeletonTableRow key={i} />)}
                {!loading &&
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
                          {post.topic}
                        </p>
                        <GoalBadge goal={post.post_goal} />
                      </td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="line-clamp-2 text-zinc-600 dark:text-zinc-300 text-xs">
                          {post.content}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <ContentScoreBadge score={post.content_score} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3">
                        {post.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewPost(post);
                              setPreviewImageUrl(post.image_url ?? "");
                              setPreviewImageFile(null);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            <Eye size={13} /> Review
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                {!loading && posts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16">
                      <EmptyState
                        icon={<FileText size={22} />}
                        title="No posts found"
                        description="Try a different filter or generate a new post."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
            {/* Modal header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-5 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Review Post #{previewPost.id}
                </h2>
                <p className="text-xs text-zinc-400">{previewPost.topic}</p>
              </div>
              <div className="flex items-center gap-2">
                <GoalBadge goal={previewPost.post_goal} />
                <ContentScoreBadge score={previewPost.content_score} />
                <button
                  type="button"
                  onClick={() => setPreviewPost(null)}
                  className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Content */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Content
                </p>
                <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                  {previewPost.content}
                </div>
              </div>

              {/* Image + Actions */}
              <ImageUpload
                imageUrl={previewImageUrl}
                onImageUrlChange={(v) => {
                  setPreviewImageUrl(v);
                  setPreviewImageFile(null);
                }}
                onFileChange={(f) => {
                  setPreviewImageFile(f);
                  if (f) setPreviewImageUrl("");
                }}
              />
              <ApproveRejectButtons
                postId={previewPost.id}
                imageUrl={previewImageUrl || undefined}
                imageFile={previewImageFile}
                onCompleted={handleActionCompleted}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
