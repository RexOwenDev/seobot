import 'server-only';
import type {
  KeywordInput,
  ExistingArticleRef,
  PipelineResult,
  PipelineStageOutcome,
  PipelineStageError,
} from '@/types/pipeline';
import { researchKeyword } from './research';
import { generateOutline } from './outline';
import { generateDraft } from './draft';
import { refineDraft } from './refine';
import { suggestInternalLinks } from './internal-links';

function stageError(code: PipelineStageError['code'], stage: string): PipelineStageError {
  return { ok: false, code, message: `Pipeline aborted at stage: ${stage}` };
}

/**
 * Full pipeline: keyword input → research → outline → draft → refine → internal links.
 *
 * Short-circuits on the first stage error and surfaces it as a `PipelineStageError`.
 * All stage durations are discarded here; callers that need per-stage timing
 * should call individual stage functions directly.
 *
 * @param input           - Keyword and content parameters for this run
 * @param existingArticles - Existing articles used for internal link scoring
 */
export async function runPipeline(
  input: KeywordInput,
  existingArticles: readonly ExistingArticleRef[] = [],
): Promise<PipelineStageOutcome<PipelineResult>> {
  // Stage 1 — Research
  const researchOutcome = await researchKeyword(input);
  if (!researchOutcome.ok) return stageError(researchOutcome.code, 'research');

  // Stage 2 — Outline
  const outlineOutcome = await generateOutline(researchOutcome.data, input);
  if (!outlineOutcome.ok) return stageError(outlineOutcome.code, 'outline');

  // Stage 3 — Draft
  const draftOutcome = await generateDraft(outlineOutcome.data, input);
  if (!draftOutcome.ok) return stageError(draftOutcome.code, 'draft');

  // Stage 4 — Refine
  const refineOutcome = await refineDraft(draftOutcome.data, input);
  if (!refineOutcome.ok) return stageError(refineOutcome.code, 'refine');

  // Stage 5 — Internal links
  const linksOutcome = await suggestInternalLinks(refineOutcome.data, existingArticles);
  if (!linksOutcome.ok) return stageError(linksOutcome.code, 'internal-links');

  return {
    ok: true,
    data: {
      research: researchOutcome.data,
      outline: outlineOutcome.data,
      draft: draftOutcome.data,
      refinedDraft: refineOutcome.data,
      internalLinks: linksOutcome.data,
    },
    durationMs: 0, // aggregate timing not tracked at the orchestrator level
  };
}
