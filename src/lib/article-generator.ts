import type { DemoArticle, DemoSection, DemoSeoVerdict } from '@/lib/demo-data';

// ── Helpers ───────────────────────────────────────────────────────────────────

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Strip generic wedding-query prefixes to get the core destination/topic */
function extractTopic(phrase: string): string {
  return (
    phrase
      .replace(/^(destination weddings?|best|top|all inclusive|luxury|romantic)\s+/i, '')
      .replace(/\s+(wedding venues?|resorts?|packages?|guide)$/i, '')
      .trim() || phrase
  );
}

function buildH1(phrase: string): string {
  const topic = extractTopic(phrase);

  if (/destination weddings?/i.test(phrase)) {
    return `Destination Weddings ${cap(topic)}: Complete 2026 Planning Guide`;
  }
  if (/wedding venues?/i.test(phrase)) {
    return `${cap(phrase)}: Top Picks and Pricing for 2026`;
  }
  if (/elopement/i.test(phrase)) {
    return `${cap(phrase)}: Your Complete 2026 Elopement Guide`;
  }
  if (/resort/i.test(phrase)) {
    return `${cap(phrase)}: The Best All-Inclusive Options for 2026`;
  }
  return `${cap(phrase)}: The Complete 2026 Wedding Planning Guide`;
}

