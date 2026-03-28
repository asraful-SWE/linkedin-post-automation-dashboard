"use client";

import { useEffect, useState } from "react";
import { getSchedulerStatus, startScheduler, stopScheduler, getHealthStatus, getAutoImagesSetting, setAutoImagesSetting } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { useAutoImages } from "@/hooks/useAutoImages";
import type { SchedulerStatus } from "@/types";
import { Play, Square, RefreshCw, Loader2, Server, Brain, ImageIcon, Zap } from "lucide-react";

export default function SettingsPage() {
  const [scheduler, setScheduler] = useState<SchedulerStatus | null>(null);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const toast = useToast();
  const { enabled: autoImagesEnabled, hydrated, setAutoImages } = useAutoImages();

  const refresh = async () => {
    try {
      const [sched, healthData, autoImages] = await Promise.all([
        getSchedulerStatus().catch(() => null),
        getHealthStatus().catch(() => null),
        getAutoImagesSetting().catch(() => null),
      ]);
      setScheduler(sched);
      setHealth(healthData);
      if (autoImages && typeof autoImages.enabled === "boolean") {
        setAutoImages(autoImages.enabled);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleSchedulerToggle = async () => {
    if (!scheduler) return;
    const action = scheduler.running ? "stop" : "start";
    setActionLoading(action);
    try {
      if (scheduler.running) await stopScheduler();
      else await startScheduler();
      toast.success(`Scheduler ${action === "start" ? "started" : "stopped"}!`);
      await refresh();
    } catch (e) {
      toast.error(`Failed to ${action} scheduler`, e instanceof Error ? e.message : "");
    } finally {
      setActionLoading(null);
    }
  };

  const capabilityItems = scheduler ? [
    { label: "Intelligent Topic Engine", enabled: !!scheduler.intelligent_topic_engine, icon: <Brain size={16} />, description: "Semantic clustering, series generation, trending boost" },
    { label: "Intelligent Content Engine", enabled: !!scheduler.intelligent_content_engine, icon: <Zap size={16} />, description: "Goal-driven generation with quality scoring" },
    { label: "Auto Image Selection", enabled: autoImagesEnabled, icon: <ImageIcon size={16} />, description: "Automatic Unsplash/Pexels image attachment" },
  ] : [];

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="System configuration and scheduler management"
          action={
            <button
              onClick={refresh}
              className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scheduler Control */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    Scheduler Control
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage the automated posting schedule</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  scheduler?.running
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${scheduler?.running ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                  {scheduler?.running ? "Running" : "Stopped"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
                {[
                  { label: "Total Jobs", value: scheduler?.total_jobs ?? "—" },
                  { label: "Posting Jobs", value: scheduler?.posting_jobs ?? "—" },
                  { label: "Posts Today", value: scheduler?.posts_today ?? "—" },
                  { label: "Max / Day", value: scheduler?.max_posts_per_day ?? "—" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wide">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSchedulerToggle}
                disabled={!!actionLoading}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-60 ${
                  scheduler?.running
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : scheduler?.running ? (
                  <Square size={15} />
                ) : (
                  <Play size={15} />
                )}
                {scheduler?.running ? "Stop Scheduler" : "Start Scheduler"}
              </button>
            </div>

            {/* Capabilities */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Intelligent Capabilities
              </h2>

              <div className="mb-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/40">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Auto Images Switch</p>
                  <p className="text-xs text-zinc-400">Turn on to request auto images during post generation.</p>
                </div>
                <button
                  type="button"
                  disabled={!hydrated}
                  onClick={async () => {
                    const next = !autoImagesEnabled;
                    try {
                      const res = await setAutoImagesSetting(next);
                      setAutoImages(res.enabled);
                      toast.success(`Auto Images ${res.enabled ? "enabled" : "disabled"}`);
                      await refresh();
                    } catch (e) {
                      toast.error(
                        "Failed to update Auto Images",
                        e instanceof Error ? e.message : "",
                      );
                    }
                  }}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    autoImagesEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  } ${!hydrated ? "opacity-60" : ""}`}
                  aria-label="Toggle auto images"
                  aria-pressed={autoImagesEnabled}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                      autoImagesEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                {capabilityItems.map((cap) => (
                  <div key={cap.label} className={`flex items-start gap-3 rounded-xl p-4 ${
                    cap.enabled
                      ? "bg-emerald-50 dark:bg-emerald-950/30"
                      : "bg-zinc-50 dark:bg-zinc-800/30"
                  }`}>
                    <span className={cap.enabled ? "text-emerald-600 dark:text-emerald-400 mt-0.5" : "text-zinc-400 mt-0.5"}>
                      {cap.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{cap.label}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          cap.enabled
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                        }`}>
                          {cap.enabled ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-400">{cap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">
                Configure capabilities via environment variables in your <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.env</code> file.
              </p>
            </div>

            {/* System Health */}
            {health && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  <Server size={15} /> System Health
                </h2>
                <pre className="overflow-x-auto rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
