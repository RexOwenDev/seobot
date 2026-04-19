import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES, READABILITY_LIMITS } from '../constants';

/**
 * Counts syllables in a single word via vowel-group approximation.
 *
 * Accuracy note: this is a heuristic, not a phonetic syllabification library.
 * It underestimates silent-e patterns (e.g. "fire" → 1 instead of 2).
 * Sufficient for relative comparison; replace with a proper library in production.
 */
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length === 0) return 0;
  // Include 'y' as a vowel — it acts as a vowel in words like "gym", "rhythm", "system"
  const matches = clean.match(/[aeiouy]+/g);
  return Math.max(1, matches?.length ?? 1);
}

/**
 * Strips markdown syntax and returns plain text suitable for readability analysis.
 */
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [text](url) → text
    .replace(/[#*_`>~|]/g, ' ')                // strip symbols
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Counts sentences by splitting on terminal punctuation followed by whitespace or end-of-string.
 * Handles abbreviations poorly — acceptable for a readability stub.
 *
 * Fix note: the original `/[.!?]+[\s$]/g` had `$` inside a character class, making it
 * a literal dollar sign rather than an end-of-string anchor. The final sentence of any
 * text (not followed by whitespace) was therefore not counted. Replaced with a lookahead.
 */
function countSentences(text: string): number {
  const matches = text.match(/[.!?]+(?=\s|$)/g);
  // Minimum 1 sentence even if no terminal punctuation found
  return Math.max(1, matches?.length ?? 1);
}

/**
 * Computes the Flesch Reading Ease score.
 *
 * Formula: FRE = 206.835 − 1.015 × (words/sentences) − 84.6 × (syllables/words)
 *
 * Score interpretation:
 *   90–100  Very easy (5th grade)
 *   70–90   Easy (6th grade)
 *   60–70   Standard (7th grade) ← target for business content
 *   50–60   Fairly difficult (8th–9th grade)
 *   30–50   Difficult (college level)
 *   0–30    Very difficult (professional/academic)
 */
function fleschReadingEase(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  // Note: the outer validateReadability guard ensures word count >= 50 before calling
  // this function, so a separate < 10 guard here is unreachable dead code (removed).
  const wordCount = words.length;
  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const asl = wordCount / sentenceCount;       // average sentence length
  const asw = syllableCount / wordCount;        // average syllables per word

  const fre = 206.835 - 1.015 * asl - 84.6 * asw;
  // Clamp to [0, 100] — formula can produce values outside range on very unusual text
  return Math.min(100, Math.max(0, fre));
}

/**
 * Validates article readability using the Flesch Reading Ease formula.
 *
 * Target audience: digital marketing agencies and their clients (business-level reading).
 *   pass  FRE ≥ 60 — accessible to a general business audience
 *   warn  FRE 45–59 — professional-level, appropriate for technical niches
 *   fail  FRE < 45 — too dense; will reduce time-on-page and dwell signals
 */
export function validateReadability(draft: Draft): RuleResult {
  const plainText = stripMarkdown(draft.bodyMarkdown);

  if (plainText.split(/\s+/).filter(Boolean).length < 50) {
    return {
      key: SEO_RULES.READABILITY,
      verdict: 'warn',
      message: 'Article body too short for reliable readability scoring',
      details: { fleschScore: null, wordCount: 0 },
    };
  }

  const score = fleschReadingEase(plainText);
  const scoreRounded = Math.round(score);

  if (score < READABILITY_LIMITS.MIN_WARN) {
    return {
      key: SEO_RULES.READABILITY,
      verdict: 'fail',
      message: `Flesch Reading Ease score is ${scoreRounded} — too complex for general business audience (minimum: ${READABILITY_LIMITS.MIN_WARN})`,
      details: { fleschScore: scoreRounded, minPass: READABILITY_LIMITS.MIN_PASS, minWarn: READABILITY_LIMITS.MIN_WARN },
    };
  }

  if (score < READABILITY_LIMITS.MIN_PASS) {
    return {
      key: SEO_RULES.READABILITY,
      verdict: 'warn',
      message: `Flesch Reading Ease score is ${scoreRounded} — acceptable for technical content but below general target (${READABILITY_LIMITS.MIN_PASS})`,
      details: { fleschScore: scoreRounded, minPass: READABILITY_LIMITS.MIN_PASS, minWarn: READABILITY_LIMITS.MIN_WARN },
    };
  }

  return {
    key: SEO_RULES.READABILITY,
    verdict: 'pass',
    message: `Flesch Reading Ease score is ${scoreRounded} — accessible to a general business audience`,
    details: { fleschScore: scoreRounded, minPass: READABILITY_LIMITS.MIN_PASS, minWarn: READABILITY_LIMITS.MIN_WARN },
  };
}
