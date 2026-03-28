"use client";

import { useEffect, useState } from "react";
import {
  getEngagementAnalytics,
  getTopicInsights,
  getTopicPredictions,
  getTrendingTopics,
} from "@/lib/api";
import TopicChart from "@/components/TopicChart";
import PageHeader from "@/components/PageHeader";
import ToastContainer from "@/components/Toast";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/useToast";
import type {
  EngagementDashboard,
  TopicInsights,
  TopicPrediction,
} from "@/types";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  BarChart3,
  Target,
  Flame,
} from "lucide-react";

export default function AnalyticsPage() {
  const [engagement, setEngagement] = useState<EngagementDashboard | null>(
    null,
  );
  const [insights, setInsights] = useState<TopicInsights | null>(null);
  const [predictions, setPredictions] = useState<TopicPrediction[]>([]);
  const [trending, setTrending] = useState<TopicPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.allSettled([
      getEngagementAnalytics(),
      getTopicInsights(),
      getTopicPredictions(5).catch(() => []),
      getTrendingTopics(6).catch(() => []),
    ])
      .then(([engR, insR, predR, trendR]) => {
        if (engR.status === "fulfilled") setEngagement(engR.value);
        if (insR.status === "fulfilled") setInsights(insR.value);
        if (predR.status === "fulfilled")
          setPredictions(predR.value as TopicPrediction[]);
        if (trendR.status === "fulfilled")
          setTrending(trendR.value as TopicPrediction[]);
        if (engR.status === "rejected")
          toast.error("Analytics error", "Failed to load engagement data.");
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const topicData = (engagement?.topic_breakdown ?? []).map((t) => ({
    topic: t.topic,
    engagement: +(t.avg_score * t.posts).toFixed(2),
  }));

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="Performance insights, topic predictions and engagement trends"
        />

        {/* Overview Stats */}
        {engagement?.overview && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Posts",
                value: engagement.overview.total_posts,
                color: "text-blue-600",
              },
              {
                label: "Avg Engagement",
                value: engagement.overview.average_engagement_score.toFixed(2),
                color: "text-purple-600",
              },
              {
                label: "Topics Used",
                value: engagement.overview.total_topics_used,
                color: "text-emerald-600",
              },
              {
                label: "Posts Today",
                value: engagement.overview.posts_today,
                color: "text-amber-600",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-xs font-medium text-zinc-500">{s.label}</p>
                <p className={`mt-1.5 text-3xl font-bold ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Predictions + Trending */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* AI Predictions */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Target size={15} className="text-blue-500" /> AI Topic
              Predictions
            </h2>
            {predictions.length > 0 ? (
              <div className="space-y-2">
                {predictions.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {p.topic}
                      </p>
                      {p.recommendation && (
                        <p className="text-xs text-zinc-400 truncate">
                          {p.recommendation}
                        </p>
                      )}
                    </div>
                    <span className="ml-3 shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {typeof p.predicted_engagement === "number"
                        ? p.predicted_engagement.toFixed(1)
                        : p.predicted_engagement}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Target size={18} />}
                title="No predictions yet"
                description="Predictions appear after posts accumulate engagement data."
              />
            )}
          </div>

          {/* Trending Topics */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Flame size={15} className="text-orange-500" /> Trending Topics
            </h2>
            {trending.length > 0 ? (
              <div className="space-y-2">
                {trending.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/40"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {t.topic}
                    </p>
                    <Flame
                      size={13}
                      className={i < 3 ? "text-orange-400" : "text-zinc-300"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Flame size={18} />}
                title="No trending data"
                description="Topics will appear as engagement is tracked."
              />
            )}
          </div>
        </div>

        {/* Top Performers */}
        {(engagement?.top_performing_topics ?? []).length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <TrendingUp size={15} className="text-emerald-500" /> Top
              Performing Topics
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {engagement!.top_performing_topics.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/40"
                >
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {t.topic}
                  </span>
                  <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.avg_score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        <TopicChart data={topicData} />

        {/* Topic Breakdown Table */}
        {(engagement?.topic_breakdown ?? []).length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <BarChart3 size={15} /> Topic Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-xs dark:border-zinc-800 dark:bg-zinc-800/50">
                    {["Topic", "Posts", "Avg Score", "Trend"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-zinc-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {engagement!.topic_breakdown.map((t, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {t.topic}
                      </td>
                      <td className="px-5 py-3 text-zinc-500">{t.posts}</td>
                      <td className="px-5 py-3 text-zinc-500">{t.avg_score}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            t.trend === "improving"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : t.trend === "declining"
                                ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {t.trend === "improving" && <TrendingUp size={11} />}
                          {t.trend === "declining" && (
                            <TrendingDown size={11} />
                          )}
                          {t.trend === "stable" && <Minus size={11} />}
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

        {/* Improvement Opportunities */}
        {(engagement?.improvement_opportunities ?? []).length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
              <Lightbulb size={15} /> Improvement Opportunities
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {engagement!.improvement_opportunities.map((imp, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/70 px-4 py-3 dark:bg-zinc-900/40"
                >
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {imp.topic}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {imp.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unused Topics */}
        {(insights?.unused_topics ?? []).length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Unused Topics ({insights!.unused_topics.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {insights!.unused_topics.slice(0, 20).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {topic}
                </span>
              ))}
              {insights!.unused_topics.length > 20 && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-400 dark:bg-zinc-800">
                  +{insights!.unused_topics.length - 20} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
