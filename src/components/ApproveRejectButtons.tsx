"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { approvePost, rejectPost } from "@/lib/api";

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
  const [loadingAction, setLoadingAction] = useState<"approve" | "reject" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoadingAction("approve");
    setMessage(null);
    setError(null);
    try {
      await approvePost({ postId, imageUrl, imageFile });
      setMessage("Post approved and published.");
      onCompleted?.(postId, "approved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve post.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async () => {
    setLoadingAction("reject");
    setMessage(null);
    setError(null);
    try {
      await rejectPost(postId);
      setMessage("Post rejected.");
      onCompleted?.(postId, "rejected");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject post.");
    } finally {
      setLoadingAction(null);
    }
  };

  const disabled = loadingAction !== null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "approve" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          Approve
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "reject" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          Reject
        </button>
      </div>
      {message && <p className="text-xs text-emerald-600">{message}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
