import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { publishArticle } from '@/lib/cms/publish';

// Phase 4 skeleton — authentication middleware intentionally absent.
// Phase 5 adds: Supabase session verification, workspace membership check,
// and rate-limiting before the `publishArticle` call.

const PublishRequestSchema = z.object({
  articleId: z.string().min(1),
  cmsConnectionId: z.string().min(1),
});

/**
 * POST /api/cms/publish
 *
 * Queues a publish job for the given article to the given CMS connection.
 *
 * Request body:
 *   { articleId: string (UUID), cmsConnectionId: string (UUID) }
 *
 * Responses:
 *   202 Accepted  — job queued: { jobId, idempotencyKey, status: 'queued' }
 *   400 Bad Request — invalid body shape
 *   500 Internal Server Error — unexpected failure
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  const parsed = PublishRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const outcome = await publishArticle(parsed.data.articleId, parsed.data.cmsConnectionId);

  if (!outcome.ok) {
    return NextResponse.json(
      { error: outcome.message, code: outcome.code },
      { status: outcome.httpStatus ?? 500 },
    );
  }

  return NextResponse.json(outcome.data, { status: 202 });
}