function buildSlug(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

function buildMeta(phrase: string): string {
  const topic = extractTopic(phrase);
  const meta = `Plan the perfect ${phrase} with Wedded Wonderland. Expert venue guides, cost breakdowns, legal tips, and vendor recommendations for ${cap(topic)} in 2026.`;
  return meta.length <= 160 ? meta : meta.slice(0, 157) + '...';
}

// ── Body text generators ──────────────────────────────────────────────────────
// Returns string arrays — no em dashes, WW editorial voice.

function bodyWhy(topic: string): readonly string[] {
  return [
    `${cap(topic)} has become one of Wedded Wonderland's most enquired destinations, and the reasons are easy to understand. Couples drawn to this setting find a combination of natural beauty, genuine local character, and a vendor ecosystem that has matured to serve international guests with real consistency.`,
    `The practical advantages are equally compelling. Accessibility has improved significantly, with direct connections from Sydney, Melbourne, London, and Singapore making guest travel straightforward. Local photographers, florists, and catering teams have extensive experience with international events, which means quality without the premium of importing specialists from abroad.`,
  ];
}

function bodyPlanning(phrase: string): readonly string[] {
  return [
    `Planning a ${phrase} typically begins 12 to 18 months before the target date. The most in-demand venues book out well in advance, particularly for weekend dates in peak season. Engaging a local coordinator early is the single most effective way to secure the venue and date combination you want.`,
    `Wedded Wonderland's planning tools let you track venue enquiries, coordinate vendor bookings, and manage guest communications from one dashboard. Couples using the platform consistently save 15 to 20 percent on vendor costs through the preferred supplier network.`,
  ];
}

function bodyVenues(phrase: string): readonly string[] {
  return [
    `The venue shortlist for a ${phrase} covers a wide range of settings and price points. Wedded Wonderland verifies listings across all tiers, from boutique properties that host 20 guests to full estate buyouts accommodating 200-plus. Each listing includes verified capacity, base pricing, seasonal availability, and genuine couple reviews.`,
  ];
}

function bodyLuxury(): readonly string[] {
  return [
    `Luxury estate properties are distinguished by exclusivity and full-service coordination. Most include dedicated bridal suites, on-site accommodation for key guests, and an events team that manages logistics from arrival to departure. Starting prices for a 60-guest event typically begin at AUD 65,000, inclusive of catering and venue hire.`,
  ];
}

function bodyBoutique(): readonly string[] {
  return [
    `Boutique and intimate settings suit couples who prioritise atmosphere and personal service over scale. Guest lists between 20 and 50 unlock the most distinctive venues, where the team can focus on every detail. Pricing is often more accessible, with many properties starting from AUD 22,000 for the ceremony and reception combined.`,
  ];
}

function bodyBudget(phrase: string): readonly string[] {
  return [
    `A ${phrase} typically ranges from AUD 28,000 to AUD 90,000 for 60 guests, shaped primarily by venue tier and catering style. The headline figure shifts substantially based on guest count, with each additional 20 guests adding roughly AUD 8,000 to 12,000 in catering costs alone.`,
    `Couples who source their vendor team through Wedded Wonderland's verified directory consistently report better value than sourcing independently. Preferred-supplier arrangements reduce costs, and the platform's coordination tools save significant planning time across the lead-up to the event.`,
  ];
}

function bodyTips(): readonly string[] {
  return [
    `The Wedded Wonderland planning team has coordinated over 3,000 events across 40 countries. The consistent advice from experienced coordinators: secure the venue contract and work through legal requirements before committing to any other vendor. These two elements carry the longest lead time and are the hardest to adjust once locked in.`,
    `Document management is the area most couples underestimate for international ceremonies. Certificate requirements, translation timelines, and apostille processing typically take 6 to 10 weeks. Starting this process early removes the most common source of pre-event stress and gives genuine flexibility in the final weeks before the date.`,
  ];
}

// ── Section builder ───────────────────────────────────────────────────────────

function buildSections(phrase: string, targetLength: number): readonly DemoSection[] {
  const topic = extractTopic(phrase);

  const specs: Array<{ level: 2 | 3; text: string; pct: number; body: readonly string[] }> = [
    {
      level: 2,
      text: `Why ${cap(topic)} Is Perfect for Your Wedding`,
      pct: 0.15,
      body: bodyWhy(topic),
    },
    {
      level: 2,
      text: `Planning Your ${cap(topic)} Wedding`,
      pct: 0.18,
      body: bodyPlanning(phrase),
    },
    {
      level: 2,
      text: `Top Venues for a ${cap(topic)} Wedding`,
      pct: 0.16,
      body: bodyVenues(phrase),
    },
    {
      level: 3,
      text: 'Luxury Estate Options',
      pct: 0.10,
      body: bodyLuxury(),
    },
    {
      level: 3,
      text: 'Boutique and Intimate Settings',
      pct: 0.08,
      body: bodyBoutique(),
    },
    {
      level: 2,
      text: `What to Budget for a ${cap(topic)} Wedding in 2026`,
      pct: 0.18,
      body: bodyBudget(phrase),
    },
    {
      level: 2,
      text: 'Practical Tips From Wedded Wonderland',
      pct: 0.15,
      body: bodyTips(),
    },
  ];

  return specs.map(s => ({
    level: s.level,
    text: s.text,
    wordCount: Math.round(targetLength * s.pct),
    body: s.body,
  }));
}

// ── SEO verdicts ──────────────────────────────────────────────────────────────

function buildVerdicts(wordCount: number, targetLength: number): readonly DemoSeoVerdict[] {
  return [
    { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: 'Within 30-80 character range' },
    { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: 'Within 150-160 character range' },
    { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
    { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
    {
      rule: 'word_count',
      label: 'Word Count',
      verdict: wordCount >= targetLength ? 'pass' : 'warn',
      detail: `${wordCount.toLocaleString()} words - ${wordCount >= targetLength ? 'meets target' : `target is ${targetLength.toLocaleString()} words`}`,
    },
    {
      rule: 'internal_links',
      label: 'Internal Links',
      verdict: 'warn',
      detail: 'No internal links added yet - recommend 2 to 4 for best results',
    },
    {
      rule: 'canonical_url',
      label: 'Canonical URL',
      verdict: 'warn',
      detail: 'Canonical not set - will default to publish URL',
    },
    { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
  ];
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateArticleFromKeyword(
  phrase: string,
  targetLength: number,
  id: string,
  keywordId: string,
): DemoArticle {
  const h1 = buildH1(phrase);
  const sections = buildSections(phrase, targetLength);
  const wordCount = sections.reduce((sum, s) => sum + s.wordCount, 0);

  return {
    id,
    keywordId,
    h1,
    slug: buildSlug(phrase),
    metaDescription: buildMeta(phrase),
    wordCount,
    sections,
    internalLinks: [],
    seoScore: 74,
    seoVerdicts: buildVerdicts(wordCount, targetLength),
    publishedAt: null,
    cmsConnectionId: null,
  };
}
