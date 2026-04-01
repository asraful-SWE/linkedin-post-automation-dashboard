// ─── Post Types ────────────────────────────────────────────────────────────
export type PostStatus = "pending" | "approved" | "published" | "rejected";
export type PostGoal = "educational" | "viral" | "authority" | "story" | "engagement";

export interface PostItem {
  id: number;
  topic: string;
  content: string;
  status: PostStatus;
  image_url?: string | null;
  created_at: string;
  linkedin_post_id?: string | null;
  post_goal?: PostGoal | null;
  content_score?: number | null;
  retry_count?: number;
  ab_test_id?: string | null;
  engagement_score?: number;
}

// ─── Content Intelligence Types ─────────────────────────────────────────────
export type ContentStatus = "pending" | "extracted" | "processed" | "failed" | "skipped";
export type ContentSource = "hackernews" | "reddit" | "devto" | "medium" | "techcrunch";

export interface ContentItem {
  id: number;
  title: string;
  url: string;
  source: ContentSource | string;
  author?: string | null;
  summary?: string | null;
  key_points: string[];
  image_url?: string | null;
  tags: string[];
  score: number;
  external_score: number;
  published_at?: string | null;
  created_at?: string | null;
  status: ContentStatus | string;
  used_for_post: boolean;
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
}

export interface ContentStatsResponse {
  total: number;
  by_status: Record<string, number>;
  by_source: Record<string, number>;
  average_score: number;
}

export interface GeneratedPostResponse {
  success: boolean;
  post_content?: string | null;
  image_url?: string | null;
  content_id: number;
  error?: string | null;
}

export interface PipelineResponse {
  success: boolean;
  message: string;
  stats?: {
    collected: number;
    deduplicated: number;
    extracted: number;
    filtered: number;
    enriched: number;
    stored: number;
    errors: number;
  };
}

// ─── Analytics Types ────────────────────────────────────────────────────────
export interface TopicBreakdown {
  topic: string;
  posts: number;
  avg_score: number;
  trend: "improving" | "declining" | "stable";
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
  intelligent_topic_engine?: boolean;
  intelligent_content_engine?: boolean;
  image_auto_selection?: boolean;
  error?: string;
}

export interface TopicInsights {
  total_topics_used: number;
  topics_used_recently: number;
  best_performing_topics: { topic: string; avg_engagement: number; total_posts: number }[];
  unused_topics: string[];
  topic_weights: Record<string, number>;
}

export interface SystemStatus {
  database_connected: boolean;
  scheduler_running: boolean;
  linkedin_configured: boolean;
  ai_provider_configured: boolean;
  intelligent_topic_engine?: boolean;
  intelligent_content_engine?: boolean;
  image_auto_selection?: boolean;
  unsplash_configured?: boolean;
  pexels_configured?: boolean;
  posting_mode: string;
}

export interface DashboardResponse {
  overview: EngagementDashboard;
  scheduler: SchedulerStatus;
  topic_insights: TopicInsights;
  recent_activity: { timestamp: string; action: string; topic: string; success: boolean }[];
  system_status: SystemStatus;
}

export interface ManualPostResponse {
  success: boolean;
  message: string;
  post_id?: number;
  linkedin_post_id?: string;
  topic?: string;
  goal?: string;
  content_score?: number;
  has_image?: boolean;
  image_url?: string | null;
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

// ─── Image Types ────────────────────────────────────────────────────────────
export interface ImageResult {
  url: string;
  thumb_url: string;
  width: number;
  height: number;
  source: "unsplash" | "pexels" | string;
  score: number;
  description: string;
  photographer: string;
}

// ─── Topic V2 Types ─────────────────────────────────────────────────────────
export interface TopicCluster {
  name: string;
  topics: string[];
  total_topics: number;
}

export interface TopicSeries {
  series_id: string;
  title: string;
  total_parts: number;
  parts: string[];
  current_part: number;
  is_active: boolean;
}

export interface TopicInsightsV2 {
  cluster_performance: Record<string, { avg_engagement: number; total_posts: number }>;
  top_clusters: string[];
  series_active: number;
  recommended_next: string[];
}

// ─── Analytics V2 Types ─────────────────────────────────────────────────────
export interface TopicPrediction {
  topic: string;
  predicted_engagement: number;
  confidence: number;
  recommendation: string;
}

export interface PostingTimeInsight {
  hour: number;
  avg_engagement: number;
  classification: string;
  post_count: number;
}

export interface PerformanceSummary {
  total_posts: number;
  total_engagement: number;
  avg_engagement: number;
  best_goal: string;
  consistency_score: number;
  trend: "improving" | "declining" | "stable";
}

// ─── A/B Testing Types ───────────────────────────────────────────────────────
export interface ABTestVariant {
  variant_id: string;
  content: string;
  score: number;
  linkedin_post_id?: string | null;
  metrics: { likes: number; comments: number; impressions: number };
}

export interface ABTest {
  test_id: string;
  topic: string;
  goal: string;
  variants: ABTestVariant[];
  status: "active" | "completed" | "cancelled";
  created_at: string;
  winner_variant_id?: string | null;
  winning_pattern?: string | null;
}

// ─── Toast Types ─────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
