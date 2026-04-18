import 'server-only';

import type { RuleResult, SEOReport } from '@/types/seo';
import type { SeoVerdict } from '@/types/database';
import { WEIGHTS, THRESHOLDS } from './constants';
import type { SeoRuleKey } from './constants';

/**
 * Multiplier applied to a rule's weight based on its verdict.
 * pass → full contribution, warn → half, fail → zero.
 */
const VERDICT_MULTIPLIER: Record<RuleResult['verdict'], number> = {
  pass: 1.0,
  warn: 0.5,
  fail: 0.0,
};

/**
 * Computes the weighted 0–100 SEO score from an array of rule results.
 *
 * Score = Σ(weight[key] × multiplier[verdict])
 *
 * Rules with unknown keys are ignored (forward-compat: old score won't break
 * if a new rule key is added before the old validator is deployed).
 */
export function computeScore(results: readonly RuleResult[]): number {
  let score = 0;
  for (const result of results) {
    const weight = WEIGHTS[result.key as SeoRuleKey] ?? 0;
    const multiplier = VERDICT_MULTIPLIER[result.verdict];
    score += weight * multiplier;
  }
  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Maps an overall score to a SeoVerdict tier.
 *
 *   ≥ 80 → 'ready'       — publish immediately
 *   60–79 → 'needs_work' — fix warns before publishing
 *   < 60 → 'reject'      — substantial rewrite required
 *
 * 'pending' is the initial DB state; it is never returned from scoring.
 */
export function scoreToVerdict(score: number): Exclude<SeoVerdict, 'pending'> {
  if (score >= THRESHOLDS.READY) return 'ready';
  if (score >= THRESHOLDS.NEEDS_WORK) return 'needs_work';
  return 'reject';
}

/**
 * Assembles a complete SEOReport from a set of rule results.
 */
export function buildSeoReport(
  articleId: string,
  results: readonly RuleResult[],
): SEOReport {
  const overallScore = computeScore(results);
  return {
    articleId,
    overallScore,
    verdict: scoreToVerdict(overallScore),
    results,
    createdAt: new Date().toISOString(),
  };
}
