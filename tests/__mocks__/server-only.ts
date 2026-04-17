// Vitest mock for the `server-only` package.
//
// In Next.js, `server-only` uses a conditional export: the `react-server`
// condition resolves to an empty module, while the default resolves to a
// module that throws. Vitest runs in Node (no React bundler), so without
// this alias it would import the throwing variant and break all server-only
// pipeline tests.
//
// This file is aliased in vitest.config.ts: 'server-only' → this path.
export {};
