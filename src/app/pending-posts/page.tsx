"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import GenerateButton from "@/components/GenerateButton";
import PostCard from "@/components/PostCard";
import type { PostItem } from "@/lib/api";
import { getPosts } from "@/lib/api";

export default function PendingPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingPosts = useCallback(async () => {
    try {
      setError(null);
      const data = await getPosts("pending");
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch pending posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingPosts();
  }, [fetchPendingPosts]);

  const pendingCount = useMemo(() => posts.length, [posts]);

  const handleActionCompleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Pending Posts</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Review pending posts, then approve or reject them.
          </p>
        </div>
        <GenerateButton onGenerated={fetchPendingPosts} />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <span className="font-semibold">{pendingCount}</span> post(s) waiting for approval
        </p>
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

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <MailCheck className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No pending posts right now.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showActions onActionCompleted={handleActionCompleted} />
          ))}
        </div>
      )}
    </div>
  );
}
