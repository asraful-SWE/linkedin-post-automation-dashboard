"use client";

import { useState } from "react";
import { triggerManualPost } from "@/lib/api";
import { Loader2, Zap } from "lucide-react";

export default function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await triggerManualPost();
      setResult({ success: res.success, message: res.message || "Post generated successfully!" });
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Failed to generate post." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap size={16} />
            Generate Post Now
          </>
        )}
      </button>
      {result && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            result.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
