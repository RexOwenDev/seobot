import type { DemoArticle, DemoSection, DemoSeoVerdict } from '@/lib/demo-data';

// ── Helpers ───────────────────────────────────────────────────────────────────

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Strip generic wedding-query prefixes to get the core destination/topic */
function extractTopic(phrase: string): string {
  return (
    phrase
      .replace(/^(destination weddings?|best|top|all inclusive|luxury|romantic|honeymoon)\s+/i, '')
      .replace(/\s+(wedding venues?|resorts?|packages?|guide|destinations?)$/i, '')
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
  if (/honeymoon/i.test(phrase)) {
    return `${cap(topic)}: Top Honeymoon Destinations for 2026`;
  }
  return `${cap(phrase)}: The Complete 2026 Wedding Guide`;
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

/** Deterministic SEO score in range 68-88, based on phrase content */
function computeSeoScore(phrase: string): number {
  let hash = 0;
  for (let i = 0; i < phrase.length; i++) {
    hash = ((hash << 5) - hash) + phrase.charCodeAt(i);
    hash |= 0;
  }
  return 68 + (Math.abs(hash) % 21);
}

// ── Destination-specific content ──────────────────────────────────────────────

function getDestinationKey(phrase: string): string {
  const p = phrase.toLowerCase();
  if (/tuscany|florence|siena|chianti/i.test(p)) return 'tuscany';
  if (/amalfi|positano|ravello|sorrento/i.test(p)) return 'amalfi';
  if (/maldives|overwater|north male|south male/i.test(p)) return 'maldives';
  if (/thailand|koh samui|phuket|chiang mai/i.test(p)) return 'thailand';
  if (/bali|ubud|seminyak|uluwatu|canggu/i.test(p)) return 'bali';
  if (/santorini|mykonos|greece|greek island/i.test(p)) return 'greece';
  if (/paris|france|provence|bordeaux|chateau/i.test(p)) return 'france';
  if (/japan|kyoto|tokyo/i.test(p)) return 'japan';
  if (/new zealand|queenstown|auckland/i.test(p)) return 'newzealand';
  return 'generic';
}

// ── Body text generators ──────────────────────────────────────────────────────
// No em dashes. WW editorial voice throughout.

function bodyWhy(topic: string, dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `Tuscany draws couples with a combination that is genuinely difficult to replicate elsewhere. Rolling vineyard landscapes, medieval hill towns, and stone villas that have been hosting private events for generations create a backdrop that photographs with extraordinary depth. The light in Tuscany, particularly in the golden months of May, June, September, and October, is something photographers seek out specifically.`,
      `The practical case for Tuscany is equally strong. Connectivity from Sydney, Melbourne, London, and Singapore to Florence and Pisa airports is reliable, with layover options in Singapore and Dubai. The local wedding industry is mature and internationally oriented, with coordinators who routinely manage multilingual guest lists of 60 to 150 people and understand Australian legal and paperwork requirements.`,
    ],
    amalfi: [
      `The Amalfi Coast offers something that most couples only see in images until they arrive: a combination of vertical landscape, azure water, and centuries-old architecture that cannot be staged or replicated. Venues here are built into cliffsides and hilltops, which means the setting does most of the visual work before a single arrangement is placed.`,
      `Access has improved substantially. Rome and Naples are the primary entry points, and the drive from Naples to the Amalfi Coast takes under two hours. Local coordinators work with a well-established network of florists, photographers, and catering teams who specialise specifically in clifftop and terraced events, which require particular logistics expertise.`,
    ],
    maldives: [
      `The Maldives presents a unique proposition for couples who want complete privacy combined with extraordinary natural setting. Overwater villas and private island buyouts allow for ceremonies where the guest experience matches the visual drama of the setting. Sunrise and sunset ceremonies over still lagoon water are consistently cited as some of the most memorable moments couples experience.`,
      `Every major resort in the Maldives operates a dedicated wedding coordinator service, which simplifies the planning process considerably. The tourism infrastructure is specifically designed for international couples, with ceremony packages that handle legal requirements for recognised destination weddings in Australian law.`,
    ],
    thailand: [
      `Thailand offers a rare combination of world-class venue quality, genuinely distinctive cultural setting, and pricing that remains competitive for Australian couples. Koh Samui, Phuket, and Chiang Mai each provide a distinct character: coastal luxury, rainforest canopy, or temple-surrounded garden settings.`,
      `The vendor ecosystem in Thailand's primary wedding destinations has expanded significantly over the past decade. Photographers, florists, and catering teams with genuine international experience are established across all major island and city locations. Direct flights from Sydney and Melbourne to Bangkok, Phuket, and Samui Airport keep guest travel straightforward.`,
    ],
    greece: [
      `Greece remains one of Wedded Wonderland's most-requested destinations for couples from Australia and the UK. Santorini's caldera settings and Mykonos's windmill backdrops have defined the aesthetic of destination weddings for a generation, while destinations like Crete, Rhodes, and the Pelion peninsula offer the same quality with considerably more availability and privacy.`,
      `The Greek wedding market is genuinely competitive on quality. Photographers who specialise in the light conditions of the Aegean, catering teams with international menus, and coordinators who handle EU paperwork requirements for Australian nationals are all well-established across the major island destinations.`,
    ],
    france: [
      `France offers the broadest range of venue types of any European destination, from Loire Valley chateaux to Provence lavender estates, coastal Cap Ferrat villas, and restored Bordeaux wineries. The range means couples can match the venue type precisely to the guest experience they have in mind rather than adapting to what is available.`,
      `Paris itself remains a draw for elopements and intimate ceremonies for Wedded Wonderland couples who want the city as the event. For larger events, the regions within two to three hours of Paris offer a density of high-quality venues that is hard to match anywhere in Europe.`,
    ],
    japan: [
      `Japan's wedding landscape has evolved significantly to serve international couples who want a ceremony grounded in local aesthetic. Kyoto offers traditional Shinto ceremony settings surrounded by temple gardens, while Tokyo provides rooftop and urban venues with city skyline backdrops that create a different but equally distinctive setting.`,
      `The coordination infrastructure for international couples in Japan has matured considerably. English-speaking coordinators, translators for legal requirements, and catering teams who work across both traditional Japanese and internationally oriented menus are established in Kyoto, Tokyo, and Niseko.`,
    ],
    newzealand: [
      `New Zealand's appeal for Australian couples is practical as well as scenic. No visa requirement, direct flights from every Australian capital, and a shared language remove the logistical complexity of international travel. The landscapes, ranging from Fiordland to Queenstown lake settings to Bay of Islands coastal venues, offer a variety that competes with destinations three times the travel distance.`,
      `The local wedding industry has a quality-to-price ratio that is competitive with Southeast Asia for outdoor settings. Queenstown in particular has developed a specialised event infrastructure around destination weddings, with photographers, helicopter transfers, and catering teams all oriented around the international couple market.`,
    ],
    bali: [
      `Bali has earned its place at the top of Wedded Wonderland's destination enquiry list for a straightforward reason: it delivers on every element that matters. The landscape ranges from ocean-facing cliffs at Uluwatu to jungle-canopy rice terrace settings in Ubud and luxury beach clubs in Seminyak. No other destination at a comparable price point offers that breadth.`,
      `The vendor ecosystem in Bali is genuinely excellent by international standards. Photographers who have trained under international mentors, catering teams with fine-dining credentials, and coordinators who have managed hundreds of international events operate across every major region of the island. Direct flights from Sydney, Melbourne, and Brisbane make guest travel one of the easiest of any international destination.`,
    ],
  };

  return specific[dest] ?? [
    `${cap(topic)} has become one of Wedded Wonderland's most enquired destinations, and the reasons are easy to understand. Couples drawn to this setting find a combination of natural beauty, genuine local character, and a vendor ecosystem that has matured to serve international guests with real consistency.`,
    `The practical advantages are equally compelling. Accessibility has improved significantly, with direct connections from Sydney, Melbourne, London, and Singapore making guest travel straightforward. Local photographers, florists, and catering teams have extensive experience with international events, which means quality without the premium of importing specialists from abroad.`,
  ];
}

