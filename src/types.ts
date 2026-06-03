export type ImageSource = "img" | "picture" | "background" | "raw";

export type ImageCandidate = {
  url: string;
  source: ImageSource;
  width?: number;
  height?: number;
  size?: number;
  srcset?: string[];
  alt?: string | null;
};

export type ValidationResult = {
  valid: boolean;
  contentType?: string;
  size?: number;
};

export type DebugEvent = {
  type: string;
  message: string;
  url?: string;
  method?: string;
  status?: number;
  attempt?: number;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type DebugLogger = (event: DebugEvent) => void;

export type RetryOptions = {
  retryCount?: number;
  retryDelayMs?: number;
};

export type LearnedPattern = {
  id?: number | string;
  domain: string;
  matchRegex: string;
  transform: string;
  confidence: number;
};

export type ResolutionCache = {
  get(originalUrl: string): Promise<string | null>;
  set(
    originalUrl: string,
    resolvedUrl: string,
    patternId?: string | number,
  ): Promise<void>;
};

export type PatternStore = {
  findByDomain(domain: string): Promise<LearnedPattern[]>;
  save(
    domain: string,
    matchRegex: string,
    transform: string,
  ): Promise<LearnedPattern>;
  incrementSuccess(patternId: string | number): Promise<void>;
  incrementFailure?(patternId: string | number): Promise<void>;
};

export type ResolveResult = {
  original: string;
  resolved: string;
  method: "cached" | "pattern" | "learned" | "probed" | "fallback";
  confidence?: number;
  resolvedSize?: number;
  sizeIncrease?: string;
};

export type ResolveImageOptions = {
  cache?: ResolutionCache;
  patternStore?: PatternStore;
  validate?: (url: string) => Promise<ValidationResult>;
  originalSize?: number;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
} & RetryOptions;

export type DefaultHtmlFetcherOptions = {
  timeoutMs?: number;
  userAgent?: string;
  headers?: Record<string, string>;
  accept?: string;
  allowNonHtml?: boolean;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
} & RetryOptions;

export type ValidateImageUrlOptions = {
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
} & RetryOptions;

export type ExtractImageOptions = {
  includeRaw?: boolean;
  sourceDomain?: string;
  sortBySize?: boolean;
  baseUrl?: string;
  validate?: (url: string) => Promise<ValidationResult>;
};

export type HtmlFetchResult = {
  html: string;
  metadata?: Record<string, unknown>;
};

export type HtmlFetcher = (url: string) => Promise<HtmlFetchResult>;

export type ImageFallbackResult = {
  images: ImageCandidate[];
  metadata?: Record<string, unknown>;
};

export type ImageFallback = (url: string) => Promise<ImageFallbackResult>;

export type ScrapedImage = {
  original: string;
  resolved: string;
  originalSize: number | null;
  resolvedSize: number | null;
  sizeIncrease: string | null;
  alt: string | null;
  method: ResolveResult["method"];
};

export type ScrapePageResult = {
  url: string;
  images: ScrapedImage[];
  stats: {
    found: number;
    resolved: number;
    failed: number;
    returned: number;
    durationMs: number;
  };
  metadata?: Record<string, unknown>;
};

export type ScrapePageOptions = {
  maxImages?: number;
  minSize?: number;
  resolveConcurrency?: number;
  validateResolvedIp?: boolean;
  fetchHtml?: HtmlFetcher;
  imageFallback?: ImageFallback;
  resolve?: (url: string) => Promise<ResolveResult>;
  validate?: (url: string) => Promise<ValidationResult>;
  onDebug?: DebugLogger;
} & RetryOptions;

export type FileCacheOptions = {
  filePath: string;
  maxEntries?: number;
  maxAgeMs?: number;
};

export type FilePatternStoreOptions = {
  filePath: string;
};

export type FirecrawlImageFallbackOptions = {
  apiKey: string;
  apiUrl?: string;
  timeoutMs?: number;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
} & RetryOptions;
