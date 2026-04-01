"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { approvePost, rejectPost } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

type ApproveRejectButtonsProps = {
  postId: number;
  imageUrl?: string;
  imageFile?: File | null;
  onCompleted?: (postId: number, action: "approved" | "rejected") => void;
};

export default function ApproveRejectButtons({
  postId,
  imageUrl,
  imageFile,
  onCompleted,
}: ApproveRejectButtonsProps) {
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeAction = async (action: "approve" | "reject") => {
    setLoadingAction(action);
    setMessage(null);
    setError(null);
    setConfirmAction(null);
    try {
      if (action === "approve") {
        await approvePost({ postId, imageUrl, imageFile });
        setMessage("✓ Post approved and published to LinkedIn.");
        onCompleted?.(postId, "approved");
      } else {
        await rejectPost(postId);
        setMessage("Post has been rejected.");
        onCompleted?.(postId, "rejected");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${action} post.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const disabled = loadingAction !== null;

  return (
    <>
      <ConfirmDialog
        open={confirmAction === "approve"}
        title="Approve & Publish?"
        message={`This will publish post #${postId} to LinkedIn${imageUrl || imageFile ? " with the selected image" : " as text-only"}.`}
        confirmLabel="Approve & Publish"
        variant="default"
        loading={loadingAction === "approve"}
        onConfirm={() => executeAction("approve")}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "reject"}
        title="Reject Post?"
        message={`Post #${postId} will be rejected and won't be published.`}
        confirmLabel="Reject"
        variant="danger"
        loading={loadingAction === "reject"}
        onConfirm={() => executeAction("reject")}
        onCancel={() => setConfirmAction(null)}
      />

      <div className="space-y-2 sm:space-y-3">
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setConfirmAction("approve")}
            disabled={disabled}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            {loadingAction === "approve" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            <span className="hidden sm:inline">Approve & Publish</span><span className="sm:hidden">Approve</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction("reject")}
            disabled={disabled}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 transition-colors dark:border-red-800 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950"
          >
            {loadingAction === "reject" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <X size={15} />
            )}
            Reject
          </button>
        </div>
        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
