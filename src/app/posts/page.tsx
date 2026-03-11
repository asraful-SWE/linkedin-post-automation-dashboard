"use client";

import { useEffect, useState } from "react";
import {
  getDashboard,
  getRecommendedTopics,
  type DashboardResponse,
} from "@/lib/api";
import GenerateButton from "@/components/GenerateButton";
import { Loader2, Sparkles } from "lucide-react";

export default function PostsPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getDashboard().catch(() => null),
      getRecommendedTopics().catch(() => []),
    ])
      .then(([dashData, recData]) => {
        setDashboard(dashData);
        setRecommended(recData);
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        {error}
      </div>
    );
  }

  const recentActivity = dashboard?.recent_activity ?? [];
  const topicBreakdown = dashboard?.overview?.topic_breakdown ?? [];
  const overview = dashboard?.overview?.overview;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Posts</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {overview ? `${overview.total_posts} total posts across ${overview.total_topics_used} topics` : "Manage and monitor posts"}
          </p>
        </div>
        <GenerateButton />
      </div>

      {/* Recommended topics */}
      {recommended.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <Sparkles size={16} className="text-amber-500" /> Recommended Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {recommended.map((topic) => (
              <span key={topic} className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Topic breakdown as posts overview */}
      {topicBreakdown.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Posts by Topic</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Topic</th>
                  <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Posts</th>
                  <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Avg Score</th>
                  <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topicBreakdown.map((t, i) => (
                  <tr key={i} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
                    <td className="px-6 py-3">
                      <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {t.topic}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{t.posts}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        t.avg_score >= 15
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.avg_score >= 8
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}>
                        {t.avg_score}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs capitalize text-zinc-500 dark:text-zinc-400">{t.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${act.success ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{act.topic}</p>
                    <p className="text-xs text-zinc-400">{act.action.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400">{new Date(act.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topicBreakdown.length === 0 && recentActivity.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">No posts yet. Use the button above to generate your first post!</p>
        </div>
      )}
    </div>
  );
}
