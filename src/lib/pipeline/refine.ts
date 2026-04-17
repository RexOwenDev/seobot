import 'server-only';
import type {
  KeywordInput,
  Draft,
  PipelineStageOutcome,
} from '@/types/pipeline';

const _SYSTEM_PROMPT = '// TODO: operator-supplied prompt — see internal methodology doc';
const _USER_PROMPT_TEMPLATE = '// TODO: operator-supplied prompt — see internal methodology doc';

/**
 * Stage 4 — Draft refinement.
 *
 * Enforces required entities, removes banned terms, adjusts tone, and
 * runs a final brand-voice pass against the operator's style guide.
 *
 * `input.requiredEntities` — terms that must appear at least once
 * `input.bannedTerms`      — terms that must not appear
 * `input.tone`             — target voice profile
 *
 * Stub: returns the draft unchanged. Phase 5 wires in the AI Gateway call.
 */
export async function refineDraft(
  draft: Draft,
  input: KeywordInput,
): Promise<PipelineStageOutcome<Draft>> {
  const start = Date.now();

  // Phase 5: pass draft + input to the refinement prompt and stream the
  // corrected body sections. For now, return the draft as-is.
  void input;

  return {
    ok: true,
    data: draft,
    durationMs: Date.now() - start,
  };
}
