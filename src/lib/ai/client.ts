import 'server-only';

// AI Gateway configuration.
//
// Provider: Anthropic (Claude) routed via Vercel AI Gateway.
// Auth:     AI_GATEWAY_API_KEY — env-injected, never in the client bundle.
//
// Phase 3 stubs do NOT call this module. Phase 5 pipeline functions will
// import { AI_MODEL, TOKEN_BUDGETS, TEMPERATURE_PROFILES } from here
// and construct a Vercel AI SDK provider with the operator's gateway URL.
//
// "// TODO: operator-supplied AI Gateway endpoint — see internal methodology doc"

export const AI_MODEL = 'anthropic/claude-sonnet-4-6' as const;

export const TOKEN_BUDGETS = {
  research: 2048,
  outline: 1024,
  draft: 8192,
  refine: 4096,
  internalLinks: 1024,
} as const satisfies Record<string, number>;

export const TEMPERATURE_PROFILES = {
  // Research and validation: low temperature, factual retrieval style
  research: 0.2,
  // Outline generation: moderate creativity for H2/H3 variety
  outline: 0.4,
  // Draft generation: balanced narrative + SEO structure
  draft: 0.5,
  // Refinement: low, stay close to the existing text
  refine: 0.2,
  // Internal link suggestion: deterministic scoring
  internalLinks: 0.1,
} as const satisfies Record<string, number>;

export type PipelineStage = keyof typeof TOKEN_BUDGETS;
