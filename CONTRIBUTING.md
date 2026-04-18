# Contributing to SEOBot

Thank you for your interest in contributing! SEOBot is a portfolio showcase of an AI-driven SEO content pipeline. This guide covers everything you need to get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Architecture Notes](#architecture-notes)

---

## Code of Conduct

Be respectful and constructive. This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting Started

### Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 24.x |
| npm | 10.x |

### Setup

```bash
git clone https://github.com/RexOwenDev/seobot.git
cd seobot
npm install
cp .env.example .env.local   # fill in your operator credentials
```

See **[SETUP.md](./SETUP.md)** for the full environment variable reference and database migration steps.

### Run in development

```bash
npm run dev          # Next.js dev server on http://localhost:3000
npm run type-check   # TypeScript strict check
npm run lint         # ESLint (src/ only)
npm test             # Vitest unit tests
```

---

## Development Workflow

1. **Fork** the repo and create a branch off `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes.** Keep commits atomic and descriptive.

3. **Validate locally** before pushing:
   ```bash
   npm run type-check && npm run lint && npm test
   ```

4. **Open a pull request** against `main`. The CI pipeline runs the same three checks automatically.

---

## Coding Standards

### TypeScript

- **Strict mode** — `strict: true`, `noUncheckedIndexedAccess: true` in `tsconfig.json`. No `any` casts without a comment explaining why.
- **`import type`** — type-only imports must use `import type { ... }`. Enforced by ESLint.
- **Unused variables** — prefix with `_` to signal intentional ignoring (`_SYSTEM_PROMPT`, `_result`).

### Server / Client boundary

- Every file under `src/lib/` that runs server-side logic **must** begin with `import 'server-only';`.
- API routes live under `src/app/api/`. They import from `src/lib/` — never from `src/components/`.

### Security

- Shell commands must use `execFile()` with args as a typed array — never string interpolation into a shell command. This prevents command injection entirely.
- All external input must be validated with **Zod** before use.
- CMS credentials are stored as envelope-encrypted blobs in the database — never in environment variables or client code.

### Naming

| Pattern | Convention |
|---------|-----------|
| Components | `PascalCase` |
| Hooks / utilities | `camelCase` |
| Constants | `UPPER_SNAKE_CASE` |
| Types / interfaces | `PascalCase` |
| Database columns | `snake_case` |

### Style

- Tailwind v4 utility classes — no inline `style` props.
- `cn()` (from `@/lib/utils`) for conditional class merging.
- No `console.log` in library code. Use `console.warn` / `console.error` only.

---

## Testing

Tests live in `tests/` and use **Vitest**.

```bash
npm test            # single run
npm run test:watch  # watch mode
```

Coverage expectations:

- **CMS adapters** (`tests/cms-adapters.test.ts`) — every adapter method, happy path + error cases
- **Pipeline stubs** (`tests/pipeline.test.ts`) — envelope contracts, not implementation
- **SEO validators** (`tests/seo-validators.test.ts`) — all 10 rules, edge cases, boundary values

If you add a new validator rule, add ≥ 3 tests: one pass, one fail, one edge case.

---

## Submitting a Pull Request

1. Fill in the **PR template** completely.
2. Ensure CI passes (type-check + lint + test).
3. Keep PRs focused — one logical change per PR.
4. Reference any related issue with `Closes #N` in the PR description.
5. Squash commits if the branch has noisy WIP history.

PRs that touch the SEO scoring constants or validator logic will require additional review to ensure the public secrecy model is maintained (scoring weights are operator configuration, not repo content).

---

## Architecture Notes

The pipeline follows a strict layered model:

```
Browser ──▶ Next.js App Router ──▶ API Routes ──▶ lib/ ──▶ Supabase / External APIs
```

- `src/types/` — shared TypeScript types mirroring the DB schema and API shapes
- `src/lib/pipeline/` — five stage stubs + orchestrator
- `src/lib/seo/` — validators, scoring engine, constants
- `src/lib/cms/` — WordPress + Shopify clients + canonical adapter layer
- `src/components/` — React UI components (client-side only)
- `src/app/` — Next.js App Router pages and API routes

See [docs/architecture.md](./docs/architecture.md) for the full layer diagram and security decisions table.
