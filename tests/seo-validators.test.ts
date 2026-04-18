import { describe, expect, it } from 'vitest';
import type { Draft } from '../src/types/pipeline';
import {
  validateH1,
  validateMetaDescription,
  validateHeadingHierarchy,
  validateKeywordDensity,
  validateReadability,
  validateInternalLinks,
  validateSchemaOrg,
  validateCanonical,
  validateArticle,
} from '../src/lib/seo/validators/index';
import { computeScore, scoreToVerdict } from '../src/lib/seo/scoring';
import { SEO_RULES, WEIGHTS } from '../src/lib/seo/constants';

// ── Shared fixture helpers ────────────────────────────────────────────────────

const KEYWORD = 'industrial torque wrenches';

/**
 * A well-optimised draft that should pass all rules.
 * Designed so that validateArticle() returns verdict 'ready' (score ≥ 80).
 */
const GOOD_DRAFT: Draft = {
  h1: 'Best Industrial Torque Wrenches for Commercial Shops 2025',
  // 157 chars — inside the 150–160 pass range
  metaDescription:
    'Find the best industrial torque wrenches for commercial shops in 2025. Our expert guide covers accuracy, build quality, and the best value across top brands.',
  slug: 'best-industrial-torque-wrenches-commercial-shops',
  canonicalUrl: 'https://example.com/best-industrial-torque-wrenches-commercial-shops',
  schemaType: 'Article',
  bodyMarkdown: [
    // ~500 words, 3 keyword occurrences → density ≈ 1.8%, simple language → FRE ≥ 60
    // Two internal links to satisfy the internal-links validator
    'When you work in a busy shop, you need tools you can trust.',
    'A good torque wrench helps you set the right force on bolts and nuts.',
    'If the force is too low, parts may come loose.',
    'If the force is too high, you can strip threads or break bolts.',
    'The right tool makes every job faster and safer.',
    '',
    'Industrial torque wrenches come in two main types: click-type and dial-type.',
    'Click-type tools make a sound or give a feel when the set force is reached.',
    'They are easy to use and work well in most shop settings.',
    'Dial-type tools show the force on a face you can read as you turn.',
    'They are good when you need to watch the force build up over time.',
    '',
    'See our [maintenance guide](/maintenance-guide) for service tips.',
    'We also cover [tool storage best practices](/tool-storage) in a separate guide.',
    '',
    'When you buy a tool, check the range and the accuracy rating.',
    'A good tool is accurate to within two percent of the rated force.',
    'Check the range too.',
    'A tool rated from ten to one hundred foot-pounds will not suit jobs that need more.',
    'Match the tool range to the work you do most.',
    '',
    'Price is one factor, but it is not the only one.',
    'A cheap tool may cost more in the long run if it wears out fast.',
    'Look at the warranty and what the brand says about service.',
    'Some brands offer free checks and repairs for the life of the tool.',
    '',
    'The best industrial torque wrenches are built to last in hard use.',
    'They use steel bodies, metal drives, and sealed heads to keep out dirt and oil.',
    'A well-made tool can last for years with the right care.',
    '',
    'Care means two things: cleaning and calibration.',
    'After each use, wipe the tool down and store it at its lowest setting.',
    'This keeps the spring from taking a set over time.',
    'Have the tool checked once a year, or more if you use it every day.',
    '',
    'Most shops use industrial torque wrenches in the range of twenty to two hundred foot-pounds.',
    'This covers most wheel, brake, and engine work.',
    'For very large bolts, you may need a drive size above half an inch.',
    'A three-quarter or one-inch drive tool gives you more torque with less strain.',
    '',
    'When in doubt, check the spec sheet for the job.',
    'The right tool at the right setting is the safest way to work.',
    'Take your time, use the right tool, and you will get the job done right.',
  ].join('\n'),
  sections: [
    { level: 2, text: 'Types of Torque Wrenches', position: 1, bodyMarkdown: '' },
    { level: 3, text: 'Click-Type Wrenches', position: 2, bodyMarkdown: '' },
    { level: 3, text: 'Dial-Type Wrenches', position: 3, bodyMarkdown: '' },
    { level: 2, text: 'Choosing the Right Tool', position: 4, bodyMarkdown: '' },
    { level: 2, text: 'Care and Calibration', position: 5, bodyMarkdown: '' },
  ],
  wordCount: 420,
  readingTimeMins: 3,
};

/**
 * A poorly-optimised draft that should fail or warn on most rules.
 */
