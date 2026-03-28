import type {
  PostStatus,
  PostItem,
  EngagementDashboard,
  SchedulerStatus,
  TopicInsights,
  DashboardResponse,
  ManualPostResponse,
  ApproveRejectResponse,
  ImageResult,
  TopicCluster,
  TopicSeries,
  TopicInsightsV2,
  TopicPrediction,
  PostingTimeInsight,
  PerformanceSummary,
  ABTest,
} from "@/types";

const API_BASE = "/api/proxy";

// ─── Core fetch helpers ────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.error ?? detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

async function apiFetchForm<T>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.error ?? detail;
    } catch {}
    throw new Error(detail);
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return { message: "Success" } as T;
}

// ─── Core endpoints ────────────────────────────────────────────────────────

export async function getDashboard(): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>("/dashboard");
}

export async function getEngagementAnalytics(): Promise<EngagementDashboard> {
  return apiFetch<EngagementDashboard>("/analytics/engagement");
}

export async function getSchedulerStatus(): Promise<SchedulerStatus> {
  return apiFetch<SchedulerStatus>("/scheduler/status");
}

export async function startScheduler(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/scheduler/start", { method: "POST" });
}

export async function stopScheduler(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/scheduler/stop", { method: "POST" });
}

export async function getTopicInsights(): Promise<TopicInsights> {
  return apiFetch<TopicInsights>("/topics/insights");
}

export async function getRecommendedTopics(count = 5): Promise<string[]> {
  return apiFetch<string[]>(`/topics/recommended?count=${count}`);
}

export async function getPosts(
  status?: PostStatus | "all",
): Promise<PostItem[]> {
  const q =
    status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<PostItem[]>(`/posts${q}`);
}

export async function generatePost(
  topic?: string,
  goal?: string,
): Promise<ManualPostResponse> {
  return apiFetch<ManualPostResponse>("/generate-post", {
    method: "POST",
    body: JSON.stringify({ topic, goal }),
  });
}

/** @deprecated use generatePost */
export const triggerManualPost = generatePost;

export async function approvePost(params: {
  postId: number;
  imageUrl?: string;
  imageFile?: File | null;
}): Promise<ApproveRejectResponse> {
  const { postId, imageUrl, imageFile } = params;
  if (imageUrl || imageFile) {
    const fd = new FormData();
    if (imageUrl) fd.append("image_url", imageUrl);
    if (imageFile) fd.append("image_file", imageFile);
    return apiFetchForm<ApproveRejectResponse>(`/approve-post/${postId}`, fd);
  }
  return apiFetch<ApproveRejectResponse>(`/approve-post/${postId}`, {
    method: "GET",
  });
}

export async function rejectPost(
  postId: number,
): Promise<ApproveRejectResponse> {
  return apiFetch<ApproveRejectResponse>(`/reject-post/${postId}`, {
    method: "GET",
  });
}

export async function updateAnalytics(params: {
  post_id: number;
  likes?: number;
  comments?: number;
  impressions?: number;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/analytics/update", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getHealthStatus(): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>("/health");
}

// ─── Image endpoints ───────────────────────────────────────────────────────

export async function getBestImage(
  topic: string,
  count = 5,
): Promise<ImageResult> {
  return apiFetch<ImageResult>(
    `/images/best?topic=${encodeURIComponent(topic)}&count=${count}`,
  );
}

export async function getTopImages(
  topic: string,
  count = 3,
): Promise<ImageResult[]> {
  return apiFetch<ImageResult[]>(
    `/images/top?topic=${encodeURIComponent(topic)}&count=${count}`,
  );
}

export async function extractKeywords(
  topic: string,
): Promise<{ topic: string; keywords: string[] }> {
  return apiFetch<{ topic: string; keywords: string[] }>(
    `/images/keywords?topic=${encodeURIComponent(topic)}`,
  );
}

// ─── Topic V2 endpoints ────────────────────────────────────────────────────

export async function getTopicClusters(): Promise<{
  clusters: Record<string, TopicCluster>;
  total_clusters: number;
}> {
  return apiFetch("/topics/v2/clusters");
}

export async function getTopicSeries(
  topic: string,
  count = 10,
): Promise<TopicSeries> {
  return apiFetch<TopicSeries>(
    `/topics/v2/series?topic=${encodeURIComponent(topic)}&count=${count}`,
  );
}

export async function getNextSeriesTopic(
  seriesId: string,
): Promise<{ series_id: string; next_topic: string }> {
  return apiFetch(
    `/topics/v2/next-series-topic?series_id=${encodeURIComponent(seriesId)}`,
  );
}

export async function getTopicInsightsV2(): Promise<TopicInsightsV2> {
  return apiFetch<TopicInsightsV2>("/topics/v2/insights");
}

// ─── Analytics V2 endpoints ────────────────────────────────────────────────

export async function getTopicPredictions(
  count = 5,
): Promise<TopicPrediction[]> {
  return apiFetch<TopicPrediction[]>(
    `/analytics/v2/predictions?count=${count}`,
  );
}

export async function getBestPostingTime(): Promise<PostingTimeInsight[]> {
  return apiFetch<PostingTimeInsight[]>("/analytics/v2/best-posting-time");
}

export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  return apiFetch<PerformanceSummary>("/analytics/v2/summary");
}

export async function getTrendingTopics(
  limit = 10,
): Promise<TopicPrediction[]> {
  return apiFetch<TopicPrediction[]>(`/analytics/v2/trending?limit=${limit}`);
}

// ─── A/B Testing endpoints ──────────────────────────────────────────────────

export async function createABTest(
  topic: string,
  goal: string,
): Promise<{
  test_id: string;
  topic: string;
  goal: string;
  variants_count: number;
}> {
  return apiFetch("/analytics/v2/ab-tests", {
    method: "POST",
    body: JSON.stringify({ topic, goal }),
  });
}

export async function listABTests(): Promise<ABTest[]> {
  return apiFetch<ABTest[]>("/analytics/v2/ab-tests");
}

export async function getABTest(testId: string): Promise<ABTest> {
  return apiFetch<ABTest>(`/analytics/v2/ab-tests/${testId}`);
}

export async function determineABTestWinner(
  testId: string,
): Promise<{
  test_id: string;
  winner_variant_id: string;
  winning_pattern: string;
}> {
  return apiFetch(`/analytics/v2/ab-tests/${testId}/winner`, {
    method: "POST",
  });
}

export async function getWinningPatterns(): Promise<
  { pattern: string; frequency: number; context: Record<string, unknown> }[]
> {
  return apiFetch("/analytics/v2/winning-patterns");
}

// Re-export types for backward compatibility
export type {
  PostStatus,
  PostItem,
  EngagementDashboard,
  SchedulerStatus,
  TopicInsights,
  DashboardResponse,
  ManualPostResponse,
  ApproveRejectResponse,
  ImageResult,
  ABTest,
  TopicPrediction,
};