function bodyPlanning(phrase: string, dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `Planning a Tuscany wedding typically begins 14 to 18 months in advance. The most sought-after villas and converted farmhouses book out earliest, particularly for late May through June and September through early October. Italian ceremony requirements for Australian nationals typically require a nulla osta document from the Australian Embassy in Rome, which takes 6 to 8 weeks to process.`,
      `Engaging a Tuscany-based coordinator from Wedded Wonderland's verified network early is the single most effective step. They manage the municipal paperwork, the chiesa bookings for symbolic ceremonies, and the logistics between accommodation across multiple properties that is a hallmark of large Tuscan estate events.`,
    ],
    amalfi: [
      `Amalfi Coast weddings require early planning specifically because of venue scarcity. The coastline is geographically constrained, which limits the number of high-quality venues. The period from late April to early June and September through mid-October represents the practical window for a ceremony, and dates fill 12 to 16 months in advance.`,
      `Italian civil ceremony requirements apply to the Amalfi region and require advance coordination with the local comune. Symbolic ceremonies, which have no legal requirement in Italy, are the most common choice for Australian couples and allow more flexibility in venue and timing.`,
    ],
    maldives: [
      `Maldives weddings are typically planned 10 to 14 months in advance for the premium overwater villa properties. The Maldives operates a recognised ceremony framework for international couples, and most resort coordinators handle all the paperwork and logistics as part of their wedding packages.`,
      `The dry season, from November through April, is the preferred window. Wedded Wonderland recommends building the guest experience around the resort, with excursions and activities for the days surrounding the ceremony rather than a traditional rehearsal-dinner schedule.`,
    ],
  };

  return specific[dest] ?? [
    `Planning a ${phrase} typically begins 12 to 18 months before the target date. The most in-demand venues book out well in advance, particularly for weekend dates in peak season. Engaging a local coordinator early is the single most effective way to secure the venue and date combination you want.`,
    `Wedded Wonderland's planning tools let you track venue enquiries, coordinate vendor bookings, and manage guest communications from one dashboard. Couples using the platform consistently save 15 to 20 percent on vendor costs through the preferred supplier network.`,
  ];
}

