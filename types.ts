
export enum SignalSource {
  GOOGLE_TRENDS = 'Google Trends',
  REDDIT = 'Reddit',
  NEWS_API = 'NewsAPI',
  ARXIV = 'arXiv',
  GLIMPSE = 'Glimpse',
  TIKTOK = 'TikTok',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  RSS = 'RSS'
}

export enum ContentStatus {
  DRAFT = 'Draft',
  REVIEW = 'Review',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived'
}

export enum ArticleType {
  NEWS = 'News',
  GUIDE = 'Guide',
  ANALYSIS = 'Analysis'
}

export interface UserProfile {
  name: string;
  email: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  avatarUrl?: string;
}

export interface SignalScore {
  total: number;
  searchDemand: number; // 0-25
  coverage: number;     // 0-25
  social: number;       // 0-30
  innovation: number;   // 0-10
  seo: number;          // 0-10
}

export interface SignalAnalysis {
  pros: string[];
  cons: string[];
  expectedResult: string;
  timeToResult: string; // e.g., "2-3 days", "Instant", "Evergreen"
  originalUrl: string;
}

export interface SignalMetadata {
  views?: string;
  growth?: string;
  postedAt?: string;
  officialUrl?: string;
  author?: string;
  rank?: number; // Organic position/ranking
}

export interface Signal {
  id: string;
  title: string;
  source: SignalSource;
  timestamp: string;
  score: SignalScore;
  summary: string;
  status: 'PENDING' | 'PROCESSING' | 'IGNORED' | 'APPROVED';
  analysis?: SignalAnalysis;
  metadata?: SignalMetadata;
}

export interface DiscoveryFilters {
  region: string;
  language: string;
  timeRange: '24h' | '7d' | '30d';
  minScore: number;
}

export interface TrendAnalytics {
  highIntentKeywords: string[];
  opportunities: string[];
  volumeData: { name: string; daily: number; weekly: number }[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  language: 'PT' | 'EN';
  type: ArticleType;
  status: ContentStatus;
  publishDate?: string;
  views: number;
  signalId: string;
  content: string; // Markdown
  excerpt: string;
  tags: string[];
  metaTitle?: string;
  focusKeyword?: string;
}

export interface ModuleConfigSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    default?: any;
    description?: string;
    enum?: string[];
    format?: string; // password, url, etc.
  }>;
  required?: string[];
}

export interface ModuleManifest {
  name: string;
  version: string;
  permissions: string[];
  description: string;
  compatibility?: Record<string, string>;
  type: 'declarative' | 'worker-only' | 'full';
  entrypoints?: Record<string, string>;
  configSchema?: ModuleConfigSchema;
}

export interface SystemModule {
  id: string;
  manifest: ModuleManifest;
  active: boolean;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
  installedAt: string;
  config?: Record<string, any>;
}

export interface AIProviderConfig {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'CODE' | 'SEO' | 'RESEARCH';
  name: string;
  provider: 'Gemini' | 'OpenAI' | 'Anthropic' | 'Midjourney' | 'StableDiffusion';
  apiKey: string;
  model: string;
  active: boolean;
}