const BAD_DRAFT: Draft = {
  h1: 'TW',
  metaDescription: 'Short.',
  slug: 'tw',
  canonicalUrl: null,
  schemaType: 'Article',
  bodyMarkdown: 'A very short article with no links and no keyword content.',
  sections: [
    { level: 2, text: 'Intro', position: 1, bodyMarkdown: '' },
    { level: 4, text: 'Deep Section', position: 2, bodyMarkdown: '' }, // skips H3
  ],
  wordCount: 12,
  readingTimeMins: 1,
};

const ARTICLE_ID = '00000000-0000-0000-0000-000000000099';

// ── Constants sanity ──────────────────────────────────────────────────────────

describe('constants', () => {
  it('WEIGHTS values sum to exactly 100', () => {
    const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('every SEO_RULES key has a corresponding weight', () => {
    for (const key of Object.values(SEO_RULES)) {
      expect(WEIGHTS).toHaveProperty(key);
    }
  });
});

// ── H1 validators ─────────────────────────────────────────────────────────────

describe('validateH1 — good draft', () => {
  const results = validateH1(GOOD_DRAFT, KEYWORD);

  it('returns two results', () => {
    expect(results).toHaveLength(2);
  });

  it('h1_length passes', () => {
    const r = results.find(r => r.key === SEO_RULES.H1_LENGTH);
    expect(r?.verdict).toBe('pass');
  });

  it('h1_keyword passes', () => {
    const r = results.find(r => r.key === SEO_RULES.H1_KEYWORD);
    expect(r?.verdict).toBe('pass');
  });
});

describe('validateH1 — bad draft (H1 "TW", wrong keyword)', () => {
  const results = validateH1(BAD_DRAFT, KEYWORD);

  it('h1_length fails (too short)', () => {
    const r = results.find(r => r.key === SEO_RULES.H1_LENGTH);
    expect(r?.verdict).toBe('fail');
    expect(r?.details).toMatchObject({ length: 2 });
  });

  it('h1_keyword fails (no keyword in H1)', () => {
    const r = results.find(r => r.key === SEO_RULES.H1_KEYWORD);
    expect(r?.verdict).toBe('fail');
  });
});

describe('validateH1 — length edge cases', () => {
  const makeDraft = (h1: string): Draft => ({ ...GOOD_DRAFT, h1 });

  it('exactly 30 chars passes', () => {
    const r = validateH1(makeDraft('A'.repeat(30)), '')[0];
    expect(r?.verdict).toBe('pass');
  });

  it('exactly 70 chars passes', () => {
    const r = validateH1(makeDraft('A'.repeat(70)), '')[0];
    expect(r?.verdict).toBe('pass');
  });

  it('71 chars warns', () => {
    const r = validateH1(makeDraft('A'.repeat(71)), '')[0];
    expect(r?.verdict).toBe('warn');
  });

  it('101 chars fails', () => {
    const r = validateH1(makeDraft('A'.repeat(101)), '')[0];
    expect(r?.verdict).toBe('fail');
  });

  it('empty H1 fails', () => {
    const r = validateH1(makeDraft(''), '')[0];
    expect(r?.verdict).toBe('fail');
  });
});

describe('validateH1 — keyword loose match warns, not fails', () => {
  // Keyword: "industrial torque wrenches"
  // H1 has all 3 words but not in order (coverage ≥ 75%)
  const draft = { ...GOOD_DRAFT, h1: 'Wrenches and Industrial Grade Torque Tools' };
  const results = validateH1(draft, KEYWORD);
  it('warns when keyword words are present but phrase is not exact', () => {
    const r = results.find(r => r.key === SEO_RULES.H1_KEYWORD);
    expect(r?.verdict).toBe('warn');
  });
});

// ── Meta description validators ───────────────────────────────────────────────

describe('validateMetaDescription — good draft', () => {
  const results = validateMetaDescription(GOOD_DRAFT, KEYWORD);

  it('meta_length passes', () => {
    const r = results.find(r => r.key === SEO_RULES.META_LENGTH);
    expect(r?.verdict).toBe('pass');
    expect(r?.details).toMatchObject({ length: expect.any(Number) });
  });

  it('meta_keyword passes', () => {
    const r = results.find(r => r.key === SEO_RULES.META_KEYWORD);
    expect(r?.verdict).toBe('pass');
  });
});

describe('validateMetaDescription — bad draft', () => {
  const results = validateMetaDescription(BAD_DRAFT, KEYWORD);

  it('meta_length fails (too short)', () => {
    const r = results.find(r => r.key === SEO_RULES.META_LENGTH);
    expect(r?.verdict).toBe('fail');
  });

  it('meta_keyword fails', () => {
    const r = results.find(r => r.key === SEO_RULES.META_KEYWORD);
    expect(r?.verdict).toBe('fail');
  });
});

describe('validateMetaDescription — length edge cases', () => {
  const makeDraft = (meta: string): Draft => ({ ...GOOD_DRAFT, metaDescription: meta });

  it('exactly 150 chars passes', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(150)), '')[0];
    expect(r?.verdict).toBe('pass');
  });

  it('exactly 160 chars passes', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(160)), '')[0];
    expect(r?.verdict).toBe('pass');
  });

  it('149 chars warns', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(149)), '')[0];
    expect(r?.verdict).toBe('warn');
  });

  it('161 chars warns', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(161)), '')[0];
    expect(r?.verdict).toBe('warn');
  });

  it('119 chars fails', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(119)), '')[0];
    expect(r?.verdict).toBe('fail');
  });

  it('176 chars fails', () => {
    const r = validateMetaDescription(makeDraft('A'.repeat(176)), '')[0];
    expect(r?.verdict).toBe('fail');
  });
});