function bodyVenues(phrase: string, dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `Tuscany's venue landscape ranges from medieval castle estates in the Chianti hills to working wineries in Montalcino and renovated farmhouses in the Val d'Orcia. Wedded Wonderland's verified listings include Castello di Vicarello, Villa di Piazzano, and Tenuta di Spannocchia for estate buyouts, alongside a range of boutique agriturismo properties for more intimate guest lists.`,
    ],
    amalfi: [
      `The Amalfi Coast venue shortlist centres on clifftop villas and hotel terrace settings. Il San Pietro di Positano, the Villa Rufolo gardens in Ravello, and the terrace at Palazzo Avino are among the most requested by Wedded Wonderland couples. Each combines a dramatic vertical setting with catering quality that matches international standards.`,
    ],
    maldives: [
      `Overwater ceremony platforms, private sandbank settings, and resort beach venues characterise the Maldives shortlist. The Conrad Maldives Rangali Island, Soneva Jani, and Gili Lankanfushi are the most frequently enquired properties through Wedded Wonderland, each offering distinct configuration options for ceremony and reception across their private island footprints.`,
    ],
    thailand: [
      `Koh Samui's cliff-edge and beachfront settings headline the Thailand venue shortlist. Samui's SAii Koh Samui, Kamalaya, and the Intercontinental Samui are established Wedded Wonderland partners. In Phuket, the Trisara and Amanpuri deliver the premium end of the market, with private villa compounds that accommodate full estate buyouts.`,
    ],
    greece: [
      `Santorini's venue landscape is built around the caldera view. Andronis Luxury Suites, Canaves Oia, and the Rocabella Santorini are the most frequently requested through Wedded Wonderland for their combination of setting quality and capacity. On Mykonos, Santa Marina and the Belvedere offer a more social setting that suits larger guest lists.`,
    ],
    bali: [
      `The venue shortlist for a Bali wedding covers a wide range of settings and price points. Alila Villas Uluwatu and AYANA Resort offer clifftop ocean-facing ceremony settings at the premium end. In Ubud, Kamandalu Ubud and the Viceroy Bali provide rice-terrace and jungle-canopy settings. Seminyak's beach clubs suit couples who want a sunset ceremony with a reception flowing into the night.`,
    ],
  };

  return specific[dest] ?? [
    `The venue shortlist for a ${phrase} covers a wide range of settings and price points. Wedded Wonderland verifies listings across all tiers, from boutique properties that host 20 guests to full estate buyouts accommodating 200-plus. Each listing includes verified capacity, base pricing, seasonal availability, and genuine couple reviews.`,
  ];
}

function bodyLuxury(dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `Luxury Tuscan estate buyouts typically begin at AUD 85,000 for a 60-guest event, inclusive of venue hire and catering. Properties like Castello di Vicarello and Villa Oliva offer complete estate exclusivity, with on-site accommodation for the wedding party and dedicated event staff across the full three-day stay. The pricing reflects the rarity of properties that can deliver this level of exclusivity while maintaining cuisine of genuine quality.`,
    ],
    maldives: [
      `Private island buyouts in the Maldives begin at AUD 120,000 for intimate groups of 20 to 30 guests, with per-person costs rising for larger groups due to villa accommodation constraints. The packages include all meals, non-motorised water activities, and the ceremony coordination service. Most couples extend to a full week to maximise the experience for guests who have travelled internationally.`,
    ],
  };

  return specific[dest] ?? [
    `Luxury estate properties are distinguished by exclusivity and full-service coordination. Most include dedicated bridal suites, on-site accommodation for key guests, and an events team that manages logistics from arrival to departure. Starting prices for a 60-guest event typically begin at AUD 65,000, inclusive of catering and venue hire.`,
  ];
}

