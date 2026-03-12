"use client";

import { useEffect, useState } from "react";
import { getCommentStatus, triggerCommentCheck, type CommentStatus } from "@/lib/api";
import { MessageSquareReply, RefreshCw, Loader2, CheckCircle2, Clock } from "lucide-react";

export default function CommentCard() {
  const [status, setStatus] = useState<CommentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState<{ success: boolean; message: string } | null>(null);

  async function fetchStatus() {
    try {
      const data = await getCommentStatus();
      setStatus(data);
    } catch {
      // backend may not be reachable — silently ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  async function handleCheck() {
    setChecking(true);
    setToast(null);
    try {
      await triggerCommentCheck();
      setToast({ success: true, message: "Comment check started! Replies will be posted shortly." });
      // Refresh stats after a short delay
      setTimeout(fetchStatus, 3000);
    } catch {
      setToast({ success: false, message: "Failed to trigger comment check." });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <MessageSquareReply size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Auto Comment Reply</h2>
            <p className="text-xs text-zinc-400">AI replies to comments on your posts</p>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={checking}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checking ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw size={13} />
              Check Now
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <CheckCircle2 size={12} />
              Total Replied
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {status?.total_comments_replied ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Clock size={12} />
              Last 24h
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {status?.replied_in_last_24h ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <RefreshCw size={12} />
              Check Interval
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {status?.check_interval_hours ?? 2}h
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <MessageSquareReply size={12} />
              Auto Reply
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold mt-0.5 ${
                status?.auto_reply_enabled
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status?.auto_reply_enabled ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {status?.auto_reply_enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            toast.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
