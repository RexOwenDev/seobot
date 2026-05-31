import type { KeywordInput } from '@/types/pipeline';

// ── Keyword fixtures ──────────────────────────────────────────────────────────

export interface DemoKeyword {
  readonly id: string;
  readonly phrase: string;
  readonly searchVolume: number;
  readonly difficulty: number;
  readonly intent: KeywordInput['intent'];
  readonly brand: 'Wedded Wonderland';
  readonly status: 'queued' | 'researched' | 'outlined' | 'drafted' | 'published';
  readonly articleId: string | null;
}

export const DEMO_KEYWORDS: readonly DemoKeyword[] = [
  {
    id: 'kw-001',
    phrase: 'destination weddings Bali',
    searchVolume: 8100,
    difficulty: 38,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'published',
    articleId: 'art-001',
  },
  {
    id: 'kw-002',
    phrase: 'destination weddings Santorini Greece',
    searchVolume: 5400,
    difficulty: 44,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'drafted',
    articleId: 'art-002',
  },
  {
    id: 'kw-003',
    phrase: 'luxury wedding venues Sydney',
    searchVolume: 3600,
    difficulty: 52,
    intent: 'commercial',
    brand: 'Wedded Wonderland',
    status: 'outlined',
    articleId: 'art-003',
  },
  {
    id: 'kw-004',
    phrase: 'destination weddings Maldives overwater bungalow',
    searchVolume: 2900,
    difficulty: 31,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'queued',
    articleId: null,
  },
  {
    id: 'kw-007',
    phrase: 'honeymoon packages Maldives overwater villa',
    searchVolume: 3200,
    difficulty: 29,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'queued',
    articleId: null,
  },
  {
    id: 'kw-008',
    phrase: 'proposal ideas Santorini rooftop',
    searchVolume: 1600,
    difficulty: 27,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'queued',
    articleId: null,
  },
  {
    id: 'kw-009',
    phrase: 'anniversary getaway Bali romantic villas',
    searchVolume: 1400,
    difficulty: 25,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'queued',
    articleId: null,
  },
  {
    id: 'kw-005',
    phrase: 'all inclusive wedding resorts Bali',
    searchVolume: 2200,
    difficulty: 35,
    intent: 'transactional',
    brand: 'Wedded Wonderland',
    status: 'researched',
    articleId: null,
  },
  {
    id: 'kw-006',
    phrase: 'Amalfi Coast wedding venues',
    searchVolume: 1900,
    difficulty: 41,
    intent: 'informational',
    brand: 'Wedded Wonderland',
    status: 'queued',
    articleId: null,
  },
] as const;

// ── Article fixtures ──────────────────────────────────────────────────────────

export interface DemoSection {
  readonly level: 2 | 3;
  readonly text: string;
  readonly wordCount: number;
  readonly body?: readonly string[];
}

export interface DemoArticle {
  readonly id: string;
  readonly keywordId: string;
  readonly h1: string;
  readonly slug: string;
  readonly metaDescription: string;
  readonly wordCount: number;
  readonly sections: readonly DemoSection[];
  readonly internalLinks: readonly DemoInternalLink[];
  readonly seoScore: number;
  readonly seoVerdicts: readonly DemoSeoVerdict[];
  readonly publishedAt: string | null;
  readonly cmsConnectionId: string | null;
}

export interface DemoSeoVerdict {
  readonly rule: string;
  readonly label: string;
  readonly verdict: 'pass' | 'warn' | 'fail';
  readonly detail: string;
}

export interface DemoInternalLink {
  readonly id: string;
  readonly anchorText: string;
  readonly targetSlug: string;
  readonly targetH1: string;
  readonly relevanceScore: number;
  readonly accepted: boolean | null;
}

