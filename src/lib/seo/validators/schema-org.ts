import 'server-only';

import type { RuleResult } from '@/types/seo';
import type { Draft } from '@/types/pipeline';
import { SEO_RULES } from '../constants';

// All valid schema.org article types this pipeline supports.
// Mirrors the `SchemaType` union from src/types/database.ts.
const VALID_SCHEMA_TYPES = new Set([
  'Article',
  'BlogPosting',
  'NewsArticle',
  'HowTo',
  'FAQPage',
] as const);

/**
 * Validates that the article has a recognised schema.org @type.
 *
 * In a production build this would validate the full JSON-LD object structure.
 * As a Phase 6 skeleton, we validate that the schemaType field is populated
 * with a supported type. The full JSON-LD is generated at render time from
 * this field + article metadata.
 *
 *   pass  schemaType is a supported value
 *   fail  schemaType is empty or unrecognised
 */
export function validateSchemaOrg(draft: Draft): RuleResult {
  const schemaType = draft.schemaType;

  if (!schemaType) {
    return {
      key: SEO_RULES.SCHEMA_ORG,
      verdict: 'fail',
      message: 'No schema.org @type set — structured data will not be emitted',
      details: { schemaType: null, validTypes: [...VALID_SCHEMA_TYPES] },
    };
  }

  if (VALID_SCHEMA_TYPES.has(schemaType)) {
    return {
      key: SEO_RULES.SCHEMA_ORG,
      verdict: 'pass',
      message: `Schema.org type is "${schemaType}" — valid structured data will be emitted`,
      details: { schemaType, validTypes: [...VALID_SCHEMA_TYPES] },
    };
  }

  return {
    key: SEO_RULES.SCHEMA_ORG,
    verdict: 'fail',
    message: `Schema.org type "${schemaType}" is not recognised — use one of: ${[...VALID_SCHEMA_TYPES].join(', ')}`,
    details: { schemaType, validTypes: [...VALID_SCHEMA_TYPES] },
  };
}
