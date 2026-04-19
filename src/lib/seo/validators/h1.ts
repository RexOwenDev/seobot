import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES, H1_LIMITS } from '../constants';

/**
 * Validates H1 character length.
 *
 * Rules:
 *   pass  30–70 chars — ideal for display + SEO signal
 *   warn  71–100 chars — acceptable but may truncate in SERPs
 *   warn  20–29 chars — short H1 reduces topical authority signal
 *   fail  < 20 chars or > 100 chars — too short to convey topic, or ignored by engines
 */
export function validateH1Length(draft: Draft): RuleResult {
  const len = draft.h1.trim().length;

  if (len === 0) {
    return {
      key: SEO_RULES.H1_LENGTH,
      verdict: 'fail',
      message: 'H1 is empty',
      details: { length: 0, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
    };
  }

  if (len < 20) {
    return {
      key: SEO_RULES.H1_LENGTH,
      verdict: 'fail',
      message: `H1 too short (${len} chars) — minimum is 20 for meaningful topical signal`,
      details: { length: len, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
    };
  }

  if (len > H1_LIMITS.MAX_WARN) {
    return {
      key: SEO_RULES.H1_LENGTH,
      verdict: 'fail',
      message: `H1 too long (${len} chars) — exceeds ${H1_LIMITS.MAX_WARN} char limit`,
      details: { length: len, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
    };
  }

  if (len < H1_LIMITS.MIN_PASS) {
    return {
      key: SEO_RULES.H1_LENGTH,
      verdict: 'warn',
      message: `H1 is short (${len} chars) — aim for ${H1_LIMITS.MIN_PASS}–${H1_LIMITS.MAX_PASS} chars`,
      details: { length: len, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
    };
  }

  if (len > H1_LIMITS.MAX_PASS) {
    return {
      key: SEO_RULES.H1_LENGTH,
      verdict: 'warn',
      message: `H1 is long (${len} chars) — may truncate in SERP display`,
      details: { length: len, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
    };
  }

  return {
    key: SEO_RULES.H1_LENGTH,
    verdict: 'pass',
    message: `H1 length is ${len} chars — within ${H1_LIMITS.MIN_PASS}–${H1_LIMITS.MAX_PASS} range`,
    details: { length: len, minPass: H1_LIMITS.MIN_PASS, maxPass: H1_LIMITS.MAX_PASS },
  };
}

/**
 * Validates that the primary keyword phrase appears in the H1.
 *
 * Exact match (case-insensitive) is checked first.
 * If the exact phrase is absent, we check whether the majority of individual
 * keyword words are present (loose match → warn rather than fail).
 */
export function validateH1Keyword(draft: Draft, keyword: string): RuleResult {
  const h1Lower = draft.h1.toLowerCase();
  const kwLower = keyword.toLowerCase().trim();

  // Guard: String.prototype.includes('') always returns true, so an empty keyword
  // would incorrectly score 'pass' for every article. Fail explicitly instead.
  if (!kwLower) {
    return {
      key: SEO_RULES.H1_KEYWORD,
      verdict: 'fail',
      message: 'No keyword provided — cannot validate H1 keyword presence',
      details: { keyword, h1: draft.h1, exactMatch: false },
    };
  }

  if (h1Lower.includes(kwLower)) {
    return {
      key: SEO_RULES.H1_KEYWORD,
      verdict: 'pass',
      message: 'Primary keyword phrase found in H1',
      details: { keyword, h1: draft.h1, exactMatch: true },
    };
  }

  // Loose check: are most keyword words present individually?
  const kwWords = kwLower.split(/\s+/).filter(Boolean);
  const foundWords = kwWords.filter(word => h1Lower.includes(word));
  const coverage = kwWords.length > 0 ? foundWords.length / kwWords.length : 0;

  if (coverage >= 0.75) {
    return {
      key: SEO_RULES.H1_KEYWORD,
      verdict: 'warn',
      message: `Keyword words present but phrase not exact — ${foundWords.length}/${kwWords.length} words found`,
      details: { keyword, h1: draft.h1, exactMatch: false, wordCoverage: coverage },
    };
  }

  return {
    key: SEO_RULES.H1_KEYWORD,
    verdict: 'fail',
    message: `Primary keyword "${keyword}" is absent from H1`,
    details: { keyword, h1: draft.h1, exactMatch: false, wordCoverage: coverage },
  };
}

/** Runs both H1 validators and returns results in declaration order. */
export function validateH1(draft: Draft, keyword: string): readonly RuleResult[] {
  return [validateH1Length(draft), validateH1Keyword(draft, keyword)];
}
