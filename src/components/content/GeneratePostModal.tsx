"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import type { ContentItem, GeneratedPostResponse } from "@/types";
import Image from "next/image";

interface GeneratePostModalProps {
  content: ContentItem;
  generatedPost: GeneratedPostResponse | null;
  isGenerating: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  onSave?: (postContent: string, imageUrl?: string) => Promise<void>;
}

export default function GeneratePostModal({
  content,
  generatedPost,
  isGenerating,
  onClose,
  onRegenerate,
  onSave,
}: GeneratePostModalProps) {
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (generatedPost?.post_content) {
      setEditedContent(generatedPost.post_content);
    }
  }, [generatedPost?.post_content]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  
  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      const imageUrl = generatedPost?.image_url || content.image_url || undefined;
      await onSave(editedContent, imageUrl);
    } catch (err) {
      console.error("Failed to save post:", err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const imageUrl = generatedPost?.image_url || content.image_url || undefined;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Generate LinkedIn Post
            </h2>
            <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500">
              {content.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Generating your LinkedIn post...
              </p>
            </div>
          ) : generatedPost?.success ? (
            <div className="space-y-6">
              {/* Image Preview */}
              {imageUrl && (
                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={imageUrl}
                      alt="Post image"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center gap-2 border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
                    <ImageIcon size={14} className="text-zinc-400" />
                    <span className="text-xs text-zinc-500">Image will be attached to post</span>
                  </div>
                </div>
              )}
              
              {/* Post Content */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Post Content
                  </label>
                  <span className="text-xs text-zinc-500">
                    {editedContent.length} characters
                  </span>
                </div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={12}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="Generated post content..."
                />
              </div>
              
              {/* Source Link */}
              <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                <ExternalLink size={14} className="text-zinc-400" />
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate text-xs text-blue-600 hover:underline"
                >
                  {content.url}
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <p className="mt-4 text-sm font-medium text-red-600">
                Failed to generate post
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {generatedPost?.error || "An unexpected error occurred"}
              </p>
              <button
                onClick={onRegenerate}
                className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {generatedPost?.success && (
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
