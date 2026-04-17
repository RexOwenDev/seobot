import 'server-only';
import type {
  Draft,
  ExistingArticleRef,
  InternalLinkSuggestion,
  PipelineStageOutcome,
} from '@/types/pipeline';

const _SYSTEM_PROMPT = '// TODO: operator-supplied prompt — see internal methodology doc';
const _USER_PROMPT_TEMPLATE = '// TODO: operator-supplied prompt — see internal methodology doc';

const INTERNAL_LINKS_FIXTURE: readonly InternalLinkSuggestion[] = [
  {
    anchorText: 'ISO 6789 calibration certificate',
    targetArticleId: null,
    targetUrl: null,
    positionHint: 'body',
    relevanceScore: 92,
  },
  {
    anchorText: 'commercial wheel-end torque sequences',
    targetArticleId: null,
    targetUrl: null,
    positionHint: 'body',
    relevanceScore: 87,
  },
  {
    anchorText: 'ForgeTorque heavy-duty socket set',
    targetArticleId: null,
    targetUrl: null,
    positionHint: 'conclusion',
    relevanceScore: 78,
  },
  {
    anchorText: 'shop management system integrations',
    targetArticleId: null,
    targetUrl: null,
    positionHint: 'intro',
    relevanceScore: 65,
  },
];

/**
 * Stage 5 — Internal link suggestion.
 *
 * Scores anchor text opportunities in the draft against the existing article
 * graph and returns ranked suggestions with position hints (intro/body/conclusion).
 *
 * Stub: returns fixture suggestions. Phase 5 wires in the AI Gateway call
 * and resolves `targetArticleId` against the live article graph.
 */
export async function suggestInternalLinks(
  draft: Draft,
  existingArticles: readonly ExistingArticleRef[],
): Promise<PipelineStageOutcome<readonly InternalLinkSuggestion[]>> {
  const start = Date.now();

  // Phase 5: embed draft sections + existing article excerpts, score cosine
  // similarity, return top-N suggestions with operator-tuned relevance threshold.
  void draft;
  void existingArticles;

  return {
    ok: true,
    data: INTERNAL_LINKS_FIXTURE,
    durationMs: Date.now() - start,
  };
}
