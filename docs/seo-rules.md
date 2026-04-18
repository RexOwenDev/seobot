# SEO Validation Rules

SEOBot validates every article against 10 rules before publishing. Each rule returns one of three verdicts: **pass**, **warn**, or **fail**. An overall 0–100 score is computed from the rule verdicts using operator-supplied weights. Articles scoring ≥ 80 are marked `ready`, 60–79 are `needs_work`, and < 60 are `reject`.

> **Note on scoring weights:** The weights applied to each rule are operator configuration — they are not included in this public repository. The 10 rules themselves are implemented against publicly-documented SEO standards.

---

## Rule reference

### 1 · H1 Length (`h1_length`)

| Verdict | Condition |
|---|---|
| pass | H1 is 30–70 characters |
| warn | H1 is 71–100 characters (acceptable but slightly long) |
| fail | H1 is < 30 characters (too short to signal topic) or > 100 characters |

**Rationale:** Google truncates page titles in SERPs at roughly 60 characters. An H1 in the 30–70 range fits the title tag width while providing enough topical signal for crawlers.

---

### 2 · H1 Keyword (`h1_keyword`)

| Verdict | Condition |
|---|---|
| pass | Primary keyword phrase appears verbatim in the H1 |
| warn | ≥ 75% of keyword words appear in the H1 (partial match) |
| fail | Fewer than 75% of keyword words present |

**Rationale:** The H1 is the strongest on-page relevance signal. Exact match is ideal; a high-coverage partial match is acceptable for natural-language variation.

---

### 3 · Meta Description Length (`meta_length`)

| Verdict | Condition |
|---|---|
| pass | Meta description is 150–160 characters |
| warn | 120–149 or 161–175 characters (Google may truncate or rewrite) |
| fail | < 120 characters (insufficient for click-through copy) or > 175 characters |

**Rationale:** Google typically displays 155–160 characters before truncating. Descriptions in the 150–160 range are displayed in full and provide enough copy to earn the click.

---

### 4 · Meta Description Keyword (`meta_keyword`)

| Verdict | Condition |
|---|---|
| pass | Primary keyword phrase appears verbatim in the meta description |
| warn | ≥ 75% of keyword words appear (partial match) |
| fail | Fewer than 75% of keyword words present |

**Rationale:** Google bolds keyword matches in snippet text — matching the search query in the meta description improves visual click-through rate.

---

### 5 · Heading Hierarchy (`heading_hierarchy`)

| Verdict | Condition |
|---|---|
| pass | All heading level transitions are valid (no skipped levels) |
| warn | No H2–H4 sections present (nothing to validate) |
| fail | Any heading jumps more than one level (e.g. H2 → H4) |

**Rationale:** Skipped heading levels break the document outline, which both crawlers and screen readers use to understand content structure. Level drops (H3 → H2) are permitted — they indicate returning to a parent section.

---

### 6 · Keyword Density (`keyword_density`)

| Verdict | Condition |
|---|---|
| pass | Density is 0.8–2.5% |
| warn | Density is 0.5–0.79% (under-optimised) or 2.6–3.5% (slightly high) |
| fail | Density < 0.5% (keyword barely present) or > 3.5% (stuffing) |

**Rationale:** Density is measured at the phrase level: `(occurrences × phrase word count) / total words × 100`. The 0.8–2.5% range signals clear topical relevance without triggering keyword-stuffing penalties. Counting is done with an `indexOf` loop — not a regex — to prevent ReDoS on untrusted input.

---

### 7 · Readability (`readability`)

| Verdict | Condition |
|---|---|
| pass | Flesch Reading Ease score ≥ 60 |
| warn | Score 45–59 (professional/technical content, acceptable) |
| fail | Score < 45 (too complex for a general business audience) |

**FRE formula:**

```
FRE = 206.835 − 1.015 × (words / sentences) − 84.6 × (syllables / words)
```

Syllable count uses a vowel-group approximation (`/[aeiou]+/gi` matches per word). The score is clamped to [0, 100]. A score of 60 corresponds to roughly 8th-grade reading level — appropriate for general business audiences.

---

### 8 · Internal Links (`internal_links`)

| Verdict | Condition |
|---|---|
| pass | ≥ 2 unique internal links in the body |
| warn | Exactly 1 internal link |
| fail | 0 internal links |

Internal links are detected from Markdown link syntax `[text](href)`. A link is considered **internal** if its `href` does not start with `http://`, `https://`, `mailto:`, or `tel:`, and is not an anchor-only `#fragment` reference. Duplicate `href` values are deduplicated before counting.

**Rationale:** Internal links distribute PageRank, help crawlers discover related content, and reduce bounce rate by guiding readers to relevant pages.

---

### 9 · Schema.org Type (`schema_org`)

| Verdict | Condition |
|---|---|
| pass | `schemaType` is one of: `Article`, `BlogPosting`, `NewsArticle`, `HowTo`, `FAQPage` |
| fail | `schemaType` is missing, null, or any other value |

**Rationale:** A valid `@type` is required for structured data to be eligible for Google Rich Results. The five accepted types cover the full range of content this pipeline generates.

---

### 10 · Canonical URL (`canonical_url`)

| Verdict | Condition |
|---|---|
| pass | `canonicalUrl` is a valid absolute `https://` URL |
| warn | `canonicalUrl` is null — will default to publish URL |
| fail | `canonicalUrl` is set but malformed (relative path, `http://`, etc.) |

**Rationale:** Without an explicit canonical tag, search engines must infer the canonical URL — a problem when the same article is reachable via multiple paths (tag pages, pagination, query strings). A missing canonical is a warning rather than a fail because the publish URL usually works as a default.

---

## Scoring

Each rule produces a `RuleResult` with verdict `pass | warn | fail`. The overall score is:

```
score = Σ (weight[rule] × multiplier[verdict])
```

Where `multiplier` is `pass → 1.0`, `warn → 0.5`, `fail → 0.0`.

The weights sum to 100. Their exact values are operator configuration.

---

## Source files

| Rule | Validator |
|---|---|
| `h1_length`, `h1_keyword` | `src/lib/seo/validators/h1.ts` |
| `meta_length`, `meta_keyword` | `src/lib/seo/validators/meta-description.ts` |
| `heading_hierarchy` | `src/lib/seo/validators/heading-hierarchy.ts` |
| `keyword_density` | `src/lib/seo/validators/keyword-density.ts` |
| `readability` | `src/lib/seo/validators/readability.ts` |
| `internal_links` | `src/lib/seo/validators/internal-links.ts` |
| `schema_org` | `src/lib/seo/validators/schema-org.ts` |
| `canonical_url` | `src/lib/seo/validators/canonical.ts` |
| Scoring + report | `src/lib/seo/scoring.ts` |
| Constants + limits | `src/lib/seo/constants.ts` |
