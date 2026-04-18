import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES } from '../constants';

interface HierarchyViolation {
  readonly position: number;
  readonly fromLevel: number;
  readonly toLevel: number;
}

/**
 * Validates that headings don't skip levels.
 *
 * Allowed:  H2 → H3, H3 → H2 (closing a subsection), H3 → H3 (sibling)
 * Violation: H2 → H4 (skips H3), H3 → H5 (out of our 2–4 range)
 *
 * Rule: a heading level may only increase by 1 at a time (no skipping down),
 * but may decrease by any amount (closing multiple subsection levels is fine).
 */
export function validateHeadingHierarchy(draft: Draft): RuleResult {
  const sections = draft.sections;

  if (sections.length === 0) {
    return {
      key: SEO_RULES.HEADING_HIERARCHY,
      verdict: 'warn',
      message: 'No H2–H4 sections found — article has no structured heading hierarchy',
      details: { sectionCount: 0, violations: [] },
    };
  }

  const violations: HierarchyViolation[] = [];

  for (let i = 1; i < sections.length; i++) {
    const prev = sections[i - 1];
    const curr = sections[i];

    // Safety guard for noUncheckedIndexedAccess
    if (prev === undefined || curr === undefined) continue;

    const levelDiff = curr.level - prev.level;

    // A jump of +2 or more means a skipped heading level
    if (levelDiff > 1) {
      violations.push({
        position: curr.position,
        fromLevel: prev.level,
        toLevel: curr.level,
      });
    }
  }

  if (violations.length > 0) {
    const first = violations[0];
    return {
      key: SEO_RULES.HEADING_HIERARCHY,
      verdict: 'fail',
      message: `${violations.length} heading level skip(s) detected — e.g. H${first?.fromLevel} → H${first?.toLevel} at position ${first?.position}`,
      details: { sectionCount: sections.length, violations },
    };
  }

  return {
    key: SEO_RULES.HEADING_HIERARCHY,
    verdict: 'pass',
    message: `Heading hierarchy is valid across ${sections.length} sections`,
    details: { sectionCount: sections.length, violations: [] },
  };
}