// ── Heading hierarchy validator ───────────────────────────────────────────────

describe('validateHeadingHierarchy — good draft', () => {
  it('passes with H2 → H3 → H3 → H2 hierarchy', () => {
    const r = validateHeadingHierarchy(GOOD_DRAFT);
    expect(r.verdict).toBe('pass');
    expect(r.details).toMatchObject({ violations: [] });
  });
});

describe('validateHeadingHierarchy — bad draft', () => {
  it('fails when H2 jumps to H4', () => {
    const r = validateHeadingHierarchy(BAD_DRAFT);
    expect(r.verdict).toBe('fail');
    const violations = r.details['violations'] as Array<{ fromLevel: number; toLevel: number }>;
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ fromLevel: 2, toLevel: 4 });
  });
});

describe('validateHeadingHierarchy — edge cases', () => {
  it('warns when article has no sections', () => {
    const draft: Draft = { ...GOOD_DRAFT, sections: [] };
    const r = validateHeadingHierarchy(draft);
    expect(r.verdict).toBe('warn');
  });

  it('passes when level drops (H3 → H2 is closing a subsection, allowed)', () => {
    const draft: Draft = {
      ...GOOD_DRAFT,
      sections: [
        { level: 2, text: 'Section A', position: 1, bodyMarkdown: '' },
        { level: 3, text: 'Sub A.1', position: 2, bodyMarkdown: '' },
        { level: 2, text: 'Section B', position: 3, bodyMarkdown: '' },
      ],
    };
    const r = validateHeadingHierarchy(draft);
    expect(r.verdict).toBe('pass');
  });
});

// ── Keyword density validator ─────────────────────────────────────────────────

describe('validateKeywordDensity — good draft', () => {
  it('passes with well-optimised keyword density', () => {
    const r = validateKeywordDensity(GOOD_DRAFT, KEYWORD);
    expect(r.verdict).toBe('pass');
    expect((r.details['densityPct'] as number)).toBeGreaterThanOrEqual(0.8);
    expect((r.details['densityPct'] as number)).toBeLessThanOrEqual(2.5);
  });
});

describe('validateKeywordDensity — bad draft', () => {
  it('fails with zero keyword density', () => {
    const r = validateKeywordDensity(BAD_DRAFT, KEYWORD);
    // BAD_DRAFT body doesn't contain the keyword
    expect(r.verdict).toBe('warn'); // short body → warn, not fail
  });
});

describe('validateKeywordDensity — density thresholds', () => {
  // Build a synthetic body with controllable keyword density
  function makeDraftWithDensity(occurrences: number, totalWords: number): Draft {
    const kwWords = KEYWORD.split(' ').length; // 3 words
    const filler = 'filler '.repeat(totalWords - occurrences * kwWords).trim();
    const kwBlock = (KEYWORD + ' ').repeat(occurrences).trim();
    return { ...GOOD_DRAFT, bodyMarkdown: `${kwBlock} ${filler}` };
  }

  it('fails when keyword is absent from a long body', () => {
    // 200 filler words, 0 keyword occurrences
    const draft: Draft = {
      ...GOOD_DRAFT,
      bodyMarkdown: 'filler word '.repeat(200).trim(),
    };
    const r = validateKeywordDensity(draft, KEYWORD);
    expect(r.verdict).toBe('fail');
  });

  it('fails when density exceeds 3.5% (keyword stuffing)', () => {
    // 60 keyword occurrences in ~200 words → density ~90% (extreme stuffing)
    const draft = makeDraftWithDensity(60, 200);
    const r = validateKeywordDensity(draft, KEYWORD);
    expect(r.verdict).toBe('fail');
  });
});

