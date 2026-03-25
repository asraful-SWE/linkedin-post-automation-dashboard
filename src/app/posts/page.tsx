"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import GenerateButton from "@/components/GenerateButton";
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";
import ApproveRejectButtons from "@/components/ApproveRejectButtons";
import { getPosts, type PostItem, type PostStatus } from "@/lib/api";

type FilterTab = "all" | PostStatus;

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "published", label: "Published" },
  { key: "rejected", label: "Rejected" },
];

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [previewPost, setPreviewPost] = useState<PostItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts(activeTab === "all" ? undefined : activeTab);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const counts = useMemo(() => {
    const base = { all: posts.length, pending: 0, approved: 0, published: 0, rejected: 0 };
    for (const post of posts) {
      if (post.status in base) {
        base[post.status as PostStatus] += 1;
      }
    }
    return base;
  }, [posts]);

  const handleActionCompleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (previewPost?.id === postId) {
      setPreviewPost(null);
      setPreviewImageFile(null);
      setPreviewImageUrl("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Posts</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Browse generated posts and manage approval statuses.
          </p>
        </div>
        <GenerateButton onGenerated={fetchPosts} />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-80">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60">
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Topic</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Content</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Created</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{post.topic}</td>
                  <td className="max-w-105 px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    <p className="line-clamp-3 whitespace-pre-wrap">{post.content}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{new Date(post.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3">
                    {post.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => setPreviewPost(post)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400">No action</span>
                    )}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No posts found for selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Post Preview</h2>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Close
              </button>
            </div>

            <h3 className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">{previewPost.topic}</h3>
            <p className="mb-4 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300">
              {previewPost.content}
            </p>

            <div className="space-y-3">
              <ImageUpload
                imageUrl={previewImageUrl}
                onImageUrlChange={setPreviewImageUrl}
                onFileChange={setPreviewImageFile}
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
    </div>
  );
}
