"use client";

import { useState, useCallback, useEffect } from "react";
import { getPosts } from "@/lib/api";
import type { PostItem, PostStatus } from "@/types";

export function usePosts(initialStatus?: PostStatus | "all") {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all" | undefined>(
    initialStatus
  );

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts(statusFilter);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const removePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const updatePost = useCallback((postId: number, updates: Partial<PostItem>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  }, []);

  return {
    posts,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    refetch: fetch,
    removePost,
    updatePost,
  };
}
