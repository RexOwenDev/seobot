import 'server-only';
import type { CmsOperationOutcome } from '@/types/cms';
import type { WordPressClient } from './client';

export interface WordPressTerm {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly count: number;
}

// Fixture terms matching the ForgeTorque demo workspace
const CATEGORY_FIXTURE: WordPressTerm = {
  id: 5,
  name: 'Tools & Equipment',
  slug: 'tools-equipment',
  count: 14,
};

const TAG_FIXTURE: WordPressTerm = {
  id: 12,
  name: 'torque wrenches',
  slug: 'torque-wrenches',
  count: 3,
};

/**
 * Returns the WP category ID for the given name, creating it if absent.
 *
 * WP search endpoint: GET {baseUrl}/categories?search={name}&per_page=1
 * WP create endpoint: POST {baseUrl}/categories { name, slug }
 *
 * Stub: returns a fixture category. Phase 5 wires in the two-step
 * search-then-create pattern to avoid duplicate categories.
 */
export async function getOrCreateCategory(
  client: WordPressClient,
  name: string,
): Promise<CmsOperationOutcome<WordPressTerm>> {
  // Phase 5:
  // 1. GET /categories?search={encodeURIComponent(name)}&per_page=1
  // 2. If found, return existing term
  // 3. If not found, POST /categories { name, slug: slugify(name) }
  void client;
  return {
    ok: true,
    data: { ...CATEGORY_FIXTURE, name },
    httpStatus: 200,
  };
}

/**
 * Returns the WP tag ID for the given name, creating it if absent.
 *
 * WP search endpoint: GET {baseUrl}/tags?search={name}&per_page=1
 * WP create endpoint: POST {baseUrl}/tags { name, slug }
 *
 * Stub: returns a fixture tag. Phase 5 wires in the search-then-create pattern.
 */
export async function getOrCreateTag(
  client: WordPressClient,
  name: string,
): Promise<CmsOperationOutcome<WordPressTerm>> {
  void client;
  return {
    ok: true,
    data: { ...TAG_FIXTURE, name },
    httpStatus: 200,
  };
}

/**
 * Resolves a list of category names to WP category IDs.
 * Convenience wrapper over `getOrCreateCategory` for batch resolution.
 */
export async function resolveCategoryIds(
  client: WordPressClient,
  names: readonly string[],
): Promise<CmsOperationOutcome<readonly number[]>> {
  const ids: number[] = [];
  for (const name of names) {
    const outcome = await getOrCreateCategory(client, name);
    if (!outcome.ok) return outcome;
    ids.push(outcome.data.id);
  }
  return { ok: true, data: ids, httpStatus: 200 };
}

/**
 * Resolves a list of tag names to WP tag IDs.
 * Convenience wrapper over `getOrCreateTag` for batch resolution.
 */
export async function resolveTagIds(
  client: WordPressClient,
  names: readonly string[],
): Promise<CmsOperationOutcome<readonly number[]>> {
  const ids: number[] = [];
  for (const name of names) {
    const outcome = await getOrCreateTag(client, name);
    if (!outcome.ok) return outcome;
    ids.push(outcome.data.id);
  }
  return { ok: true, data: ids, httpStatus: 200 };
}
