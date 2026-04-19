import 'server-only';

// ── Rule registry ─────────────────────────────────────────────────────────────

/**
 * All SEO rule keys. Each key maps to one RuleResult in an SEOReport.
 * Extending Phase 6 means: add key here, add weight below, add validator file.
 */
export const SEO_RULES = {
  H1_LENGTH: 'h1_length',
  H1_KEYWORD: 'h1_keyword',
  META_LENGTH: 'meta_length',
  META_KEYWORD: 'meta_keyword',
  HEADING_HIERARCHY: 'heading_hierarchy',
  KEYWORD_DENSITY: 'keyword_density',
  READABILITY: 'readability',
  INTERNAL_LINKS: 'internal_links',
  SCHEMA_ORG: 'schema_org',
  CANONICAL_URL: 'canonical_url',
} as const satisfies Record<string, string>;

export type SeoRuleKey = (typeof SEO_RULES)[keyof typeof SEO_RULES];

// ── Weights (must sum to 100) ─────────────────────────────────────────────────

/**
 * Contribution of each rule to the overall 0–100 score.
 * Scoring formula per rule:
 *   pass  → weight × 1.0
 *   warn  → weight × 0.5
 *   fail  → weight × 0.0
 *
 * P08 (SEO Strategist) sets these weights — keyword signals carry the most.
 */
export const WEIGHTS = {
  [SEO_RULES.H1_LENGTH]: 12,
  [SEO_RULES.H1_KEYWORD]: 10,
  [SEO_RULES.META_LENGTH]: 8,
  [SEO_RULES.META_KEYWORD]: 7,
  [SEO_RULES.HEADING_HIERARCHY]: 8,
  [SEO_RULES.KEYWORD_DENSITY]: 15,
  [SEO_RULES.READABILITY]: 10,
  [SEO_RULES.INTERNAL_LINKS]: 13,
  [SEO_RULES.SCHEMA_ORG]: 10,
  [SEO_RULES.CANONICAL_URL]: 7,
} as const satisfies Record<SeoRuleKey, number>;

// Runtime guard (vitest tests also assert this; kept here as belt-and-suspenders).
// A compile-time assertion isn't possible because TS can't reduce literal union types.
// Guard runs unconditionally: a misconfigured weights table would silently score every
// article incorrectly in production, not just in development.
{
  const _sum = (Object.values(WEIGHTS) as number[]).reduce((a, b) => a + b, 0);
  if (_sum !== 100) {
    throw new Error(`SEO WEIGHTS must sum to 100, got ${_sum}`);
  }
}

// ── Thresholds ────────────────────────────────────────────────────────────────

/**
 * Overall score → SeoVerdict classification.
 * Defined as inclusive lower bounds so `score >= THRESHOLDS.READY` is readable.
 */
export const THRESHOLDS = {
  /** Score ≥ 80 → article is publish-ready */
  READY: 80,
  /** Score 60–79 → article needs further work before publishing */
  NEEDS_WORK: 60,
  /** Score < 60 → article should be rejected and rewritten */
  REJECT: 0,
} as const;

// ── Validator limits ──────────────────────────────────────────────────────────

/** H1 character counts. Warn band allows for slightly longer display H1s. */
export const H1_LIMITS = {
  MIN_PASS: 30,
  MAX_PASS: 70,
  MAX_WARN: 100,
} as const;

/** Meta description character counts. Google typically displays 155–160. */
export const META_LIMITS = {
  MIN_WARN: 120,
  MIN_PASS: 150,
  MAX_PASS: 160,
  MAX_WARN: 175,
} as const;

/** Keyword density as percentage of total words. */
export const DENSITY_LIMITS = {
  MIN_WARN: 0.5,
  MIN_PASS: 0.8,
  MAX_PASS: 2.5,
  MAX_WARN: 3.5,
} as const;

/** Flesch Reading Ease score — higher is easier to read. */
export const READABILITY_LIMITS = {
  /** ≥ 60 is easy enough for a general business audience */
  MIN_PASS: 60,
  /** 45–59 is acceptable (professional/technical content) */
  MIN_WARN: 45,
} as const;

/** Minimum count of accepted internal links in the article body. */
export const INTERNAL_LINK_LIMITS = {
  MIN_PASS: 2,
  MIN_WARN: 1,
} as const;
