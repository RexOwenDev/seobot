import type { VercelConfig } from '@vercel/config/v1';

/**
 * Vercel deployment configuration.
 *
 * Cron definitions are placeholders for future phases — all endpoints are
 * stubs today and return 204 without side-effects.
 */
export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'npm run build',
  crons: [
    { path: '/api/cron/refresh-cms-tokens', schedule: '0 */6 * * *' },
    { path: '/api/cron/scheduled-publishing', schedule: '*/15 * * * *' },
  ],
};
