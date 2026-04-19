import 'server-only';
import type { WordPressPostCreate, WordPressPostResponse } from '@/types/cms';
import type { CmsOperationOutcome } from '@/types/cms';
import type { WordPressClient } from './client';

// Fixture representing a successfully created WP post (draft state).
const WP_POST_FIXTURE: WordPressPostResponse = {
  id: 42,
  date: '2025-06-15T09:00:00',
  slug: 'best-industrial-torque-wrenches-commercial-automotive-shops',
  status: 'draft',
  link: 'https://demo.forgetorque.com/?p=42',
  title: { rendered: 'Best Industrial Torque Wrenches for Commercial Automotive Shops' },
  content: {
    rendered:
      '<p>Choosing the right torque wrench for a commercial automotive shop is a decision that affects technician safety, vehicle liability, and ISO certification compliance.</p>',
    protected: false,
  },
  excerpt: {
    rendered:
      '<p>Compare the top industrial torque wrenches for commercial automotive shops. Expert picks for click-type and digital tools, plus ISO 6789 calibration guidance.</p>',
  },
  categories: [5],
  tags: [12, 15],
  featured_media: 0,
};

/**
 * Creates a new WP post.
 *
 * WP endpoint: POST {baseUrl}/posts
 * Auth: Authorization header from WordPressClient
 *
 * Stub: returns fixture data. Phase 5 wires in the actual fetch() call.
 */
export async function createPost(
  client: WordPressClient,
  payload: WordPressPostCreate,
): Promise<CmsOperationOutcome<WordPressPostResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/posts`, { method: 'POST', headers: client.jsonHeaders, body: JSON.stringify(payload) })
  void client;
  return {
    ok: true,
    data: {
      ...WP_POST_FIXTURE,
      slug: payload.slug,
      status: payload.status, // already WordPressStatus — cast was redundant
      title: { rendered: payload.title },
    },
    httpStatus: 201,
  };
}

/**
 * Updates an existing WP post.
 *
 * WP endpoint: POST {baseUrl}/posts/{id}
 * Note: WP REST API uses POST (not PUT/PATCH) for updates.
 *
 * Stub: returns fixture data with updated fields.
 */
export async function updatePost(
  client: WordPressClient,
  postId: number,
  payload: Partial<WordPressPostCreate>,
): Promise<CmsOperationOutcome<WordPressPostResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/posts/${postId}`, { method: 'POST', ... })
  void client;
  return {
    ok: true,
    data: {
      ...WP_POST_FIXTURE,
      id: postId,
      slug: payload.slug ?? WP_POST_FIXTURE.slug,
      status: payload.status ?? WP_POST_FIXTURE.status, // nullish coalescing infers WordPressStatus
    },
    httpStatus: 200,
  };
}

/**
 * Retrieves a single WP post by ID.
 *
 * WP endpoint: GET {baseUrl}/posts/{id}
 *
 * Stub: returns fixture data.
 */
export async function getPost(
  client: WordPressClient,
  postId: number,
): Promise<CmsOperationOutcome<WordPressPostResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/posts/${postId}`, { headers: client.jsonHeaders })
  void client;
  return {
    ok: true,
    data: { ...WP_POST_FIXTURE, id: postId },
    httpStatus: 200,
  };
}
