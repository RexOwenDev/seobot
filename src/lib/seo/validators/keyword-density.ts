import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES, DENSITY_LIMITS } from '../constants';

/**
 * Counts non-overlapping occurrences of `phrase` (case-insensitive) in `text`.
 * Uses a simple indexOf loop rather than regex to avoid ReDoS on long bodies.
 */
function countPhraseOccurrences(text: string, phrase: string): number {
  if (phrase.length === 0) return 0;
  let count = 0;
  let index = 0;
  const lowerText = text.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  while ((index = lowerText.indexOf(lowerPhrase, index)) !== -1) {
    count++;
    index += lowerPhrase.length;
  }
  return count;
}

/**
 * Approximate word count from a markdown string.
 * Strips markdown syntax (links, headers, bold, italic) before counting.
 */
function countWords(markdown: string): number {
  const stripped = markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/[#*_`>~|]/g, ' ')               // strip markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length === 0) return 0;
  return stripped.split(' ').filter(w => w.length > 0).length;
}

/**
 * Validates keyword density in the article body.
 *
 * Formula: density% = (occurrences × phraseWordCount) / totalWords × 100
 *
 * This phrase-level formula is more accurate than raw occurrence / totalWords
 * because it accounts for the actual word real-estate the phrase occupies.
 *
 * Targets:
 *   pass  0.8%–2.5% — well-optimised without stuffing
 *   warn  0.5%–0.79% (under-optimised) or 2.6%–3.5% (approaching stuffing)
 *   fail  <0.5% (keyword absent) or >3.5% (keyword stuffing)
 */
export function validateKeywordDensity(draft: Draft, keyword: string): RuleResult {
  const body = draft.bodyMarkdown.trim();
  const totalWords = countWords(body);

  if (totalWords < 50) {
    return {
      key: SEO_RULES.KEYWORD_DENSITY,
      verdict: 'warn',
      message: 'Article body is too short to meaningfully assess keyword density',
      details: { totalWords, occurrences: 0, densityPct: 0, keyword },
    };
  }

  const kwNorm = keyword.toLowerCase().trim();
  const phraseWordCount = kwNorm.split(/\s+/).filter(Boolean).length;
  const occurrences = countPhraseOccurrences(body, kwNorm);
  const densityPct =
    totalWords > 0 ? (occurrences * phraseWordCount) / totalWords * 100 : 0;
  const densityRounded = Math.round(densityPct * 10) / 10;

  if (densityPct < DENSITY_LIMITS.MIN_WARN) {
    return {
      key: SEO_RULES.KEYWORD_DENSITY,
      verdict: 'fail',
      message: `Keyword density is ${densityRounded}% — keyword appears under-optimised (target: ${DENSITY_LIMITS.MIN_PASS}%–${DENSITY_LIMITS.MAX_PASS}%)`,
      details: { totalWords, occurrences, densityPct: densityRounded, keyword, phraseWordCount },
    };
  }

  if (densityPct > DENSITY_LIMITS.MAX_WARN) {
    return {
      key: SEO_RULES.KEYWORD_DENSITY,
      verdict: 'fail',
      message: `Keyword density is ${densityRounded}% — keyword stuffing detected (limit: ${DENSITY_LIMITS.MAX_WARN}%)`,
      details: { totalWords, occurrences, densityPct: densityRounded, keyword, phraseWordCount },
    };
  }

  if (densityPct < DENSITY_LIMITS.MIN_PASS) {
    return {
      key: SEO_RULES.KEYWORD_DENSITY,
      verdict: 'warn',
      message: `Keyword density is ${densityRounded}% — slightly under target (${DENSITY_LIMITS.MIN_PASS}%–${DENSITY_LIMITS.MAX_PASS}%)`,
      details: { totalWords, occurrences, densityPct: densityRounded, keyword, phraseWordCount },
    };
  }

  if (densityPct > DENSITY_LIMITS.MAX_PASS) {
    return {
      key: SEO_RULES.KEYWORD_DENSITY,
      verdict: 'warn',
      message: `Keyword density is ${densityRounded}% — slightly above target, watch for stuffing`,
      details: { totalWords, occurrences, densityPct: densityRounded, keyword, phraseWordCount },
    };
  }

  return {
    key: SEO_RULES.KEYWORD_DENSITY,
    verdict: 'pass',
    message: `Keyword density is ${densityRounded}% — well-optimised`,
    details: { totalWords, occurrences, densityPct: densityRounded, keyword, phraseWordCount },
  };
}
