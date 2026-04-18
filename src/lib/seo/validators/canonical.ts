import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES } from '../constants';

/** Basic URL shape check — must be an absolute https URL. */
function isValidAbsoluteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Validates that the canonical URL is set and well-formed.
 *
 * SEO rationale: without a canonical tag, search engines must infer the
 * canonical URL, which can cause duplicate-content dilution when the same
 * article is accessible via multiple paths (tag pages, pagination, etc.).
 *
 *   pass  canonicalUrl is a valid https absolute URL
 *   warn  canonicalUrl is null — will default to publish URL, acceptable but not ideal
 *   fail  canonicalUrl is set but malformed (e.g. relative path, http not https)
 */
export function validateCanonical(draft: Draft): RuleResult {
  const url = draft.canonicalUrl;

  if (url === null) {
    return {
      key: SEO_RULES.CANONICAL_URL,
      verdict: 'warn',
      message: 'Canonical URL not set — will default to publish URL, which may cause duplicate-content issues',
      details: { canonicalUrl: null },
    };
  }

  if (isValidAbsoluteUrl(url)) {
    return {
      key: SEO_RULES.CANONICAL_URL,
      verdict: 'pass',
      message: `Canonical URL is set and valid: ${url}`,
      details: { canonicalUrl: url },
    };
  }

  // URL is set but malformed
  return {
    key: SEO_RULES.CANONICAL_URL,
    verdict: 'fail',
    message: `Canonical URL "${url}" is malformed — must be an absolute https URL`,
    details: { canonicalUrl: url },
  };
}
