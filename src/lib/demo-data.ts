import type { KeywordInput } from '@/types/pipeline';

// ── Keyword fixtures ──────────────────────────────────────────────────────────

export interface DemoKeyword {
  readonly id: string;
  readonly phrase: string;
  readonly searchVolume: number;
  readonly difficulty: number;
  readonly intent: KeywordInput['intent'];
  readonly brand: 'WeddedWonderland';
  readonly status: 'queued' | 'researched' | 'outlined' | 'drafted' | 'published';
  readonly articleId: string | null;
}

export const DEMO_KEYWORDS: readonly DemoKeyword[] = [
  {
    id: 'kw-001',
    phrase: 'destination weddings Bali',
    searchVolume: 8100,
    difficulty: 38,
    intent: 'informational',
    brand: 'WeddedWonderland',
    status: 'published',
    articleId: 'art-001',
  },
  {
    id: 'kw-002',
    phrase: 'destination weddings Santorini Greece',
    searchVolume: 5400,
    difficulty: 44,
    intent: 'informational',
    brand: 'WeddedWonderland',
    status: 'drafted',
    articleId: 'art-002',
  },
  {
    id: 'kw-003',
    phrase: 'luxury wedding venues Sydney',
    searchVolume: 3600,
    difficulty: 52,
    intent: 'commercial',
    brand: 'WeddedWonderland',
    status: 'outlined',
    articleId: null,
  },
  {
    id: 'kw-004',
    phrase: 'destination weddings Maldives overwater bungalow',
    searchVolume: 2900,
    difficulty: 31,
    intent: 'informational',
    brand: 'WeddedWonderland',
    status: 'queued',
    articleId: null,
  },
] as const;

// ── Article fixtures ──────────────────────────────────────────────────────────

export interface DemoSection {
  readonly level: 2 | 3;
  readonly text: string;
  readonly wordCount: number;
}

export interface DemoArticle {
  readonly id: string;
  readonly keywordId: string;
  readonly h1: string;
  readonly slug: string;
  readonly metaDescription: string;
  readonly wordCount: number;
  readonly sections: readonly DemoSection[];
  readonly internalLinks: readonly DemoInternalLink[];
  readonly seoScore: number;
  readonly seoVerdicts: readonly DemoSeoVerdict[];
  readonly publishedAt: string | null;
  readonly cmsConnectionId: string | null;
}

export interface DemoSeoVerdict {
  readonly rule: string;
  readonly label: string;
  readonly verdict: 'pass' | 'warn' | 'fail';
  readonly detail: string;
}

export interface DemoInternalLink {
  readonly id: string;
  readonly anchorText: string;
  readonly targetSlug: string;
  readonly targetH1: string;
  readonly relevanceScore: number;
  readonly accepted: boolean | null;
}

