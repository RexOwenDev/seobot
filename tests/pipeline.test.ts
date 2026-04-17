import { describe, expect, it } from 'vitest';
import type {
  ResearchReport,
  Outline,
  Draft,
  InternalLinkSuggestion,
  PipelineStageOutcome,
} from '../src/types/pipeline';
import { researchKeyword } from '../src/lib/pipeline/research';
import { generateOutline } from '../src/lib/pipeline/outline';
import { generateDraft } from '../src/lib/pipeline/draft';
import { refineDraft } from '../src/lib/pipeline/refine';
import { suggestInternalLinks } from '../src/lib/pipeline/internal-links';
import { runPipeline } from '../src/lib/pipeline/orchestrator';

// Fixture imports (resolveJsonModule: true in tsconfig).
// JSON imports widen string literals to `string`; cast asserts structural compatibility.
import researchFixtureJson from './fixtures/pipeline/research.json';
import outlineFixtureJson from './fixtures/pipeline/outline.json';
import draftFixtureJson from './fixtures/pipeline/draft.json';
import refinedDraftFixtureJson from './fixtures/pipeline/refined-draft.json';
import internalLinksFixtureJson from './fixtures/pipeline/internal-links.json';

const researchFixture = researchFixtureJson as unknown as ResearchReport;
const outlineFixture = outlineFixtureJson as unknown as Outline;
const draftFixture = draftFixtureJson as unknown as Draft;
const refinedDraftFixture = refinedDraftFixtureJson as unknown as Draft;
const internalLinksFixture = internalLinksFixtureJson as unknown as InternalLinkSuggestion[];

const KEYWORD_INPUT = {
  phrase: 'best industrial torque wrenches for commercial automotive shops',
  locale: 'en-US',
  intent: 'commercial',
} as const;

// ── Stage 1: Research ─────────────────────────────────────────────────────────

describe('researchKeyword', () => {
  it('returns ok:true with a ResearchReport', async () => {
    const result = await researchKeyword(KEYWORD_INPUT);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.keyword).toBe(KEYWORD_INPUT.phrase);
    expect(result.data.locale).toBe(KEYWORD_INPUT.locale);
    expect(result.data.classifiedIntent).toBe('commercial');
    expect(result.data.relatedQuestions.length).toBeGreaterThan(0);
    expect(result.data.competitors.length).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('overrides intent from input when provided', async () => {
    const result = await researchKeyword({ ...KEYWORD_INPUT, intent: 'informational' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.classifiedIntent).toBe('informational');
  });

  it('result satisfies PipelineStageOutcome<ResearchReport>', async () => {
    const result: PipelineStageOutcome<ResearchReport> = await researchKeyword(KEYWORD_INPUT);
    expect(result).toBeDefined();
  });
});

// ── Stage 2: Outline ──────────────────────────────────────────────────────────

describe('generateOutline', () => {
  it('returns ok:true with an Outline', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    expect(researchResult.ok).toBe(true);
    if (!researchResult.ok) return;

    const result = await generateOutline(researchResult.data, KEYWORD_INPUT);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.h1.length).toBeGreaterThanOrEqual(20);
    expect(result.data.h1.length).toBeLessThanOrEqual(80);
    expect(result.data.metaDescriptionDraft.length).toBeGreaterThanOrEqual(120);
    expect(result.data.metaDescriptionDraft.length).toBeLessThanOrEqual(170);
    expect(result.data.slugSuggestion).toMatch(/^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$/);
    expect(result.data.sections.length).toBeGreaterThanOrEqual(3);
    expect(result.data.targetWordCount).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('uses suggestedSchemaType from research', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    if (!researchResult.ok) return;

    const result = await generateOutline(researchResult.data, KEYWORD_INPUT);
    if (!result.ok) return;
    expect(result.data.schemaType).toBe(researchResult.data.suggestedSchemaType);
  });

  it('uses targetLength from input when provided', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    if (!researchResult.ok) return;

    const result = await generateOutline(researchResult.data, {
      ...KEYWORD_INPUT,
      targetLength: 1500,
    });
    if (!result.ok) return;
    expect(result.data.targetWordCount).toBe(1500);
  });
});