function bodyBoutique(dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `Boutique Tuscan agriturismo settings suit couples prioritising atmosphere and direct access to the local landscape. Guest lists between 20 and 40 unlock the most characterful properties, where stone walls, terracotta floors, and working olive groves form the backdrop without requiring extensive decoration. Many properties in the Chianti and Valdichiana regions begin from AUD 20,000 for the venue and catering combined.`,
    ],
    amalfi: [
      `Intimate Amalfi settings, including converted private terraces and small hotel venues in Ravello and Atrani, suit couples who want the coastline setting without the scale of a large-format event. Guest lists of 20 to 40 access the most distinctive spaces, with costs typically starting from AUD 25,000 for venue and catering.`,
    ],
  };

  return specific[dest] ?? [
    `Boutique and intimate settings suit couples who prioritise atmosphere and personal service over scale. Guest lists between 20 and 50 unlock the most distinctive venues, where the team can focus on every detail. Pricing is often more accessible, with many properties starting from AUD 22,000 for the ceremony and reception combined.`,
  ];
}

function bodyBudget(phrase: string, dest: string): readonly string[] {
  const specific: Record<string, readonly string[]> = {
    tuscany: [
      `A Tuscany wedding for 60 guests typically ranges from AUD 45,000 to AUD 130,000, shaped primarily by venue tier and catering style. The cost variation is significant: a converted farmhouse with local catering falls at the lower end, while a castle estate with a Florentine catering team and full floristry moves considerably higher.`,
      `Couples who source their vendor team through Wedded Wonderland's verified Tuscany directory consistently report better value. Preferred-supplier arrangements include direct access to coordinators who understand the Italian municipal paperwork, which saves both time and the cost of engaging a second administrative layer.`,
    ],
    maldives: [
      `Maldives weddings for 20 to 40 guests typically range from AUD 80,000 to AUD 200,000, driven primarily by the accommodation cost of flying and housing a guest group across overwater villas. The ceremony package itself is often a smaller proportion of the total; the guest experience across the stay represents the major cost.`,
      `For couples considering the Maldives, Wedded Wonderland's planning team recommends establishing the guest list and accommodation needs first, then working backwards to venue and ceremony. The budget shape for a Maldives event is structurally different from a European or Southeast Asian destination.`,
    ],
    amalfi: [
      `An Amalfi Coast wedding for 60 guests typically ranges from AUD 60,000 to AUD 150,000. The transport logistics of the coastline, where roads are narrow and boat transfers are often required, add a cost component that does not exist for inland Italian destinations. This should be factored into guest experience planning from the outset.`,
      `Couples who engage an Amalfi-specialist coordinator through Wedded Wonderland consistently find better availability and more accurate cost estimates than those who approach venues directly. The local knowledge required to navigate the Comune di Positano, Ravello, and Amalfi municipal requirements is substantial.`,
    ],
  };

  return specific[dest] ?? [
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
  const dest = getDestinationKey(phrase);
  const isHoneymoon = /honeymoon/i.test(phrase);
  const eventWord = isHoneymoon ? 'Honeymoon' : 'Wedding';

  const specs: Array<{ level: 2 | 3; text: string; pct: number; body: readonly string[] }> = [
    {
      level: 2,
      text: `Why ${cap(topic)} Is Perfect for Your ${eventWord}`,
      pct: 0.15,
      body: bodyWhy(topic, dest),
    },
    {
      level: 2,
      text: `Planning Your ${cap(topic)} ${eventWord}`,
      pct: 0.18,
      body: bodyPlanning(phrase, dest),
    },
    {
      level: 2,
      text: `Top Venues for a ${cap(topic)} ${eventWord}`,
      pct: 0.16,
      body: bodyVenues(phrase, dest),
    },
    {
      level: 3,
      text: 'Luxury Estate Options',
      pct: 0.10,
      body: bodyLuxury(dest),
    },
    {
      level: 3,
      text: 'Boutique and Intimate Settings',
      pct: 0.08,
      body: bodyBoutique(dest),
    },
    {
      level: 2,
      text: `What to Budget for a ${cap(topic)} ${eventWord} in 2026`,
      pct: 0.18,
      body: bodyBudget(phrase, dest),
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
    seoScore: computeSeoScore(phrase),
    seoVerdicts: buildVerdicts(wordCount, targetLength),
    publishedAt: null,
    cmsConnectionId: null,
  };
}
