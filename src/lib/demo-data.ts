import type { KeywordInput } from '@/types/pipeline';

// ── Keyword fixtures ──────────────────────────────────────────────────────────

export interface DemoKeyword {
  readonly id: string;
  readonly phrase: string;
  readonly searchVolume: number;
  readonly difficulty: number;
  readonly intent: KeywordInput['intent'];
  readonly brand: 'ForgeTorque' | 'LuxDermis' | 'VeloCargo';
  readonly status: 'queued' | 'researched' | 'outlined' | 'drafted' | 'published';
  readonly articleId: string | null;
}

export const DEMO_KEYWORDS: readonly DemoKeyword[] = [
  {
    id: 'kw-001',
    phrase: 'best industrial torque wrenches',
    searchVolume: 2400,
    difficulty: 42,
    intent: 'commercial',
    brand: 'ForgeTorque',
    status: 'published',
    articleId: 'art-001',
  },
  {
    id: 'kw-002',
    phrase: 'hydraulic torque wrench calibration guide',
    searchVolume: 720,
    difficulty: 28,
    intent: 'informational',
    brand: 'ForgeTorque',
    status: 'drafted',
    articleId: 'art-002',
  },
  {
    id: 'kw-003',
    phrase: 'luxury hyaluronic acid serum review',
    searchVolume: 8900,
    difficulty: 61,
    intent: 'commercial',
    brand: 'LuxDermis',
    status: 'outlined',
    articleId: null,
  },
  {
    id: 'kw-004',
    phrase: 'next-day freight shipping rates',
    searchVolume: 3100,
    difficulty: 35,
    intent: 'transactional',
    brand: 'VeloCargo',
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
    h1: 'Best Industrial Torque Wrenches for 2025: ForgeTorque Pro-Series Review',
    slug: 'best-industrial-torque-wrenches-2025',
    metaDescription:
      'Compare the top industrial torque wrenches of 2025. ForgeTorque Pro-Series delivers ±2% accuracy for heavy-duty automotive and manufacturing applications.',
    wordCount: 2180,
    sections: [
      { level: 2, text: 'Why Torque Precision Matters in Industrial Settings', wordCount: 310 },
      { level: 2, text: 'ForgeTorque Pro-900: Flagship Review', wordCount: 420 },
      { level: 3, text: 'Accuracy and Calibration Specs', wordCount: 145 },
      { level: 3, text: 'Ergonomics and Build Quality', wordCount: 130 },
      { level: 2, text: 'ForgeTorque Pro-600: Mid-Range Powerhouse', wordCount: 380 },
      { level: 2, text: 'Competitor Comparison: Where ForgeTorque Leads', wordCount: 290 },
      { level: 2, text: 'Maintenance and Recalibration Schedule', wordCount: 210 },
      { level: 2, text: 'Verdict: Best Torque Wrench for Your Application', wordCount: 295 },
    ],
    internalLinks: [
      {
        id: 'il-001',
        anchorText: 'hydraulic torque wrench calibration',
        targetSlug: 'hydraulic-torque-wrench-calibration-guide',
        targetH1: 'Hydraulic Torque Wrench Calibration: Complete Guide',
        relevanceScore: 0.91,
        accepted: true,
      },
      {
        id: 'il-002',
        anchorText: 'industrial fastener standards',
        targetSlug: 'iso-6789-torque-tool-standards',
        targetH1: 'ISO 6789 Torque Tool Standards Explained',
        relevanceScore: 0.74,
        accepted: null,
      },
    ],
    seoScore: 87,
    seoVerdicts: [
      {
        rule: 'h1_length',
        label: 'H1 Length',
        verdict: 'pass',
        detail: '68 characters — within 30–80 range',
      },
      {
        rule: 'meta_length',
        label: 'Meta Description',
        verdict: 'pass',
        detail: '157 characters — within 150–160 range',
      },
      {
        rule: 'keyword_in_h1',
        label: 'Keyword in H1',
        verdict: 'pass',
        detail: 'Primary keyword present in H1',
      },
      {
        rule: 'keyword_in_meta',
        label: 'Keyword in Meta',
        verdict: 'pass',
        detail: 'Primary keyword present in meta description',
      },
      {
        rule: 'word_count',
        label: 'Word Count',
        verdict: 'pass',
        detail: '2,180 words — target was 2,000+',
      },
      {
        rule: 'internal_links',
        label: 'Internal Links',
        verdict: 'warn',
        detail: '1 accepted link — recommend 2–4 per article',
      },
      {
        rule: 'canonical_url',
        label: 'Canonical URL',
        verdict: 'warn',
        detail: 'Canonical not set — will default to publish URL',
      },
      {
        rule: 'schema_org',
        label: 'Schema.org Type',
        verdict: 'pass',
        detail: 'Article schema detected',
      },
    ],
    publishedAt: '2025-10-14T09:00:00Z',
    cmsConnectionId: 'cms-con-001',
  },
  {
    id: 'art-002',
    keywordId: 'kw-002',
    h1: 'Hydraulic Torque Wrench Calibration: The Complete Industrial Guide',
    slug: 'hydraulic-torque-wrench-calibration-guide',
    metaDescription:
      'Step-by-step hydraulic torque wrench calibration for ISO 6789 compliance. ForgeTorque recalibration intervals, procedures, and certification tips.',
    wordCount: 1840,
    sections: [
      { level: 2, text: 'Understanding Hydraulic Torque Wrench Drift', wordCount: 270 },
      { level: 2, text: 'ISO 6789 Calibration Requirements', wordCount: 340 },
      { level: 3, text: 'Type I vs Type II Tools', wordCount: 120 },
      { level: 2, text: 'Step-by-Step Calibration Procedure', wordCount: 410 },
      { level: 2, text: 'Calibration Intervals by Application', wordCount: 280 },
      { level: 2, text: 'When to Send for Professional Recertification', wordCount: 220 },
    ],
    internalLinks: [],
    seoScore: 74,
    seoVerdicts: [
      {
        rule: 'h1_length',
        label: 'H1 Length',
        verdict: 'pass',
        detail: '63 characters — within 30–80 range',
      },
      {
        rule: 'meta_length',
        label: 'Meta Description',
        verdict: 'pass',
        detail: '155 characters — within 150–160 range',
      },
      {
        rule: 'keyword_in_h1',
        label: 'Keyword in H1',
        verdict: 'pass',
        detail: 'Primary keyword present in H1',
      },
      {
        rule: 'keyword_in_meta',
        label: 'Keyword in Meta',
        verdict: 'pass',
        detail: 'Primary keyword present in meta description',
      },
      {
        rule: 'word_count',
        label: 'Word Count',
        verdict: 'warn',
        detail: '1,840 words — target was 2,000+',
      },
      {
        rule: 'internal_links',
        label: 'Internal Links',
        verdict: 'fail',
        detail: '0 accepted links — minimum is 1',
      },
      {
        rule: 'canonical_url',
        label: 'Canonical URL',
        verdict: 'warn',
        detail: 'Canonical not set — will default to publish URL',
      },
      {
        rule: 'schema_org',
        label: 'Schema.org Type',
        verdict: 'pass',
        detail: 'Article schema detected',
      },
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
    label: 'ForgeTorque Blog (WordPress)',
    siteUrl: 'https://demo.forgetorque.com',
    status: 'verified',
    lastChecked: '2025-10-14T08:45:00Z',
  },
  {
    id: 'cms-con-002',
    provider: 'shopify',
    label: 'LuxDermis Store (Shopify)',
    siteUrl: 'https://luxdermis.myshopify.com',
    status: 'unconfigured',
    lastChecked: null,
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
    articleH1: 'Best Industrial Torque Wrenches for 2025: ForgeTorque Pro-Series Review',
    cmsConnectionId: 'cms-con-001',
    provider: 'wordpress',
    status: 'succeeded',
    startedAt: '2025-10-14T09:00:00Z',
    completedAt: '2025-10-14T09:00:12Z',
    externalUrl: 'https://demo.forgetorque.com/best-industrial-torque-wrenches-2025',
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
