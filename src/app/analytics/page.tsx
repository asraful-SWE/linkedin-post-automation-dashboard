"use client";

import { useEffect, useState } from "react";
import {
  getEngagementAnalytics,
  getTopicInsights,
  type EngagementDashboard,
  type TopicInsights,
} from "@/lib/api";
import TopicChart from "@/components/TopicChart";
import { Loader2, TrendingUp, TrendingDown, Lightbulb } from "lucide-react";

export default function AnalyticsPage() {
  const [engagement, setEngagement] = useState<EngagementDashboard | null>(null);
  const [insights, setInsights] = useState<TopicInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getEngagementAnalytics().catch(() => null),
      getTopicInsights().catch(() => null),
    ])
      .then(([engData, insData]) => {
        setEngagement(engData);
        setInsights(insData);
      })
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
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

  const topicBreakdown = engagement?.topic_breakdown ?? [];
  const topicData = topicBreakdown.map((t) => ({
    topic: t.topic,
    engagement: t.avg_score * t.posts,
  }));

  const topPerformers = engagement?.top_performing_topics ?? [];
  const improvements = engagement?.improvement_opportunities ?? [];
  const frequency = engagement?.posting_frequency;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Engagement trends and performance insights</p>
      </div>

      {/* Overview stats */}
      {engagement?.overview && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Posts", value: engagement.overview.total_posts },
            { label: "Avg Engagement", value: engagement.overview.average_engagement_score },
            { label: "Topics Used", value: engagement.overview.total_topics_used },
            { label: "Posts Today", value: engagement.overview.posts_today },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs text-zinc-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top performing topics */}
      {topPerformers.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <TrendingUp size={16} className="text-emerald-500" /> Top Performing Topics
          </h2>
          <div className="space-y-3">
            {topPerformers.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/40">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.topic}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {t.avg_score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic breakdown chart */}
      <TopicChart data={topicData} />

      {/* Topic breakdown table */}
      {topicBreakdown.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Topic Breakdown</h2>
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
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{t.topic}</td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{t.posts}</td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{t.avg_score}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.trend === "improving"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.trend === "declining"
                          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {t.trend === "improving" && <TrendingUp size={12} />}
                        {t.trend === "declining" && <TrendingDown size={12} />}
                        {t.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Improvement opportunities */}
      {improvements.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
            <Lightbulb size={16} /> Improvement Opportunities
          </h2>
          <div className="space-y-2">
            {improvements.map((imp, i) => (
              <div key={i} className="rounded-xl bg-white/60 px-4 py-3 dark:bg-zinc-900/40">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{imp.topic}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{imp.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posting frequency */}
      {frequency && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Posting Frequency</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{frequency.recommendation}</p>
          <p className="mt-2 text-xs text-zinc-400">
            Optimal: {frequency.optimal_daily_posts} post(s)/day &middot; Today: {frequency.today_posts}
          </p>
        </div>
      )}

      {/* Unused topics from insights */}
      {insights && insights.unused_topics.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Unused Topics</h2>
          <div className="flex flex-wrap gap-2">
            {insights.unused_topics.map((topic) => (
              <span key={topic} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
