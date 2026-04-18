# Security Policy

## Project Scope

SEOBot is a **portfolio skeleton** — it ships typed stubs, API endpoint references, and architecture patterns. The repository contains **no live API keys, no production secrets, and no real user data**. All credentials are operator-supplied at deployment time and documented in [SETUP.md](./SETUP.md).

If you are looking for a credentials leak or a hardcoded secret, there is none to find in this repository by design. See the secrecy model below.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ Yes |
| All other branches | ❌ No — development only |

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report privately by emailing the maintainer directly. Include:

1. A clear description of the vulnerability
2. Steps to reproduce
3. The potential impact
4. Any suggested remediation

You will receive a response within **72 hours**. If the report is valid, a fix will be committed and a security advisory published before any public disclosure.

---

## Security Design Decisions

The following decisions are implemented in the codebase and are NOT configurable by operators:

| Decision | Location | Why |
|----------|----------|-----|
| `import 'server-only'` in all lib files | `src/lib/**` | Prevents accidental import into client bundle |
| `execFile()` with typed args array | `scripts/*.ts` | Eliminates shell injection — args never interpolated |
| Zod schema validation on all API input | `src/app/api/**` | Rejects malformed payloads before they reach business logic |
| CMS credentials stored encrypted | DB `cms_connections` table | AES-256-GCM envelope encryption; key never leaves server |
| `REVOKE SELECT` on `vault.decrypted_secrets` | `supabase/migrations/` | Application role cannot read the raw encryption key |
| Credential retrieval by UUID only | `src/lib/cms/` | No credential enumeration via predictable IDs |
| `noUncheckedIndexedAccess: true` | `tsconfig.json` | Array/object index access returns `T \| undefined` — forces null checks |
| CSP headers | `next.config.ts` | `script-src 'self'`, `connect-src 'self' <supabase>` |
| No CDN dependencies in mockup HTML | `docs/mockups/` | Static-only, zero external network requests |

---

## What Operators Must Secure

When deploying this skeleton, operators are responsible for:

- `SUPABASE_SERVICE_ROLE_KEY` — must remain server-only, never exposed to the browser
- `ENCRYPTION_KEY` — must be rotated regularly and stored in a secrets manager, not `.env`
- CMS credentials — stored encrypted in the DB; the encryption key is the attack surface
- `GEMINI_API_KEY` — used only for asset generation scripts, not for Vercel deployment
- Vercel environment variable access control — restrict to production environment only

---

## Out of Scope

The following are **not** security vulnerabilities for this project:

- Missing authentication on API routes — this is a skeleton; auth middleware is Phase 9+
- No rate limiting — same as above
- Missing HTTPS redirect — handled by Vercel's edge layer at deployment
- `console.warn` / `console.error` calls in production — intentional for operator observability
