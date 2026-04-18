import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES, META_LIMITS } from '../constants';

/**
 * Validates meta description character length.
 *
 * Google typically displays 155–160 chars in SERPs.
 * Under 120 chars wastes description real estate.
 * Over 175 chars will be truncated.
 */
export function validateMetaLength(draft: Draft): RuleResult {
  const len = draft.metaDescription.trim().length;

  if (len === 0) {
    return {
      key: SEO_RULES.META_LENGTH,
      verdict: 'fail',
      message: 'Meta description is empty',
      details: { length: 0, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
    };
  }

  if (len < META_LIMITS.MIN_WARN) {
    return {
      key: SEO_RULES.META_LENGTH,
      verdict: 'fail',
      message: `Meta description too short (${len} chars) — Google may auto-generate a snippet instead`,
      details: { length: len, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
    };
  }

  if (len > META_LIMITS.MAX_WARN) {
    return {
      key: SEO_RULES.META_LENGTH,
      verdict: 'fail',
      message: `Meta description too long (${len} chars) — will be truncated by search engines`,
      details: { length: len, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
    };
  }

  if (len < META_LIMITS.MIN_PASS) {
    return {
      key: SEO_RULES.META_LENGTH,
      verdict: 'warn',
      message: `Meta description is short (${len} chars) — aim for ${META_LIMITS.MIN_PASS}–${META_LIMITS.MAX_PASS} chars`,
      details: { length: len, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
    };
  }

  if (len > META_LIMITS.MAX_PASS) {
    return {
      key: SEO_RULES.META_LENGTH,
      verdict: 'warn',
      message: `Meta description is long (${len} chars) — approaching truncation limit`,
      details: { length: len, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
    };
  }

  return {
    key: SEO_RULES.META_LENGTH,
    verdict: 'pass',
    message: `Meta description is ${len} chars — within ${META_LIMITS.MIN_PASS}–${META_LIMITS.MAX_PASS} range`,
    details: { length: len, minPass: META_LIMITS.MIN_PASS, maxPass: META_LIMITS.MAX_PASS },
  };
}

/**
 * Validates that the primary keyword appears in the meta description.
 * Uses the same exact-then-loose matching as h1.ts.
 */
export function validateMetaKeyword(draft: Draft, keyword: string): RuleResult {
  const metaLower = draft.metaDescription.toLowerCase();
  const kwLower = keyword.toLowerCase().trim();

  if (metaLower.includes(kwLower)) {
    return {
      key: SEO_RULES.META_KEYWORD,
      verdict: 'pass',
      message: 'Primary keyword phrase found in meta description',
      details: { keyword, exactMatch: true },
    };
  }

  const kwWords = kwLower.split(/\s+/).filter(Boolean);
  const foundWords = kwWords.filter(word => metaLower.includes(word));
  const coverage = kwWords.length > 0 ? foundWords.length / kwWords.length : 0;

  if (coverage >= 0.75) {
    return {
      key: SEO_RULES.META_KEYWORD,
      verdict: 'warn',
      message: `Keyword words present but phrase not exact — ${foundWords.length}/${kwWords.length} words found`,
      details: { keyword, exactMatch: false, wordCoverage: coverage },
    };
  }

  return {
    key: SEO_RULES.META_KEYWORD,
    verdict: 'fail',
    message: `Primary keyword "${keyword}" is absent from meta description`,
    details: { keyword, exactMatch: false, wordCoverage: coverage },
  };
}

/** Runs both meta description validators. */
export function validateMetaDescription(draft: Draft, keyword: string): readonly RuleResult[] {
  return [validateMetaLength(draft), validateMetaKeyword(draft, keyword)];
}
