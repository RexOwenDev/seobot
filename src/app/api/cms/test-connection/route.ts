import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { CmsProvider } from '@/types/database';

// Phase 4 skeleton — authentication middleware intentionally absent.
// Phase 5 adds: Supabase session verification, workspace membership check.

// Security: this route accepts a cmsConnectionId (UUID) and looks up credentials
// from the database using the service-role client. Credentials are NEVER sent
// in the request body — they transit only over the encrypted DB connection.
const TestConnectionRequestSchema = z.object({
  cmsConnectionId: z.string().uuid({ message: 'cmsConnectionId must be a valid UUID' }),
});

export interface TestConnectionResponse {
  readonly cmsConnectionId: string;
  readonly provider: CmsProvider;
  readonly status: 'verified' | 'invalid' | 'unreachable';
  readonly siteUrl: string;
  readonly checkedAt: string;
}

// Fixture response for the Phase 4 stub
function buildFixtureResponse(cmsConnectionId: string): TestConnectionResponse {
  return {
    cmsConnectionId,
    provider: 'wordpress',
    status: 'verified',
    siteUrl: 'https://demo.forgetorque.com',
    checkedAt: new Date().toISOString(),
  };
}

/**
 * POST /api/cms/test-connection
 *
 * Validates that the CMS credentials stored for the given connection ID
 * are reachable and correctly authenticated.
 *
 * Phase 5 production flow:
 *   1. Look up CmsConnectionRow by cmsConnectionId (verifies workspace access)
 *   2. Call decrypt_cms_credentials(cmsConnectionId) Supabase RPC
 *   3. Attempt a lightweight read against the CMS (WP: GET /wp-json; Shopify: GET /blogs.json?limit=1)
 *   4. Return verified/invalid/unreachable based on HTTP response
 *   5. Update CmsConnectionRow.verification_status in Supabase
 *
 * Request body:
 *   { cmsConnectionId: string (UUID) }
 *
 * Responses:
 *   200 OK  — connection tested: { cmsConnectionId, provider, status, siteUrl, checkedAt }
 *   400 Bad Request — invalid body
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

  const parsed = TestConnectionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Phase 4 stub: return fixture response without Supabase or CMS calls.
  return NextResponse.json(buildFixtureResponse(parsed.data.cmsConnectionId), { status: 200 });
}
