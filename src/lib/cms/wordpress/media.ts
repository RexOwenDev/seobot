import 'server-only';
import type {
  WordPressMediaCreate,
  WordPressMediaResponse,
  CmsOperationOutcome,
} from '@/types/cms';
import type { WordPressClient } from './client';

const WP_MEDIA_FIXTURE: WordPressMediaResponse = {
  id: 101,
  source_url: 'https://demo.forgetorque.com/wp-content/uploads/2025/06/torque-wrench-hero.jpg',
  alt_text: 'ForgeTorque Pro-900 industrial torque wrench on a red shop rag',
  mime_type: 'image/jpeg',
};

/**
 * Uploads a featured image to the WP media library.
 *
 * WP endpoint: POST {baseUrl}/media
 * Headers:
 *   Authorization: Basic ...
 *   Content-Disposition: attachment; filename="image.jpg"
 *   Content-Type: {mime type of the blob}
 * Body: raw binary blob (the image file)
 *
 * Note: this endpoint uses multipart binary upload, NOT JSON.
 * The jsonHeaders from WordPressClient are NOT used here — callers
 * must set Content-Type to the image MIME type and Content-Disposition
 * to the filename before sending.
 *
 * Stub: returns fixture media response. Phase 5 wires in the fetch() call.
 */
export async function uploadFeaturedImage(
  client: WordPressClient,
  payload: WordPressMediaCreate,
): Promise<CmsOperationOutcome<WordPressMediaResponse>> {
  // Phase 5:
  // const formData = new FormData();
  // formData.append('file', payload.file, payload.title ?? 'featured-image');
  // fetch(`${client.baseUrl}/media`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: client.authHeader,
  //     'Content-Disposition': `attachment; filename="${payload.title ?? 'image'}"`,
  //   },
  //   body: payload.file,
  // })
  void client;
  return {
    ok: true,
    data: {
      ...WP_MEDIA_FIXTURE,
      alt_text: payload.alt_text ?? WP_MEDIA_FIXTURE.alt_text,
    },
    httpStatus: 201,
  };
}