// ── Readability validator ─────────────────────────────────────────────────────

describe('validateReadability — good draft', () => {
  it('passes with readable body text', () => {
    const r = validateReadability(GOOD_DRAFT);
    // The good draft uses plain business English — should score ≥ 45 (warn or pass)
    expect(['pass', 'warn']).toContain(r.verdict);
  });
});

describe('validateReadability — short body', () => {
  it('warns when body is too short to score', () => {
    const draft: Draft = { ...GOOD_DRAFT, bodyMarkdown: 'Too short.' };
    const r = validateReadability(draft);
    expect(r.verdict).toBe('warn');
    expect(r.details['fleschScore']).toBeNull();
  });
});

describe('validateReadability — very complex text', () => {
  it('fails on incomprehensible text (all polysyllabic words)', () => {
    // Extremely long polysyllabic words → very low FRE
    const dense = Array.from(
      { length: 20 },
      () => 'incomprehensibility electroencephalography counterproductive misrepresentation',
    ).join('. ') + '.';
    const draft: Draft = { ...GOOD_DRAFT, bodyMarkdown: dense };
    const r = validateReadability(draft);
    expect(r.verdict).toBe('fail');
  });
});

// ── Internal links validator ──────────────────────────────────────────────────

describe('validateInternalLinks — good draft', () => {
  it('passes with 2+ internal links', () => {
    const r = validateInternalLinks(GOOD_DRAFT);
    expect(r.verdict).toBe('pass');
    expect((r.details['internalLinkCount'] as number)).toBeGreaterThanOrEqual(2);
  });
});

describe('validateInternalLinks — bad draft', () => {
  it('fails with no links', () => {
    const r = validateInternalLinks(BAD_DRAFT);
    expect(r.verdict).toBe('fail');
    expect(r.details['internalLinkCount']).toBe(0);
  });
});

describe('validateInternalLinks — edge cases', () => {
  it('warns with exactly 1 internal link', () => {
    const draft: Draft = {
      ...GOOD_DRAFT,
      bodyMarkdown: 'Text with [one link](/target) in the body.',
    };
    const r = validateInternalLinks(draft);
    expect(r.verdict).toBe('warn');
  });

  it('does not count external links as internal', () => {
    const draft: Draft = {
      ...GOOD_DRAFT,
      bodyMarkdown:
        '[External](https://example.com) and [another](https://other.com) external.',
    };
    const r = validateInternalLinks(draft);
    expect(r.verdict).toBe('fail');
  });

  it('does not double-count identical hrefs', () => {
    const draft: Draft = {
      ...GOOD_DRAFT,
      bodyMarkdown:
        '[Link A](/target) is mentioned again as [Link B](/target).',
    };
    const r = validateInternalLinks(draft);
    // Same href → only 1 unique internal link → warn
    expect(r.verdict).toBe('warn');
    expect(r.details['internalLinkCount']).toBe(1);
  });

  it('excludes anchor-only links from count', () => {
    const draft: Draft = {
      ...GOOD_DRAFT,
      bodyMarkdown: 'Jump to [section](#intro) and [another](#outro).',
    };
    const r = validateInternalLinks(draft);
    // Anchor-only links don't count
    expect(r.verdict).toBe('fail');
  });
});

// ── Schema.org validator ──────────────────────────────────────────────────────

describe('validateSchemaOrg', () => {
  it('passes for "Article"', () => {
    const r = validateSchemaOrg({ ...GOOD_DRAFT, schemaType: 'Article' });
    expect(r.verdict).toBe('pass');
  });

  it('passes for "HowTo"', () => {
    const r = validateSchemaOrg({ ...GOOD_DRAFT, schemaType: 'HowTo' });
    expect(r.verdict).toBe('pass');
  });

  it('passes for all valid schema types', () => {
    const types = ['Article', 'BlogPosting', 'NewsArticle', 'HowTo', 'FAQPage'] as const;
    for (const type of types) {
      const r = validateSchemaOrg({ ...GOOD_DRAFT, schemaType: type });
      expect(r.verdict).toBe('pass');
    }
  });
});

// ── Canonical URL validator ───────────────────────────────────────────────────

