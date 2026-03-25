const API_BASE = "/api/proxy";

// ---- Response types matching actual backend ----

export type PostStatus = "pending" | "approved" | "published" | "rejected";

export interface PostItem {
  id: number;
  topic: string;
  content: string;
  status: PostStatus;
  image_url?: string | null;
  created_at: string;
  linkedin_post_id?: string | null;
}

export interface TopicBreakdown {
  topic: string;
  posts: number;
  avg_score: number;
  trend: string;
}

export interface EngagementDashboard {
  overview: {
    total_posts: number;
    average_engagement_score: number;
    total_topics_used: number;
    posts_today: number;
  };
  top_performing_topics: { topic: string; avg_score: number }[];
  improvement_opportunities: { topic: string; issue: string; recommendation: string }[];
  posting_frequency: {
    today_posts: number;
    recommendation: string;
    optimal_daily_posts: number;
  };
  topic_breakdown: TopicBreakdown[];
}

export interface SchedulerStatus {
  running: boolean;
  total_jobs: number;
  posting_jobs: number;
  next_posts: { id: string; next_run: string | null }[];
  posts_today: number;
  max_posts_per_day: number;
  error?: string;
}

export interface TopicInsights {
  total_topics_used: number;
  topics_used_recently: number;
  best_performing_topics: { topic: string; avg_engagement: number; total_posts: number }[];
  unused_topics: string[];
  topic_weights: Record<string, number>;
}

export interface DashboardResponse {
  overview: EngagementDashboard;
  scheduler: SchedulerStatus;
  topic_insights: TopicInsights;
  recent_activity: { timestamp: string; action: string; topic: string; success: boolean }[];
  system_status: {
    database_connected: boolean;
    scheduler_running: boolean;
    linkedin_configured: boolean;
    ai_provider_configured: boolean;
    posting_mode: string;
  };
}

export interface ManualPostResponse {
  success: boolean;
  message: string;
  post_id?: number;
  linkedin_post_id?: string;
  topic?: string;
  status?: PostStatus;
  email_sent?: boolean;
  error?: string;
}

export interface ApproveRejectResponse {
  success?: boolean;
  message?: string;
  status?: PostStatus;
  post_id?: number;
  linkedin_post_id?: string;
  detail?: string;
  error?: string;
}

// ---- API fetch helper ----

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function apiFetchForm<T>(endpoint: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return { message: "Approved successfully" } as T;
}

// ---- API functions matching actual backend routes ----

export async function getDashboard(): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>("/dashboard");
}

export async function getEngagementAnalytics(): Promise<EngagementDashboard> {
  return apiFetch<EngagementDashboard>("/analytics/engagement");
}

export async function getSchedulerStatus(): Promise<SchedulerStatus> {
  return apiFetch<SchedulerStatus>("/scheduler/status");
}

export async function getTopicInsights(): Promise<TopicInsights> {
  return apiFetch<TopicInsights>("/topics/insights");
}

export async function getRecommendedTopics(count = 5): Promise<string[]> {
  return apiFetch<string[]>(`/topics/recommended?count=${count}`);
}

export async function triggerManualPost(topic?: string): Promise<ManualPostResponse> {
  return apiFetch<ManualPostResponse>("/generate-post", {
    method: "POST",
    body: JSON.stringify(topic ? { topic } : {}),
  });
}

export async function generatePost(topic?: string): Promise<ManualPostResponse> {
  return triggerManualPost(topic);
}

export async function getPosts(status?: string): Promise<PostItem[]> {
  const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<PostItem[]>(`/posts${query}`);
}

export async function approvePost(params: {
  postId: number;
  imageUrl?: string;
  imageFile?: File | null;
}): Promise<ApproveRejectResponse> {
  const { postId, imageUrl, imageFile } = params;

  if (imageUrl || imageFile) {
    const formData = new FormData();
    if (imageUrl) {
      formData.append("image_url", imageUrl);
    }
    if (imageFile) {
      formData.append("image_file", imageFile);
    }
    return apiFetchForm<ApproveRejectResponse>(`/approve-post/${postId}`, formData);
  }

  return apiFetch<ApproveRejectResponse>(`/approve-post/${postId}`, {
    method: "GET",
  });
}

export async function rejectPost(postId: number): Promise<ApproveRejectResponse> {
  return apiFetch<ApproveRejectResponse>(`/reject-post/${postId}`, {
    method: "GET",
  });
}

export interface CommentStatus {
  total_comments_replied: number;
  replied_in_last_24h: number;
  auto_reply_enabled: boolean;
  check_interval_hours: number;
}

export async function getCommentStatus(): Promise<CommentStatus> {
  return apiFetch<CommentStatus>("/comments/status");
}

export async function triggerCommentCheck(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/comments/check", { method: "POST" });
}
