import { NextRequest, NextResponse } from 'next/server';

// Demo window — extend by updating DEMO_EXPIRES_AT env var
const DEMO_EXPIRES_AT = process.env.DEMO_EXPIRES_AT
  ? new Date(process.env.DEMO_EXPIRES_AT)
  : new Date('2026-07-31T23:59:59Z');

// Module-level usage counter.
// Note: resets on cold start — sufficient for a 2-day demo window.
// Production: replace with Vercel KV or Upstash Redis for persistent rate limiting.
let pageViews = 0;
const MAX_DEMO_PAGE_VIEWS = 500;

const EXPIRED_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Demo Expired</title>
<style>body{font-family:system-ui,sans-serif;max-width:520px;margin:120px auto;text-align:center;color:#5a4a3a;background:#faf7f4;padding:0 24px}h1{font-size:1.5rem;font-weight:600;margin-bottom:12px}p{color:#8b7355;line-height:1.6}a{color:#c4a35a}</style>
</head>
<body>
  <h1>Demo window closed</h1>
  <p>This demo has expired. Contact Rex to discuss full deployment for Wedded Wonderland.</p>
</body>
</html>`;

const QUOTA_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Demo Quota Reached</title>
<style>body{font-family:system-ui,sans-serif;max-width:520px;margin:120px auto;text-align:center;color:#5a4a3a;background:#faf7f4;padding:0 24px}h1{font-size:1.5rem;font-weight:600;margin-bottom:12px}p{color:#8b7355;line-height:1.6}a{color:#c4a35a}</style>
</head>
<body>
  <h1>Demo quota reached</h1>
  <p>This demo has reached its usage limit. Contact Rex to discuss full deployment.</p>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Expiry gate — stateless, always reliable
  if (new Date() > DEMO_EXPIRES_AT) {
    return new NextResponse(EXPIRED_HTML, {
      status: 410,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // 2. Usage gate — module-level counter (resets on cold start)
  pageViews++;
  if (pageViews > MAX_DEMO_PAGE_VIEWS) {
    return new NextResponse(QUOTA_HTML, {
      status: 429,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
