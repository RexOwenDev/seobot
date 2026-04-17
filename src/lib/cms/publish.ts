import 'server-only';
import type { CmsProvider } from '@/types/database';
import type { CmsOperationOutcome } from '@/types/cms';

export interface PublishJobStub {
  readonly jobId: string;
  readonly idempotencyKey: string;
  readonly status: 'queued';
  readonly targetProvider: CmsProvider;
  readonly articleId: string;
  readonly cmsConnectionId: string;
}

/**
 * Queues a publish job for the given article to the specified CMS connection.
 *
 * Production flow (Phase 5+):
 *   1. Fetch the ArticleRow from Supabase (service role)
 *   2. Fetch the CmsConnectionRow from Supabase (service role)
 *   3. Decrypt credentials via `decrypt_cms_credentials(connectionId)` RPC
 *   4. Call draftToCanonical → canonicalToWordPress/Shopify adapter
 *   5. Resolve taxonomy IDs (WP only)
 *   6. Call createPost() or createArticle()
 *   7. Write a PublishJobRow to `publish_jobs` with the remote post ID + URL
 *   8. Return the job ID
 *
 * Stub: generates a UUID job ID and returns it without Supabase or CMS calls.
 * The `publish_jobs` table is NOT written in Phase 4.
 *
 * @param articleId      - UUID of the ArticleRow to publish
 * @param cmsConnectionId - UUID of the CmsConnectionRow to publish to
 */
export async function publishArticle(
  articleId: string,
  cmsConnectionId: string,
): Promise<CmsOperationOutcome<PublishJobStub>> {
  // Phase 5: fetch article + connection from Supabase, decrypt credentials,
  // call the appropriate CMS adapter, write a publish_jobs row.
  const jobId = crypto.randomUUID();
  const idempotencyKey = crypto.randomUUID();

  return {
    ok: true,
    data: {
      jobId,
      idempotencyKey,
      status: 'queued',
      targetProvider: 'wordpress', // Phase 5: derived from CmsConnectionRow.provider
      articleId,
      cmsConnectionId,
    },
    httpStatus: 202,
  };
}
