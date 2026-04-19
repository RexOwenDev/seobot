/**
 * Pipeline stage types. These are the in-memory shapes each Phase 3 stub
 * returns — fixtures only in this repo; operator-supplied AI produces them
 * in production.
 */

import type { Heading } from './seo';
import type { KeywordIntent, Tone, SchemaType } from './database';

export interface KeywordInput {
  readonly phrase: string;
  readonly locale: string;
  readonly intent?: KeywordIntent;
  readonly targetLength?: number;
  readonly tone?: Tone;
  readonly audience?: string;
  readonly requiredEntities?: readonly string[];
  readonly bannedTerms?: readonly string[];
}

export interface SerpCompetitor {
  readonly url: string;
  readonly title: string;
  readonly wordCount: number;
  readonly headings: readonly Heading[];
}

export interface ResearchReport {
  readonly keyword: string;
  readonly locale: string;
  readonly classifiedIntent: KeywordIntent;
  readonly relatedQuestions: readonly string[];
  readonly competitors: readonly SerpCompetitor[];
  readonly suggestedSchemaType: SchemaType;
  readonly generatedAt: string;
}

export interface Outline {
  readonly h1: string;
  readonly metaDescriptionDraft: string;
  readonly slugSuggestion: string;
  readonly schemaType: SchemaType;
  readonly sections: readonly Heading[];
  readonly targetWordCount: number;
}

export interface Draft {
  readonly h1: string;
  readonly metaDescription: string;
  readonly slug: string;
  readonly canonicalUrl: string | null;
  readonly schemaType: SchemaType;
  readonly bodyMarkdown: string;
  readonly sections: readonly (Heading & { readonly bodyMarkdown: string })[];
  readonly wordCount: number;
  readonly readingTimeMins: number;
}

export interface InternalLinkSuggestion {
  readonly anchorText: string;
  readonly targetArticleId: string | null;
  readonly targetUrl: string | null;
  readonly positionHint: 'intro' | 'body' | 'conclusion';
  /**
   * Relevance confidence score in the range [0, 1].
   * UI components display this as a percentage: `Math.round(relevanceScore * 100) + '%'`.
   * Pipeline stubs and production AI output MUST use 0–1 floats, not 0–100 integers.
   */
  readonly relevanceScore: number;
}

export interface ExistingArticleRef {
  readonly id: string;
  readonly h1: string;
  readonly slug: string;
  readonly excerpt: string | null;
}

export interface PipelineResult {
  readonly research: ResearchReport;
  readonly outline: Outline;
  readonly draft: Draft;
  readonly refinedDraft: Draft;
  readonly internalLinks: readonly InternalLinkSuggestion[];
}

export interface PipelineStageResult<T> {
  readonly ok: true;
  readonly data: T;
  readonly durationMs: number;
}

export interface PipelineStageError {
  readonly ok: false;
  readonly code:
    | 'operator_methodology_missing'
    | 'validation_failed'
    | 'upstream_error'
    | 'timeout';
  readonly message: string;
}

export type PipelineStageOutcome<T> =
  | PipelineStageResult<T>
  | PipelineStageError;
