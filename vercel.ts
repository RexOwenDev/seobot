// Cron definitions are placeholders — endpoints are stubs returning 204.
export const config = {
  framework: 'nextjs',
  buildCommand: 'npm run build',
  crons: [
    { path: '/api/cron/refresh-cms-tokens', schedule: '0 */6 * * *' },
    { path: '/api/cron/scheduled-publishing', schedule: '*/15 * * * *' },
  ],
};
