"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  TrendingUp,
  Clock,
  Zap,
  X,
  Loader2,
  AlertCircle,
  Newspaper,
} from "lucide-react";
import { 
  getTopContent, 
  getContent, 
  getContentStats,
  generatePostFromContent,
  runContentPipeline,
  markContentUsed,
  saveGeneratedPost,
} from "@/lib/api";
import type { 
  ContentItem, 
  ContentStatsResponse, 
  GeneratedPostResponse,
} from "@/types";
import PageHeader from "@/components/PageHeader";
import ContentCard from "@/components/content/ContentCard";
import ContentCardSkeleton from "@/components/content/ContentCardSkeleton";
import GeneratePostModal from "@/components/content/GeneratePostModal";
import FilterPanel from "@/components/content/FilterPanel";
import EmptyState from "@/components/EmptyState";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

type ViewMode = "top" | "all";
type SortBy = "score" | "date" | "source";

export default function ContentFeedPage() {
  // State
  const [items, setItems] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [viewMode, setViewMode] = useState<ViewMode>("top");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [showUsed, setShowUsed] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPostResponse | null>(null);
  const [generating, setGenerating] = useState(false);
  
  // Bookmarks (local state)
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  
  // Toast
  const { toasts, addToast, removeToast, success, error: errorToast, info } = useToast();
  
  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setError(null);
      
      const [contentRes, statsRes] = await Promise.all([
        viewMode === "top" 
          ? getTopContent({ limit: 50, min_score: minScore, unused_only: !showUsed })
          : getContent({ limit: 100, source: selectedSource || undefined }),
        getContentStats(),
      ]);
      
      setItems(contentRes.items);
      setStats(statsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
      errorToast("Failed to load content");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [viewMode, minScore, showUsed, selectedSource, errorToast]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Refresh content
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    success("Content refreshed");
  };
  
  // Run pipeline
  const handleRunPipeline = async () => {
    setPipelineRunning(true);
    try {
      const res = await runContentPipeline(true);
      if (res.success) {
        success("Pipeline started", res.message);
      } else {
        errorToast("Pipeline failed", res.message);
      }
      // Refresh after a short delay
      setTimeout(() => loadData(), 2000);
    } catch (err) {
      errorToast("Failed to start pipeline");
    } finally {
      setPipelineRunning(false);
    }
  };
  
  // Generate post
  const handleGeneratePost = async (content: ContentItem) => {
    setSelectedContent(content);
    setGenerating(true);
    setGeneratedPost(null);
    
    try {
      const res = await generatePostFromContent(content.id);
      setGeneratedPost(res);
      
      if (res.success) {
        success("Post generated!");
      } else {
        errorToast("Generation failed", res.error || undefined);
      }
    } catch (err) {
      errorToast("Failed to generate post");
      setSelectedContent(null);
    } finally {
      setGenerating(false);
    }
  };
  
  // Mark as used
  const handleMarkUsed = async (content: ContentItem) => {
    try {
      await markContentUsed(content.id);
      setItems(prev => prev.map(item => 
        item.id === content.id ? { ...item, used_for_post: true } : item
      ));
      success("Marked as used");
    } catch (err) {
      errorToast("Failed to mark as used");
    }
  };
  
  // Toggle bookmark
  const handleToggleBookmark = (content: ContentItem) => {
    setBookmarks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(content.id)) {
        newSet.delete(content.id);
        info("Removed from bookmarks");
      } else {
        newSet.add(content.id);
        success("Added to bookmarks");
      }
      return newSet;
    });
  };
  
  // Close modal
  const handleCloseModal = () => {
    setSelectedContent(null);
    setGeneratedPost(null);
    loadData(); // Refresh to update used status
  };
  
  // Save generated post to pending
  const handleSaveGeneratedPost = async (postContent: string, imageUrl?: string) => {
    if (!selectedContent || !generatedPost) {
      errorToast("Missing content or post data");
      return;
    }
    
    try {
      const res = await saveGeneratedPost(
        selectedContent.id,
        postContent,
        imageUrl,
        selectedContent.source,
      );
      
      if (res.success) {
        success(`Post saved! (ID: ${res.post_id})`);
        handleCloseModal();
      } else {
        errorToast("Failed to save post", res.error);
      }
    } catch (err) {
      errorToast("Error saving post");
      console.error(err);
    }
  };
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Source filter
    if (selectedSource) {
      result = result.filter(item => item.source === selectedSource);
    }
    
    // Score filter
    if (minScore > 0) {
      result = result.filter(item => item.score >= minScore);
    }
    
    // Used filter
    if (!showUsed) {
      result = result.filter(item => !item.used_for_post);
    }
    
    // Sort
    switch (sortBy) {
      case "score":
        result.sort((a, b) => b.score - a.score);
        break;
      case "date":
        result.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      case "source":
        result.sort((a, b) => a.source.localeCompare(b.source));
        break;
    }
    
    return result;
  }, [items, searchQuery, selectedSource, minScore, showUsed, sortBy]);
  
  // Available sources
  const sources = useMemo(() => {
    const sourceSet = new Set(items.map(item => item.source));
    return Array.from(sourceSet);
  }, [items]);
  
  return (
    <>
      <PageHeader
        title="Content Feed"
        description="Collected tech news and articles ready for LinkedIn posts"
        icon={<Newspaper className="text-blue-600" size={24} />}
      />
      
      {/* Stats Bar */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Total</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Avg Score</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.average_score.toFixed(1)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Processed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.by_status?.processed || 0}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500">Sources</p>
            <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.by_source).length}</p>
          </div>
        </div>
      )}
      
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
            <button
              onClick={() => setViewMode("top")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "top"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <TrendingUp size={14} />
              Top
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "all"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Clock size={14} />
              Recent
            </button>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
              showFilters
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            <Filter size={14} />
            Filters
          </button>
          
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          
          {/* Run Pipeline */}
          <button
            onClick={handleRunPipeline}
            disabled={pipelineRunning}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {pipelineRunning ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} />
            )}
            Fetch New
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          sources={sources}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          showUsed={showUsed}
          onShowUsedChange={setShowUsed}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      )}
      
      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-12 dark:border-red-900 dark:bg-red-950/20">
          <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching content" : "No content yet"}
          description={searchQuery ? "Try different search terms" : "Click 'Fetch New' to collect content from sources"}
          icon={<Newspaper className="h-6 w-6" />}
          action={
            !searchQuery && (
              <button
                onClick={handleRunPipeline}
                disabled={pipelineRunning}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Fetch Content
              </button>
            )
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-500">
            Showing {filteredItems.length} of {items.length} items
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                isBookmarked={bookmarks.has(item.id)}
                onGeneratePost={() => handleGeneratePost(item)}
                onMarkUsed={() => handleMarkUsed(item)}
                onToggleBookmark={() => handleToggleBookmark(item)}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Generate Post Modal */}
      {selectedContent && (
        <GeneratePostModal
          content={selectedContent}
          generatedPost={generatedPost}
          isGenerating={generating}
          onClose={handleCloseModal}
          onRegenerate={() => handleGeneratePost(selectedContent)}
          onSave={handleSaveGeneratedPost}
        />
      )}
      
      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
