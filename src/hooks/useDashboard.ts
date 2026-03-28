"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getDashboard, getSchedulerStatus } from "@/lib/api";
import type { DashboardResponse, SchedulerStatus } from "@/types";

const AUTO_REFRESH_MS = 30_000; // 30 seconds

export function useDashboard(autoRefresh = true) {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [scheduler, setScheduler] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setError(null);
      const [dash, sched] = await Promise.all([
        getDashboard().catch(() => null),
        getSchedulerStatus().catch(() => null),
      ]);
      setDashboard(dash);
      setScheduler(sched);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!autoRefresh) return;
    timerRef.current = setInterval(() => fetch(true), AUTO_REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh, fetch]);

  return { dashboard, scheduler, loading, error, lastUpdated, refetch: () => fetch() };
}
