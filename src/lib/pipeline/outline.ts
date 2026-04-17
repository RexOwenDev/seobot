import 'server-only';
import type {
  KeywordInput,
  ResearchReport,
  Outline,
  PipelineStageOutcome,
} from '@/types/pipeline';

const _SYSTEM_PROMPT = '// TODO: operator-supplied prompt — see internal methodology doc';
const _USER_PROMPT_TEMPLATE = '// TODO: operator-supplied prompt — see internal methodology doc';

const OUTLINE_FIXTURE: Outline = {
  h1: 'Best Industrial Torque Wrenches for Commercial Automotive Shops',
  metaDescriptionDraft:
    'Compare the top industrial torque wrenches for commercial automotive shops. Expert picks for click-type and digital tools, plus ISO 6789 calibration guidance.',
  slugSuggestion: 'best-industrial-torque-wrenches-commercial-automotive-shops',
  schemaType: 'Article',
  sections: [
    { level: 2, text: 'What Makes a Torque Wrench Commercial-Grade?', position: 1 },
    { level: 3, text: 'Drive Size and Torque Range for Shop Environments', position: 2 },
    { level: 3, text: 'Click-Type vs Digital: Which Is Right for Your Shop?', position: 3 },
    { level: 2, text: 'Top 5 Industrial Torque Wrenches for Commercial Shops', position: 4 },
    { level: 3, text: 'Best Overall: ForgeTorque Pro-900 Series', position: 5 },
    { level: 3, text: 'Best Digital: Precision LCD for Compliance Work', position: 6 },
    { level: 3, text: 'Best Heavy-Duty: 3/4-Inch Drive for Commercial Trucks', position: 7 },
    { level: 2, text: 'ISO 6789 Calibration Requirements for Shop Certification', position: 8 },
    { level: 3, text: 'How Often to Recalibrate Commercial Torque Tools', position: 9 },
    { level: 2, text: 'How to Choose the Right Torque Wrench for Your Shop', position: 10 },
    { level: 2, text: 'Frequently Asked Questions', position: 11 },
  ],
  targetWordCount: 2400,
};

/**
 * Stage 2 — Content outline generation.
 *
 * Produces an H1, meta description draft, slug suggestion, schema type, and
 * ordered H2/H3 section headings from the research report.
 *
 * Stub: returns fixture data. Phase 5 wires in the AI Gateway call.
 */
export async function generateOutline(
  research: ResearchReport,
  input: KeywordInput,
): Promise<PipelineStageOutcome<Outline>> {
  const start = Date.now();
  return {
    ok: true,
    data: {
      ...OUTLINE_FIXTURE,
      schemaType: research.suggestedSchemaType,
      targetWordCount: input.targetLength ?? OUTLINE_FIXTURE.targetWordCount,
    },
    durationMs: Date.now() - start,
  };
}
