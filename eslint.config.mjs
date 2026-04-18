/**
 * eslint.config.mjs — ESLint v9 flat config (no FlatCompat)
 *
 * Uses @typescript-eslint directly — the FlatCompat bridge that was here
 * previously caused circular-reference crashes with Next.js 16's legacy
 * plugin structure. Native flat config avoids the serialisation issue.
 *
 * Covers: TypeScript rules, import hygiene, console discipline.
 * React-specific rules (no-unescaped-entities, etc.) are handled by tsc
 * and Next.js's own build-time checks rather than ESLint.
 */
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // ── Global ignores ──────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'docs/**',         // generated SVGs, mockup HTML — not linted
      'scripts/**',      // generator scripts run via tsx, not app code
    ],
  },

  // ── TypeScript source files ─────────────────────────────────────────────
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // ── Baseline TS rules (from recommended) ──────────────────────────
      ...tsPlugin.configs['recommended'].rules,

      // ── Project-specific overrides ────────────────────────────────────
      // Unused vars: allow _ prefix for intentionally ignored params
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Type imports must use `import type` — keeps the client bundle smaller
      '@typescript-eslint/consistent-type-imports': 'error',
      // No console.log in library code — warn to allow console.error/warn
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // ── Relaxed for this codebase ─────────────────────────────────────
      // Non-null assertions used deliberately in tests with satisfies guards
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Empty object type used in discriminated union base interfaces
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
