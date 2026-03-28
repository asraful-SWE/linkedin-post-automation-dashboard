"use client";

import { useState } from "react";
import { generatePost } from "@/lib/api";
import { useAutoImages } from "@/hooks/useAutoImages";
import { Loader2, Zap, ChevronDown } from "lucide-react";
import type { PostGoal } from "@/types";

const GOALS: { value: PostGoal; label: string }[] = [
  { value: "educational", label: "📚 Educational" },
  { value: "viral", label: "🔥 Viral" },
  { value: "authority", label: "👑 Authority" },
  { value: "story", label: "📖 Story" },
  { value: "engagement", label: "💬 Engagement" },
];

type GenerateButtonProps = {
  onGenerated?: () => void;
};

export default function GenerateButton({ onGenerated }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<PostGoal>("educational");
  const [showGoals, setShowGoals] = useState(false);
  const { enabled: autoImagesEnabled, setAutoImages } = useAutoImages();

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await generatePost(undefined, selectedGoal, autoImagesEnabled);
      const message =
        res.message ??
        (res.success
          ? "Post generated and sent for approval."
          : "Failed to generate post.");
      setResult({ success: res.success, message });
      if (res.success) onGenerated?.();
    } catch (err) {
      setResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to generate post.",
      });
    } finally {
      setLoading(false);
      setShowGoals(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-l-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Zap size={15} /> Generate Post
            </>
          )}
        </button>
        <div className="relative">
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowGoals((s) => !s)}
            className="inline-flex h-full items-center rounded-r-xl border-l border-blue-700 bg-blue-600 px-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
            aria-label="Select goal"
          >
            <ChevronDown size={14} />
          </button>
          {showGoals && (
            <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(g.value);
                    setShowGoals(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    selectedGoal === g.value
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected goal display */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-zinc-400">
          Goal:{" "}
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            {GOALS.find((g) => g.value === selectedGoal)?.label}
          </span>
        </p>

        <label className="inline-flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          Auto Images
          <button
            type="button"
            aria-label="Toggle auto images"
            aria-pressed={autoImagesEnabled}
            onClick={() => setAutoImages(!autoImagesEnabled)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              autoImagesEnabled
                ? "bg-emerald-500"
                : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                autoImagesEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {result && (
        <div
          className={`rounded-xl border px-3 py-2.5 text-sm ${
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
