import 'server-only';

import type { RuleResult, SEOReport } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { buildSeoReport } from '../scoring';

// Individual validator imports
import { validateH1 } from './h1';
import { validateMetaDescription } from './meta-description';
import { validateHeadingHierarchy } from './heading-hierarchy';
import { validateKeywordDensity } from './keyword-density';
import { validateReadability } from './readability';
import { validateInternalLinks } from './internal-links';
import { validateSchemaOrg } from './schema-org';
import { validateCanonical } from './canonical';

export type { RuleResult, SEOReport };

// Re-export individual validators for callers who need them separately
export {
  validateH1,
  validateMetaDescription,
  validateHeadingHierarchy,
  validateKeywordDensity,
  validateReadability,
  validateInternalLinks,
  validateSchemaOrg,
  validateCanonical,
};

/**
 * Runs all SEO validators against a draft and returns a complete SEOReport.
 *
 * @param articleId - UUID of the article being validated (stored in seo_audits)
 * @param draft     - The fully-formed draft from the pipeline
 * @param keyword   - The primary keyword phrase this article was written for
 *
 * This function is pure and synchronous. It performs no I/O and can be called
 * in a Server Component, a server action, or a background job.
 *
 * Rule execution order matches the WEIGHTS declaration in constants.ts:
 *   H1 (length + keyword) → Meta (length + keyword) → Hierarchy →
 *   Keyword density → Readability → Internal links → Schema → Canonical
 */
export function validateArticle(
  articleId: string,
  draft: Draft,
  keyword: string,
): SEOReport {
  const results: RuleResult[] = [
    ...validateH1(draft, keyword),
    ...validateMetaDescription(draft, keyword),
    validateHeadingHierarchy(draft),
    validateKeywordDensity(draft, keyword),
    validateReadability(draft),
    validateInternalLinks(draft),
    validateSchemaOrg(draft),
    validateCanonical(draft),
  ];

  return buildSeoReport(articleId, results);
}
