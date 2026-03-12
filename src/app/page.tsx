"use client";

import { useEffect, useState } from "react";
import {
  getDashboard,
  getSchedulerStatus,
  type DashboardResponse,
  type SchedulerStatus,
} from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import TopicChart from "@/components/TopicChart";
import GenerateButton from "@/components/GenerateButton";
import CommentCard from "@/components/CommentCard";
import { FileText, TrendingUp, Clock, Calendar, Loader2, BarChart3, Layers } from "lucide-react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [scheduler, setScheduler] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashData, schedData] = await Promise.all([
          getDashboard().catch(() => null),
          getSchedulerStatus().catch(() => null),
        ]);
        setDashboard(dashData);
        setScheduler(schedData);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  const overview = dashboard?.overview?.overview;
  const topicBreakdown = dashboard?.overview?.topic_breakdown ?? [];

  const topicData = topicBreakdown.map((t) => ({
    topic: t.topic,
    engagement: t.avg_score * t.posts,
  }));

  const nextRun = scheduler?.next_posts?.[0]?.next_run;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor your LinkedIn auto-posting system</p>
        </div>
        <GenerateButton />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Posts Today" value={overview?.posts_today ?? 0} icon={<Calendar size={20} />} />
        <StatsCard title="Total Posts" value={overview?.total_posts ?? 0} icon={<FileText size={20} />} />
        <StatsCard title="Avg Engagement" value={overview?.average_engagement_score ?? 0} icon={<TrendingUp size={20} />} />
        <StatsCard title="Topics Used" value={overview?.total_topics_used ?? 0} icon={<Layers size={20} />} />
      </div>

      {/* Scheduler status */}
      {scheduler && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Scheduler Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${scheduler.running ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"}`}>
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Status</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{scheduler.running ? "Running" : "Stopped"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Posting Jobs</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{scheduler.posting_jobs}</p>
              </div>
            </div>
            {nextRun && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Next Post</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {new Date(nextRun).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Max Posts/Day</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{scheduler.max_posts_per_day}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System status */}
      {dashboard?.system_status && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">System Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(dashboard.system_status).map(([key, val]) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  val === true || val === "text_only"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${val === true || val === "text_only" ? "bg-emerald-500" : "bg-red-500"}`} />
                {key.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Topic chart */}
      <TopicChart data={topicData} />

      {/* Comment auto-reply card */}
      <CommentCard />
    </div>
  );
}