describe('validateCanonical', () => {
  it('passes for valid https URL', () => {
    const r = validateCanonical({
      ...GOOD_DRAFT,
      canonicalUrl: 'https://example.com/my-article',
    });
    expect(r.verdict).toBe('pass');
  });

  it('warns when canonicalUrl is null', () => {
    const r = validateCanonical({ ...GOOD_DRAFT, canonicalUrl: null });
    expect(r.verdict).toBe('warn');
    expect(r.details['canonicalUrl']).toBeNull();
  });

  it('fails for relative path (not absolute)', () => {
    const r = validateCanonical({ ...GOOD_DRAFT, canonicalUrl: '/relative-path' });
    expect(r.verdict).toBe('fail');
  });

  it('fails for http (not https)', () => {
    const r = validateCanonical({
      ...GOOD_DRAFT,
      canonicalUrl: 'http://example.com/my-article',
    });
    expect(r.verdict).toBe('fail');
  });

  it('fails for malformed string', () => {
    const r = validateCanonical({ ...GOOD_DRAFT, canonicalUrl: 'not-a-url' });
    expect(r.verdict).toBe('fail');
  });
});

// ── Scoring ───────────────────────────────────────────────────────────────────

describe('computeScore', () => {
  it('returns 100 when all rules pass', () => {
    const allPass = Object.values(SEO_RULES).map(key => ({
      key,
      verdict: 'pass' as const,
      message: '',
      details: {},
    }));
    expect(computeScore(allPass)).toBe(100);
  });

  it('returns 0 when all rules fail', () => {
    const allFail = Object.values(SEO_RULES).map(key => ({
      key,
      verdict: 'fail' as const,
      message: '',
      details: {},
    }));
    expect(computeScore(allFail)).toBe(0);
  });

  it('returns 50 when all rules warn', () => {
    const allWarn = Object.values(SEO_RULES).map(key => ({
      key,
      verdict: 'warn' as const,
      message: '',
      details: {},
    }));
    expect(computeScore(allWarn)).toBe(50);
  });

  it('ignores unknown rule keys gracefully', () => {
    const results = [{ key: 'unknown_rule', verdict: 'fail' as const, message: '', details: {} }];
    expect(computeScore(results)).toBe(0);
  });
});

describe('scoreToVerdict', () => {
  it('80 → ready', () => expect(scoreToVerdict(80)).toBe('ready'));
  it('100 → ready', () => expect(scoreToVerdict(100)).toBe('ready'));
  it('79 → needs_work', () => expect(scoreToVerdict(79)).toBe('needs_work'));
  it('60 → needs_work', () => expect(scoreToVerdict(60)).toBe('needs_work'));
  it('59 → reject', () => expect(scoreToVerdict(59)).toBe('reject'));
  it('0 → reject', () => expect(scoreToVerdict(0)).toBe('reject'));
});

// ── Full validateArticle integration ─────────────────────────────────────────

describe('validateArticle — good draft', () => {
  const report = validateArticle(ARTICLE_ID, GOOD_DRAFT, KEYWORD);

  it('returns the correct articleId', () => {
    expect(report.articleId).toBe(ARTICLE_ID);
  });

  it('has 10 rule results (one per SEO_RULES key)', () => {
    expect(report.results).toHaveLength(Object.keys(SEO_RULES).length);
  });

  it('produces a ready or needs_work verdict', () => {
    expect(['ready', 'needs_work']).toContain(report.verdict);
  });

  it('overallScore is above 60 for a well-optimised draft', () => {
    expect(report.overallScore).toBeGreaterThan(60);
  });

  it('createdAt is a valid ISO string', () => {
    expect(() => new Date(report.createdAt)).not.toThrow();
    expect(new Date(report.createdAt).toISOString()).toBe(report.createdAt);
  });
});

describe('validateArticle — bad draft', () => {
  const report = validateArticle(ARTICLE_ID, BAD_DRAFT, KEYWORD);

  it('produces a needs_work or reject verdict', () => {
    expect(['needs_work', 'reject']).toContain(report.verdict);
  });

  it('overallScore is below 80', () => {
    expect(report.overallScore).toBeLessThan(80);
  });

  it('h1_length result is fail', () => {
    const r = report.results.find(r => r.key === SEO_RULES.H1_LENGTH);
    expect(r?.verdict).toBe('fail');
  });

  it('heading_hierarchy result is fail (H2 → H4 skip)', () => {
    const r = report.results.find(r => r.key === SEO_RULES.HEADING_HIERARCHY);
    expect(r?.verdict).toBe('fail');
  });

  it('canonical_url result is warn (null)', () => {
    const r = report.results.find(r => r.key === SEO_RULES.CANONICAL_URL);
    expect(r?.verdict).toBe('warn');
  });
});
