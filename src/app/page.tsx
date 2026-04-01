"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useToast } from "@/hooks/useToast";
import { useAutoImages } from "@/hooks/useAutoImages";
import { useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import TopicChart from "@/components/TopicChart";
import GenerateButton from "@/components/GenerateButton";
import PageHeader from "@/components/PageHeader";
import ToastContainer from "@/components/Toast";
import { SkeletonDashboard } from "@/components/SkeletonCard";
import {
  FileText,
  TrendingUp,
  Calendar,
  Layers,
  Clock,
  BarChart3,
  Brain,
  ImageIcon,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const { dashboard, scheduler, loading, error, lastUpdated, refetch } =
    useDashboard(true);
  const { enabled: autoImagesEnabled } = useAutoImages();
  const toast = useToast();

  useEffect(() => {
    if (error) toast.error("Dashboard Error", error);
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <SkeletonDashboard />;

  const overview = dashboard?.overview?.overview;
  const topicBreakdown = dashboard?.overview?.topic_breakdown ?? [];
  const systemStatus = dashboard?.system_status;
  const recentActivity = dashboard?.recent_activity ?? [];
  const nextRun = scheduler?.next_posts?.[0]?.next_run;

  const topicData = topicBreakdown.map((t) => ({
    topic: t.topic,
    engagement: +(t.avg_score * t.posts).toFixed(2),
  }));

  const statusItems = systemStatus
    ? [
        { key: "Database", ok: systemStatus.database_connected, icon: "🗄️" },
        { key: "Scheduler", ok: systemStatus.scheduler_running, icon: "⏰" },
        { key: "LinkedIn", ok: systemStatus.linkedin_configured, icon: "💼" },
        {
          key: "AI Engine",
          ok: systemStatus.ai_provider_configured,
          icon: "🤖",
        },
        {
          key: "Smart Topics",
          ok: !!systemStatus.intelligent_topic_engine,
          icon: "🧠",
        },
        {
          key: "Smart Content",
          ok: !!systemStatus.intelligent_content_engine,
          icon: "✨",
        },
        {
          key: "Auto Images",
          ok: autoImagesEnabled,
          icon: "🖼️",
        },
      ]
    : [];

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description={
            lastUpdated
              ? `Last updated ${lastUpdated.toLocaleTimeString()}`
              : "Monitor your LinkedIn auto-posting system"
          }
          action={
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={refetch}
                className="rounded-lg border border-zinc-200 bg-white p-2.5 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50 min-h-10 min-w-10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={18} className="sm:size-[16px]" />
              </button>
              <GenerateButton onGenerated={refetch} />
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Posts Today"
            value={overview?.posts_today ?? 0}
            icon={<Calendar size={20} />}
            color="blue"
            subtitle={`of ${scheduler?.max_posts_per_day ?? "—"} max`}
          />
          <StatsCard
            title="Total Posts"
            value={overview?.total_posts ?? 0}
            icon={<FileText size={20} />}
            color="purple"
          />
          <StatsCard
            title="Avg Engagement"
            value={overview?.average_engagement_score ?? 0}
            icon={<TrendingUp size={20} />}
            color="emerald"
          />
          <StatsCard
            title="Topics Used"
            value={overview?.total_topics_used ?? 0}
            icon={<Layers size={20} />}
            color="amber"
          />
        </div>

        {/* Scheduler + System */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Scheduler */}
          {scheduler && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Scheduler
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold ${
                    scheduler.running
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${scheduler.running ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
                  />
                  {scheduler.running ? "Running" : "Stopped"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  {
                    icon: <BarChart3 size={16} />,
                    label: "Posting Jobs",
                    val: scheduler.posting_jobs,
                    color: "text-blue-600",
                  },
                  {
                    icon: <Clock size={16} />,
                    label: "Posts Today",
                    val: scheduler.posts_today,
                    color: "text-purple-600",
                  },
                  {
                    icon: <Brain size={16} />,
                    label: "Smart Topics",
                    val: scheduler.intelligent_topic_engine ? "ON" : "OFF",
                    color: scheduler.intelligent_topic_engine
                      ? "text-emerald-600"
                      : "text-zinc-400",
                  },
                  {
                    icon: <ImageIcon size={16} />,
                    label: "Auto Images",
                    val: autoImagesEnabled ? "ON" : "OFF",
                    color: autoImagesEnabled
                      ? "text-emerald-600"
                      : "text-zinc-400",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 sm:p-3 dark:bg-zinc-800/50"
                  >
                    <span className={item.color}>{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-zinc-400">{item.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {nextRun && (
                <p className="mt-2 sm:mt-3 text-xs text-zinc-400">
                  Next post:{" "}
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                    {new Date(nextRun).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* System Health */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              System Health
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {statusItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium ${
                    item.ok
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.key}</span>
                  <span
                    className={`ml-auto h-1.5 w-1.5 rounded-full ${item.ok ? "bg-emerald-400" : "bg-zinc-300 dark:bg-zinc-600"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Chart */}
        <TopicChart data={topicData} />

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${activity.success ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                  <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    {activity.action.replace(/_/g, " ")} — {activity.topic}
                  </span>
                  <span className="text-xs text-zinc-400 shrink-0">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
