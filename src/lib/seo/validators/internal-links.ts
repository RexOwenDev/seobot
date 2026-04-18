import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES, INTERNAL_LINK_LIMITS } from '../constants';

/**
 * Extracts markdown links from a body string.
 * Returns an array of { text, href } tuples.
 */
function extractMarkdownLinks(markdown: string): readonly { text: string; href: string }[] {
  const RE = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: { text: string; href: string }[] = [];
  let m: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((m = RE.exec(markdown)) !== null) {
    const text = m[1] ?? '';
    const href = m[2] ?? '';
    links.push({ text, href });
  }
  return links;
}

/**
 * Determines whether a link href is internal.
 *
 * Internal = relative path (starts with /) or same-site absolute URL.
 * External = http/https to a different domain, mailto:, tel:, etc.
 *
 * Anchor-only links (#section) are internal by definition but excluded from
 * the minimum count because they don't transfer authority or aid discovery.
 */
function isExternalLink(href: string): boolean {
  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  );
}

function isAnchorOnlyLink(href: string): boolean {
  return href.trim().startsWith('#');
}

/**
 * Validates that the article body contains a sufficient number of internal links.
 *
 * SEO rationale: internal links distribute PageRank across the site, improve
 * crawlability, and signal topical depth to search engines.
 *
 *   pass  ≥ 2 distinct internal links
 *   warn  1 internal link — present but insufficient
 *   fail  0 internal links
 */
export function validateInternalLinks(draft: Draft): RuleResult {
  const allLinks = extractMarkdownLinks(draft.bodyMarkdown);
  const internalLinks = allLinks.filter(
    l => !isExternalLink(l.href) && !isAnchorOnlyLink(l.href),
  );

  // Deduplicate by href to avoid counting the same target multiple times
  const uniqueHrefs = new Set(internalLinks.map(l => l.href.toLowerCase()));
  const uniqueCount = uniqueHrefs.size;

  if (uniqueCount === 0) {
    return {
      key: SEO_RULES.INTERNAL_LINKS,
      verdict: 'fail',
      message: `No internal links found — minimum is ${INTERNAL_LINK_LIMITS.MIN_WARN} (recommend ${INTERNAL_LINK_LIMITS.MIN_PASS}+)`,
      details: {
        totalLinks: allLinks.length,
        internalLinkCount: uniqueCount,
        minPass: INTERNAL_LINK_LIMITS.MIN_PASS,
      },
    };
  }

  if (uniqueCount < INTERNAL_LINK_LIMITS.MIN_PASS) {
    return {
      key: SEO_RULES.INTERNAL_LINKS,
      verdict: 'warn',
      message: `Only ${uniqueCount} internal link(s) found — recommend at least ${INTERNAL_LINK_LIMITS.MIN_PASS}`,
      details: {
        totalLinks: allLinks.length,
        internalLinkCount: uniqueCount,
        minPass: INTERNAL_LINK_LIMITS.MIN_PASS,
      },
    };
  }

  return {
    key: SEO_RULES.INTERNAL_LINKS,
    verdict: 'pass',
    message: `${uniqueCount} internal link(s) found`,
    details: {
      totalLinks: allLinks.length,
      internalLinkCount: uniqueCount,
      minPass: INTERNAL_LINK_LIMITS.MIN_PASS,
    },
  };
}