// ── Stage 3: Draft ────────────────────────────────────────────────────────────

describe('generateDraft', () => {
  it('returns ok:true with a Draft', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    if (!researchResult.ok) return;
    const outlineResult = await generateOutline(researchResult.data, KEYWORD_INPUT);
    if (!outlineResult.ok) return;

    const result = await generateDraft(outlineResult.data, KEYWORD_INPUT);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.h1).toBe(outlineResult.data.h1);
    expect(result.data.slug).toBe(outlineResult.data.slugSuggestion);
    expect(result.data.schemaType).toBe(outlineResult.data.schemaType);
    expect(result.data.sections.length).toBeGreaterThan(0);
    expect(result.data.wordCount).toBeGreaterThan(0);
    expect(result.data.readingTimeMins).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);

    // Every section must have a bodyMarkdown string
    for (const section of result.data.sections) {
      expect(typeof section.bodyMarkdown).toBe('string');
      expect(section.bodyMarkdown.length).toBeGreaterThan(0);
    }
  });
});

// ── Stage 4: Refine ───────────────────────────────────────────────────────────

describe('refineDraft', () => {
  it('returns ok:true and preserves the draft structure', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    if (!researchResult.ok) return;
    const outlineResult = await generateOutline(researchResult.data, KEYWORD_INPUT);
    if (!outlineResult.ok) return;
    const draftResult = await generateDraft(outlineResult.data, KEYWORD_INPUT);
    if (!draftResult.ok) return;

    const result = await refineDraft(draftResult.data, {
      ...KEYWORD_INPUT,
      requiredEntities: ['ISO 6789', 'ForgeTorque'],
      bannedTerms: [],
      tone: 'authoritative',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // Stub returns the draft unchanged — shape must be preserved
    expect(result.data.h1).toBe(draftResult.data.h1);
    expect(result.data.slug).toBe(draftResult.data.slug);
    expect(result.data.sections.length).toBe(draftResult.data.sections.length);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});

// ── Stage 5: Internal Links ───────────────────────────────────────────────────

describe('suggestInternalLinks', () => {
  it('returns ok:true with an array of InternalLinkSuggestion', async () => {
    const researchResult = await researchKeyword(KEYWORD_INPUT);
    if (!researchResult.ok) return;
    const outlineResult = await generateOutline(researchResult.data, KEYWORD_INPUT);
    if (!outlineResult.ok) return;
    const draftResult = await generateDraft(outlineResult.data, KEYWORD_INPUT);
    if (!draftResult.ok) return;

    const result = await suggestInternalLinks(draftResult.data, []);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(Array.isArray(result.data)).toBe(true);
    for (const link of result.data) {
      expect(typeof link.anchorText).toBe('string');
      expect(['intro', 'body', 'conclusion']).toContain(link.positionHint);
      expect(link.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(link.relevanceScore).toBeLessThanOrEqual(100);
    }
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});

// ── Full Orchestrator ─────────────────────────────────────────────────────────

describe('runPipeline', () => {
  it('chains all 5 stages and returns a complete PipelineResult', async () => {
    const result = await runPipeline(KEYWORD_INPUT, []);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const { research, outline, draft, refinedDraft, internalLinks } = result.data;

    // Research → Outline → Draft shape consistency
    expect(outline.schemaType).toBe(research.suggestedSchemaType);
    expect(draft.h1).toBe(outline.h1);
    expect(draft.slug).toBe(outline.slugSuggestion);

    // Refined draft must be a valid Draft
    expect(refinedDraft.h1.length).toBeGreaterThanOrEqual(20);
    expect(refinedDraft.slug).toMatch(/^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$/);

    // Internal links array
    expect(Array.isArray(internalLinks)).toBe(true);
  });

  it('result satisfies PipelineStageOutcome shape', async () => {
    const result = await runPipeline(KEYWORD_INPUT);
    if (result.ok) {
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    } else {
      expect(typeof result.code).toBe('string');
      expect(typeof result.message).toBe('string');
    }
  });
});