export const DEMO_ARTICLES: readonly DemoArticle[] = [
  {
    id: 'art-001',
    keywordId: 'kw-001',
    h1: 'Destination Weddings in Bali: The Complete 2026 Planning Guide',
    slug: 'destination-weddings-bali-complete-guide',
    metaDescription:
      'Plan your dream destination wedding in Bali. Discover the best venues, legal requirements, ideal seasons, and budgeting tips for 2026 Bali weddings.',
    wordCount: 2340,
    sections: [
      { level: 2, text: "Why Bali is the World's Top Wedding Destination", wordCount: 320 },
      { level: 2, text: 'Best Regions in Bali for Weddings', wordCount: 410 },
      { level: 3, text: 'Seminyak and Oberoi: Beachfront Luxury', wordCount: 140 },
      { level: 3, text: 'Ubud: Jungle and Rice Terrace Settings', wordCount: 130 },
      { level: 3, text: 'Uluwatu: Clifftop Ceremony Venues', wordCount: 120 },
      { level: 2, text: 'Bali Wedding Legalities for Foreign Couples', wordCount: 290 },
      { level: 2, text: 'Best Season to Get Married in Bali', wordCount: 220 },
      { level: 2, text: 'Average Cost of a Destination Wedding in Bali', wordCount: 310 },
      { level: 2, text: 'Top Bali Wedding Venues on Wedded Wonderland', wordCount: 400 },
    ],
    internalLinks: [
      {
        id: 'il-001',
        anchorText: 'Alila Villas Uluwatu',
        targetSlug: 'venue/alila-villas-uluwatu',
        targetH1: 'Alila Villas Uluwatu — Clifftop Wedding Venue Bali',
        relevanceScore: 0.95,
        accepted: true,
      },
      {
        id: 'il-002',
        anchorText: 'destination weddings Asia',
        targetSlug: 'destinations/asia',
        targetH1: 'Destination Weddings in Asia — Wedded Wonderland',
        relevanceScore: 0.88,
        accepted: true,
      },
      {
        id: 'il-003',
        anchorText: 'Ayana Bali wedding packages',
        targetSlug: 'venue/ayana-bali',
        targetH1: 'AYANA Resort Bali — Luxury Wedding Venue',
        relevanceScore: 0.82,
        accepted: null,
      },
    ],
    seoScore: 91,
    seoVerdicts: [
      { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: '62 characters — within 30–80 range' },
      { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: '158 characters — within 150–160 range' },
      { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
      { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
      { rule: 'word_count', label: 'Word Count', verdict: 'pass', detail: '2,340 words — target was 2,000+' },
      { rule: 'internal_links', label: 'Internal Links', verdict: 'pass', detail: '2 accepted links — within 2–4 target range' },
      { rule: 'canonical_url', label: 'Canonical URL', verdict: 'warn', detail: 'Canonical not set — will default to publish URL' },
      { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
    ],
    publishedAt: '2026-05-20T09:00:00Z',
    cmsConnectionId: 'cms-con-001',
  },
  {
    id: 'art-002',
    keywordId: 'kw-002',
    h1: 'Destination Weddings in Santorini: Venues, Costs & Planning for 2026',
    slug: 'destination-weddings-santorini-guide',
    metaDescription:
      'Everything you need to plan a Santorini destination wedding in 2026. Iconic caldera views, top venues, legal tips, and budget breakdown for Greece weddings.',
    wordCount: 2180,
    sections: [
      { level: 2, text: 'Why Santorini Tops Every Wedding Destination List', wordCount: 290 },
      { level: 2, text: 'Best Santorini Villages for a Wedding', wordCount: 380 },
      { level: 3, text: 'Oia: Sunset and Caldera Views', wordCount: 130 },
      { level: 3, text: 'Imerovigli: Intimate Clifftop Settings', wordCount: 110 },
      { level: 2, text: 'Legal Requirements for Foreign Couples in Greece', wordCount: 320 },
      { level: 2, text: 'When to Marry in Santorini', wordCount: 210 },
      { level: 2, text: 'Top Santorini Wedding Venues', wordCount: 340 },
      { level: 2, text: 'Santorini vs Mykonos for a Destination Wedding', wordCount: 400 },
    ],
    internalLinks: [
      {
        id: 'il-004',
        anchorText: 'Rocabella Santorini',
        targetSlug: 'venue/rocabella-santorini-hotel-spa',
        targetH1: 'Rocabella Santorini Hotel & Spa — Wedding Venue',
        relevanceScore: 0.93,
        accepted: true,
      },
      {
        id: 'il-005',
        anchorText: 'destination weddings Europe',
        targetSlug: 'destinations/europe',
        targetH1: 'Destination Weddings in Europe — Wedded Wonderland',
        relevanceScore: 0.86,
        accepted: null,
      },
    ],
    seoScore: 78,
    seoVerdicts: [
      { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: '66 characters — within 30–80 range' },
      { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: '159 characters — within 150–160 range' },
      { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
      { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
      { rule: 'word_count', label: 'Word Count', verdict: 'pass', detail: '2,180 words — target was 2,000+' },
      { rule: 'internal_links', label: 'Internal Links', verdict: 'warn', detail: '1 accepted link — recommend 2–4 per article' },
      { rule: 'canonical_url', label: 'Canonical URL', verdict: 'warn', detail: 'Canonical not set — will default to publish URL' },
      { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
    ],
    publishedAt: null,
    cmsConnectionId: null,
  },
] as const;

// ── CMS connection fixtures ───────────────────────────────────────────────────

export interface DemoCmsConnection {
  readonly id: string;
  readonly provider: 'wordpress' | 'shopify';
  readonly label: string;
  readonly siteUrl: string;
  readonly status: 'verified' | 'invalid' | 'unreachable' | 'unconfigured';
  readonly lastChecked: string | null;
}

export const DEMO_CMS_CONNECTIONS: readonly DemoCmsConnection[] = [
  {
    id: 'cms-con-001',
    provider: 'wordpress',
    label: 'Wedded Wonderland (WordPress)',
    siteUrl: 'https://wordpress-1598319-6454696.cloudwaysapps.com',
    status: 'verified',
    lastChecked: '2026-05-30T10:00:00Z',
  },
] as const;

// ── Publish job fixtures ──────────────────────────────────────────────────────

export interface DemoPublishJob {
  readonly id: string;
  readonly articleId: string;
  readonly articleH1: string;
  readonly cmsConnectionId: string;
  readonly provider: 'wordpress' | 'shopify';
  readonly status: 'pending' | 'running' | 'succeeded' | 'failed';
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly externalUrl: string | null;
}

export const DEMO_PUBLISH_JOBS: readonly DemoPublishJob[] = [
  {
    id: 'job-001',
    articleId: 'art-001',
    articleH1: 'Destination Weddings in Bali: The Complete 2026 Planning Guide',
    cmsConnectionId: 'cms-con-001',
    provider: 'wordpress',
    status: 'succeeded',
    startedAt: '2026-05-20T09:00:00Z',
    completedAt: '2026-05-20T09:00:12Z',
    externalUrl: 'https://wordpress-1598319-6454696.cloudwaysapps.com/destination-weddings-bali-complete-guide',
  },
] as const;

// ── Dashboard stats (derived from above for consistency) ──────────────────────

export const DEMO_STATS = {
  keywordsTracked: DEMO_KEYWORDS.length,
  articlesGenerated: DEMO_ARTICLES.length,
  articlesPublished: DEMO_ARTICLES.filter(a => a.publishedAt !== null).length,
  avgSeoScore: Math.round(
    DEMO_ARTICLES.reduce((sum, a) => sum + a.seoScore, 0) / DEMO_ARTICLES.length,
  ),
} as const;