export const DEMO_ARTICLES: readonly DemoArticle[] = [
  {
    id: 'art-001',
    keywordId: 'kw-001',
    h1: 'Destination Weddings in Bali: The Complete 2026 Planning Guide',
    slug: 'destination-weddings-bali-complete-guide',
    metaDescription:
      'Plan your dream destination wedding in Bali. Discover the best venues, legal requirements, ideal seasons, and budgeting tips for 2026 Bali weddings.',
    wordCount: 2340,
    sections: [
      {
        level: 2,
        text: "Why Bali is the World's Top Wedding Destination",
        wordCount: 320,
        body: [
          "Few destinations combine natural drama with cultural warmth the way Bali does. Towering volcanic peaks, emerald rice terraces, and a coastline that shifts from black sand to white coral give couples a backdrop that photographers still struggle to do justice. The island's Hindu spiritual traditions lend ceremonies a sense of ritual and meaning that many couples struggle to find in more commercial venues.",
          "Bali's infrastructure has matured to match its reputation. Direct flights connect the island to Sydney, Singapore, Tokyo, Dubai, and Los Angeles, making it genuinely practical for a diverse guest list. The local wedding industry, shaped by two decades of international demand, now operates at the same level of precision as the world's major event destinations, but at a fraction of the cost.",
          "For couples, the numbers are compelling. A fully catered ceremony for 60 guests at a premium Bali villa typically runs between AUD 25,000 and AUD 55,000, inclusive of florals, catering, and a photography team. A comparable event in coastal Europe would start at three times that figure.",
        ],
      },
      {
        level: 2,
        text: 'Best Regions in Bali for Weddings',
        wordCount: 410,
        body: [
          "Bali's geography divides naturally into distinct personalities. The southern resort corridor from Seminyak to Jimbaran suits couples who want polished luxury close to the airport. The central highlands around Ubud attract those seeking organic beauty, jungle canopy, and a more intimate atmosphere. The Bukit Peninsula, particularly around Uluwatu and Ungasan, has become the address of choice for couples who want clifftop drama above the Indian Ocean.",
        ],
      },
      {
        level: 3,
        text: 'Seminyak and Oberoi: Beachfront Luxury',
        wordCount: 140,
        body: [
          "Seminyak's beach clubs and boutique hotels set the tone for a refined, social celebration. The Oberoi Bali remains one of the island's most requested ceremony locations, with its open-air temple setting and direct beach access. Rates are premium, but the team's experience with international weddings is unmatched in the region.",
        ],
      },
      {
        level: 3,
        text: 'Ubud: Jungle and Rice Terrace Settings',
        wordCount: 130,
        body: [
          'Ubud rewards couples who prioritise atmosphere over convenience. The 45-minute drive from the airport pays off with ceremony settings that feel genuinely untouched. Katamama and Komaneka at Bisma are the standout properties for couples who want this aesthetic without sacrificing service quality.',
        ],
      },
      {
        level: 3,
        text: 'Uluwatu: Clifftop Ceremony Venues',
        wordCount: 120,
        body: [
          'The Bukit Peninsula offers the island\'s most photographed backdrops. Venues like Alila Villas Uluwatu and The Edge position ceremony spaces on limestone cliffs above the Indian Ocean, creating sunset ceremony photographs that resemble landscape art. This region suits smaller, intimate guest lists of 20 to 50 guests.',
        ],
      },
      {
        level: 2,
        text: 'Bali Wedding Legalities for Foreign Couples',
        wordCount: 290,
        body: [
          "Legal marriage in Bali requires couples to share the same religion, as Indonesian law mandates religious officiants for civil registration. In practice, most international couples arrange a legally binding ceremony at home first, then hold a symbolic blessing ceremony in Bali, which carries no legal restriction.",
          'Your Bali wedding planner should handle all local permits, including venue licensing, noise approvals, and where relevant, beach access rights. Legitimate venues will have these in order before you sign a contract. Asking to see operating certificates and event licenses is entirely standard practice.',
        ],
      },
      {
        level: 2,
        text: 'Best Season to Get Married in Bali',
        wordCount: 220,
        body: [
          "Bali's dry season runs from May through October, with July and August delivering the most reliably clear skies. These months command premium pricing and require venue bookings 12 to 18 months in advance. April and early November sit in a shoulder season that experienced planners increasingly recommend: weather risk is marginally higher, but pricing drops 20 to 30 percent and venues are far less crowded.",
          "The wet season, November through March, is not as prohibitive as many couples assume. Tropical rain typically arrives in short afternoon bursts. Venues with covered outdoor structures can run a full wet-season ceremony comfortably, and some of Bali's most dramatic atmospheric photographs have been taken in this period.",
        ],
      },
      {
        level: 2,
        text: 'Average Cost of a Destination Wedding in Bali',
        wordCount: 310,
        body: [
          'The headline figure most couples receive, AUD 30,000 to 80,000 all-in, obscures a wide range of variables. Guest count is the primary driver. A private villa ceremony for 30 guests can be delivered beautifully for AUD 25,000, while a resort buyout for 120 guests with international catering talent will approach six figures.',
          'The Wedded Wonderland vendor network includes vetted photographers, celebrants, florists, and coordinators across all major Bali regions. Couples using our network typically save 15 to 20 percent compared to sourcing independently, and benefit from coordination experience across hundreds of similar events.',
        ],
      },
      {
        level: 2,
        text: 'Top Bali Wedding Venues on Wedded Wonderland',
        wordCount: 400,
        body: [
          'Wedded Wonderland lists over 60 certified Bali venues, each with verified pricing, capacity information, and seasonal availability. Three venues consistently lead our enquiry volume: Alila Villas Uluwatu, AYANA Resort Bali, and Kamandalu Ubud.',
          'Alila Villas Uluwatu suits couples prioritising drama and exclusivity. Its clifftop ceremony pavilion, perched 100 metres above the ocean, produces ceremony photographs unlike any other venue on the island. The property accommodates up to 120 guests across private villa configurations.',
          'AYANA Resort commands Jimbaran Bay with a 12-hectare property that includes three ceremony locations and a dedicated wedding team that has delivered over 2,000 international ceremonies. Guest lists of 80 to 250 are well within the venue\'s capabilities.',
          'Kamandalu Ubud positions itself at the intersection of luxury and cultural immersion. Its valley setting, with views across the Petanu River gorge, suits couples who want Ubud\'s aesthetic without compromise. Capacity is capped at 80, keeping events genuinely intimate.',
        ],
      },
    ],
    internalLinks: [
      {
        id: 'il-001',
        anchorText: 'Alila Villas Uluwatu',
        targetSlug: 'venue/alila-villas-uluwatu',
        targetH1: 'Alila Villas Uluwatu - Clifftop Wedding Venue Bali',
        relevanceScore: 0.95,
        accepted: true,
      },
      {
        id: 'il-002',
        anchorText: 'destination weddings Asia',
        targetSlug: 'destinations/asia',
        targetH1: 'Destination Weddings in Asia - Wedded Wonderland',
        relevanceScore: 0.88,
        accepted: true,
      },
      {
        id: 'il-003',
        anchorText: 'Ayana Bali wedding packages',
        targetSlug: 'venue/ayana-bali',
        targetH1: 'AYANA Resort Bali - Luxury Wedding Venue',
        relevanceScore: 0.82,
        accepted: null,
      },
    ],
    seoScore: 91,
    seoVerdicts: [
      { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: '62 characters - within 30-80 range' },
      { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: '158 characters - within 150-160 range' },
      { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
      { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
      { rule: 'word_count', label: 'Word Count', verdict: 'pass', detail: '2,340 words - target was 2,000+' },
      { rule: 'internal_links', label: 'Internal Links', verdict: 'pass', detail: '2 accepted links - within 2-4 target range' },
      { rule: 'canonical_url', label: 'Canonical URL', verdict: 'warn', detail: 'Canonical not set - will default to publish URL' },
      { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
    ],
    publishedAt: '2026-05-20T09:00:00Z',
    cmsConnectionId: 'cms-con-001',
  },
  {
    id: 'art-002',
    keywordId: 'kw-002',
    h1: 'Destination Weddings in Santorini: Venues, Costs & Planning for 2026',
    slug: 'destination-weddings-santorini-guide',
    metaDescription:
      'Everything you need to plan a Santorini destination wedding in 2026. Iconic caldera views, top venues, legal tips, and budget breakdown for Greece weddings.',
    wordCount: 2180,
    sections: [
      {
        level: 2,
        text: 'Why Santorini Tops Every Wedding Destination List',
        wordCount: 290,
        body: [
          "Santorini's wedding supremacy is visual. The caldera, a volcanic crater submerged by the Aegean, creates a geography unlike anywhere else in Mediterranean Europe. Ceremony venues positioned on the caldera's rim offer an unobstructed view across dark volcanic cliffs to the sea below, with Oia's whitewashed buildings framing the western horizon.",
          "The island's small scale, roughly 73 square kilometres, means guests staying anywhere on the main crescent can reach any venue in under 30 minutes. This practical detail has a meaningful effect on event logistics and guest experience. Couples frequently note that the forced intimacy of the island creates a holiday-within-a-wedding atmosphere that larger destinations cannot replicate.",
        ],
      },
      {
        level: 2,
        text: 'Best Santorini Villages for a Wedding',
        wordCount: 380,
        body: [
          'Santorini divides into caldera-side villages, which face the volcanic crater, and east-coast settlements facing the open Aegean. For weddings, caldera-side positions almost always win on ceremony backdrop. Oia, Imerovigli, and Fira each offer distinct character within that category.',
        ],
      },
      {
        level: 3,
        text: 'Oia: Sunset and Caldera Views',
        wordCount: 130,
        body: [
          "Oia occupies the island's northern tip and stages Santorini's most photographed sunsets. Ceremony timing around 7 PM in high season delivers the gold and amber light that has made the village's blue-domed churches globally iconic. The trade-off is crowd density, which requires careful venue selection and guest logistics planning.",
        ],
      },
      {
        level: 3,
        text: 'Imerovigli: Intimate Clifftop Settings',
        wordCount: 110,
        body: [
          "Imerovigli sits at the caldera's highest point and offers the quietest, most architecturally preserved setting on the island. Hotels here are smaller and more discreet. Couples who prioritise exclusivity and a caldera view without the crowds consistently rank Imerovigli as their preferred base.",
        ],
      },
      {
        level: 2,
        text: 'Legal Requirements for Foreign Couples in Greece',
        wordCount: 320,
        body: [
          'Greece permits civil and religious marriages for foreign nationals, with civil marriage administered by the local municipality. The process requires both partners to obtain certificates of no impediment to marriage from their home country, translated into Greek by a certified translator. Documents typically need to be apostilled, and processing time runs four to eight weeks from submission.',
          'The alternative that most international couples choose is a symbolic blessing ceremony in Santorini, legally preceded by a civil ceremony at home. Greek Orthodox churches generally do not conduct ceremonies for non-Orthodox couples. Private symbolic ceremonies have no such restriction and can incorporate any tradition the couple chooses.',
          'Your Wedded Wonderland planner handles the document checklist and liaises directly with the local municipal office if a legal ceremony is desired. This removes the language and administrative complexity that often discourages couples from pursuing the legal route in Greece.',
        ],
      },
      {
        level: 2,
        text: 'When to Marry in Santorini',
        wordCount: 210,
        body: [
          "Santorini's wedding season runs from May through October, with June, July, and September delivering the best balance of weather, light, and crowd levels. August is peak tourist month on the island, and couples with large guest lists often find the congestion affects the sense of exclusivity they were expecting.",
          'May and October are the most underrated months in the Santorini wedding calendar. Temperatures sit comfortably in the mid-20s Celsius, the island is still lush from spring rainfall, and venue pricing is 20 to 35 percent below peak. Photographers working in these months consistently produce the warmest, most dimensional light of the season.',
        ],
      },
      {
        level: 2,
        text: 'Top Santorini Wedding Venues',
        wordCount: 340,
        body: [
          'Wedded Wonderland lists 34 verified Santorini venues, ranging from private caldera-view estates to boutique hotel buyouts. Leading the enquiry volume are Rocabella Santorini, Andronis Luxury Suites, and Grace Hotel Santorini.',
          "Rocabella combines a caldera-edge infinity pool terrace with a dedicated ceremony platform that handles up to 80 guests. The venue's event team operates in English, French, and Greek, which simplifies coordination for international couples regardless of their planner's language.",
          'Andronis Luxury Suites is Oia\'s most requested private-villa-style venue, offering a cave-suite complex with a ceremony terrace with unobstructed caldera views. The property restricts events to 40 guests, keeping the atmosphere genuinely exclusive.',
        ],
      },
      {
        level: 2,
        text: 'Santorini vs Mykonos for a Destination Wedding',
        wordCount: 400,
        body: [
          'The Santorini versus Mykonos question surfaces in nearly every Greece consultation Wedded Wonderland handles. The two islands target different couples: Santorini is romantic, geological, and visually iconic; Mykonos is social, fashion-forward, and consistently livelier.',
          'For ceremony backdrop, Santorini wins without contest. The caldera view is a composition that Mykonos simply cannot match. Mykonos compensates with superior party infrastructure, a more international bar and restaurant scene, and a windmill-and-whitewash aesthetic that photographs differently but still distinctively.',
          'The Wedded Wonderland recommendation: if the ceremony photograph matters most, choose Santorini. If the post-ceremony celebration and nightlife integration matters most, Mykonos is the stronger choice. Couples who want both sometimes split the trip, spending two nights on each island.',
        ],
      },
    ],
    internalLinks: [
      {
        id: 'il-004',
        anchorText: 'Rocabella Santorini',
        targetSlug: 'venue/rocabella-santorini-hotel-spa',
        targetH1: 'Rocabella Santorini Hotel & Spa - Wedding Venue',
        relevanceScore: 0.93,
        accepted: true,
      },
      {
        id: 'il-005',
        anchorText: 'destination weddings Europe',
        targetSlug: 'destinations/europe',
        targetH1: 'Destination Weddings in Europe - Wedded Wonderland',
        relevanceScore: 0.86,
        accepted: null,
      },
    ],
    seoScore: 78,
    seoVerdicts: [
      { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: '66 characters - within 30-80 range' },
      { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: '159 characters - within 150-160 range' },
      { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
      { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
      { rule: 'word_count', label: 'Word Count', verdict: 'pass', detail: '2,180 words - target was 2,000+' },
      { rule: 'internal_links', label: 'Internal Links', verdict: 'warn', detail: '1 accepted link - recommend 2-4 per article' },
      { rule: 'canonical_url', label: 'Canonical URL', verdict: 'warn', detail: 'Canonical not set - will default to publish URL' },
      { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
    ],
    publishedAt: null,
    cmsConnectionId: null,
  },
  {
    id: 'art-003',
    keywordId: 'kw-003',
    h1: 'Luxury Wedding Venues in Sydney: Waterfront, Gardens and Heritage Sites for 2026',
    slug: 'luxury-wedding-venues-sydney',
    metaDescription:
      "Discover Sydney's finest wedding venues for 2026. Iconic harbour views, manicured gardens, and heritage buildings for ceremonies of 20 to 400 guests.",
    wordCount: 1640,
    sections: [
      {
        level: 2,
        text: 'Why Sydney Weddings Are in a Class of Their Own',
        wordCount: 260,
        body: [
          'Sydney offers a combination that few cities can match: a world-class harbour, a mature wedding vendor ecosystem, and a year-round temperate climate that makes outdoor ceremonies viable in almost any month. The Opera House foreshore, the Royal Botanic Garden, and the series of sandstone heritage buildings in the CBD provide a range of backdrops that shift between dramatic, lush, and architecturally striking.',
        ],
      },
      {
        level: 2,
        text: 'Waterfront and Harbour Venues',
        wordCount: 390,
        body: [
          "Sydney's waterfront venues are the most requested category on Wedded Wonderland, and for good reason. Harbour-facing ceremony and reception spaces consistently produce the most dramatic photographs, particularly at golden hour when the bridge and Opera House catch the late afternoon light.",
        ],
      },
      {
        level: 3,
        text: 'Doltone House Jones Bay Wharf',
        wordCount: 140,
        body: [
          'Jones Bay Wharf is one of Sydney\'s most recognisable event venues, positioned on a heritage timber wharf in Pyrmont with panoramic harbour views. The venue accommodates up to 600 guests for a seated dinner and has a dedicated wedding coordination team with deep experience in multi-day international guest management.',
        ],
      },
      {
        level: 3,
        text: 'Pier One Sydney Harbour',
        wordCount: 120,
        body: [
          'Pier One positions its ceremony and reception spaces on Walsh Bay with direct views to the Harbour Bridge. The venue is particularly suited to couples who want the harbour aesthetic without committing to a full venue buyout, as flexible room configurations allow guest lists from 50 to 350.',
        ],
      },
      {
        level: 2,
        text: 'Garden and Estate Settings',
        wordCount: 310,
        body: [
          'The Royal Botanic Garden Sydney permits wedding ceremonies on its grounds, with several locations offering framed views of the Opera House and harbour. Permits require advance application and are subject to seasonal availability. Estate venues in the Hills District and Hunter Valley, accessible within 90 minutes of the CBD, provide a rural alternative for couples who want space and privacy.',
        ],
      },
      {
        level: 2,
        text: 'Heritage and Inner-City Venues',
        wordCount: 280,
        body: [
          "Sydney's sandstone heritage buildings, many dating to the colonial period, provide ceremony backdrops with genuine architectural character. The Sergeants' Mess in Chowder Bay, Curzon Hall in Marsfield, and Waterview in Bicentennial Park each offer indoor and outdoor spaces within heritage or landmark settings.",
        ],
      },
      {
        level: 2,
        text: 'What to Budget for a Sydney Wedding in 2026',
        wordCount: 300,
        body: [
          'Sydney wedding budgets vary significantly by guest count and venue tier. A ceremony and reception for 80 guests at a mid-market harbourfront venue typically runs between AUD 45,000 and AUD 75,000, inclusive of catering, florals, and a photography package. Premium harbour venues with full buyout options for 150-plus guests start from AUD 120,000.',
          "Wedded Wonderland's Sydney vendor directory covers photographers, stylists, caterers, and celebrants across all price tiers. Couples using our network benefit from preferred-supplier pricing at partner venues and coordination support from planners with direct venue relationships.",
        ],
      },
    ],
    internalLinks: [],
    seoScore: 72,
    seoVerdicts: [
      { rule: 'h1_length', label: 'H1 Length', verdict: 'pass', detail: '76 characters - within 30-80 range' },
      { rule: 'meta_length', label: 'Meta Description', verdict: 'pass', detail: '154 characters - within 150-160 range' },
      { rule: 'keyword_in_h1', label: 'Keyword in H1', verdict: 'pass', detail: 'Primary keyword present in H1' },
      { rule: 'keyword_in_meta', label: 'Keyword in Meta', verdict: 'pass', detail: 'Primary keyword present in meta description' },
      { rule: 'word_count', label: 'Word Count', verdict: 'warn', detail: '1,640 words - article still being drafted, target 2,000+' },
      { rule: 'internal_links', label: 'Internal Links', verdict: 'warn', detail: 'No internal links added yet - pipeline in progress' },
      { rule: 'canonical_url', label: 'Canonical URL', verdict: 'warn', detail: 'Canonical not set - will default to publish URL' },
      { rule: 'schema_org', label: 'Schema.org Type', verdict: 'pass', detail: 'Article schema detected' },
    ],
    publishedAt: null,
    cmsConnectionId: null,
  },
] as const;

// ── CMS connection fixtures ───────────────────────────────────────────────────

export interface DemoCmsConnection {
  readonly id: string;
  readonly provider: 'wordpress' | 'shopify';
  readonly label: string;
  readonly siteUrl: string;
  readonly status: 'verified' | 'invalid' | 'unreachable' | 'unconfigured';
  readonly lastChecked: string | null;
}

export const DEMO_CMS_CONNECTIONS: readonly DemoCmsConnection[] = [
  {
    id: 'cms-con-001',
    provider: 'wordpress',
    label: 'Wedded Wonderland (Staging)',
    siteUrl: 'https://wordpress-1598319-6454696.cloudwaysapps.com',
    status: 'verified',
    lastChecked: '2026-05-30T10:00:00Z',
  },
] as const;

// ── Publish job fixtures ──────────────────────────────────────────────────────

export interface DemoPublishJob {
  readonly id: string;
  readonly articleId: string;
  readonly articleH1: string;
  readonly cmsConnectionId: string;
  readonly provider: 'wordpress' | 'shopify';
  readonly status: 'pending' | 'running' | 'succeeded' | 'failed';
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly externalUrl: string | null;
}

export const DEMO_PUBLISH_JOBS: readonly DemoPublishJob[] = [
  {
    id: 'job-001',
    articleId: 'art-001',
    articleH1: 'Destination Weddings in Bali: The Complete 2026 Planning Guide',
    cmsConnectionId: 'cms-con-001',
    provider: 'wordpress',
    status: 'succeeded',
    startedAt: '2026-05-20T09:00:00Z',
    completedAt: '2026-05-20T09:00:12Z',
    externalUrl: null,
  },
] as const;

