import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      // Map @/* to src/* to match the tsconfig paths used in Next.js
      '@': resolve(__dirname, './src'),
      // Prevent the `server-only` package from throwing in the Node/vitest env
      'server-only': resolve(__dirname, './tests/__mocks__/server-only.ts'),
    },
  },
});
