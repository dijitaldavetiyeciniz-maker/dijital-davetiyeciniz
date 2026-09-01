import { NextRequest, NextResponse } from 'next/server';
import { normalizeHostname, isValidHostname, isPlatformDomain } from '@/lib/domain-utils';
import { getHostResolutionStore } from '@/lib/host-resolution-store';

/**
 * Next.js 16 Custom Domain Request Proxy (Data Plane)
 * High-performance edge routing for tenant custom domains with zero DB lookups on normal request path.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Loop prevention check
  if (request.headers.get('x-proxy-rewritten') === '1') {
    return NextResponse.next();
  }

  // 2. Extract and sanitize Host header
  const rawHost = request.headers.get('host') || request.headers.get('x-forwarded-host') || '';
  const { hostname: normalizedHost, error: normError } = normalizeHostname(rawHost);

  // If host is empty or unparseable, pass through
  if (!normalizedHost || normError) {
    return NextResponse.next();
  }

  // 3. Platform Domain Bypass (localhost, platform domain, .vercel.app, preview hosts)
  if (isPlatformDomain(normalizedHost)) {
    return NextResponse.next();
  }

  // --- CUSTOM DOMAIN BOUNDARY ---

  // 4. Custom Host Surface Policy: Strictly DENY admin, super-admin, and platform management routes
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin') ||
    pathname === '/super-admin' ||
    pathname.startsWith('/super-admin/') ||
    pathname.startsWith('/api/super-admin') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/giris-yap' ||
    pathname === '/kayit-ol' ||
    pathname === '/onboarding'
  ) {
    return new NextResponse('Güvenlik nedeniyle bu alana yalnızca platform ana adresi üzerinden erişilebilir.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-domain-status': 'admin-restricted',
      },
    });
  }

  // 5. Static assets and public API bypass on custom domains
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/sounds/') ||
    pathname.startsWith('/templates/')
  ) {
    return NextResponse.next();
  }

  // 6. Host Trust Boundary Validation (reject malformed, IP literals, etc.)
  if (!isValidHostname(normalizedHost)) {
    return new NextResponse('Invalid Hostname', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // 7. Fast Data-Plane Host Resolution (Shared Store: Edge Config / Low-latency store)
  // ZERO Supabase / SQL DB queries on this path!
  try {
    const store = getHostResolutionStore();
    const mapping = await store.resolve(normalizedHost);

    // 8. Unknown / Inactive Host: Fail closed (404)
    if (!mapping || mapping.status !== 'active') {
      return new NextResponse('Domain Not Found - Bu alan adı henüz bir davetiye ile eşleştirilmemiş veya aktif edilmemiş.', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-domain-status': 'unresolved',
        },
      });
    }

    // 9. Canonical Internal Rewrite: Rewrite to /{weddingSlugOrId}{pathname} with query preserved
    const tenantIdentifier = mapping.weddingSlug || mapping.weddingId;
    const internalPath = pathname === '/' ? `/${tenantIdentifier}` : `/${tenantIdentifier}${pathname}`;

    const targetUrl = new URL(`${internalPath}${request.nextUrl.search}`, request.url);

    // 10. Tenant Header Sanitization & Injection
    const requestHeaders = new Headers(request.headers);
    // Strip client-supplied spoofed headers
    requestHeaders.delete('x-tenant-id');
    requestHeaders.delete('x-custom-domain');

    // Inject verified server-resolved tenant identity
    requestHeaders.set('x-tenant-id', mapping.weddingId);
    requestHeaders.set('x-custom-domain', mapping.hostname);
    requestHeaders.set('x-proxy-rewritten', '1');
    requestHeaders.set('x-resolved-by', 'data-plane');

    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    // Response debug / verification headers
    response.headers.set('x-tenant-id', mapping.weddingId);
    response.headers.set('x-custom-domain', mapping.hostname);
    // Custom domain HSTS: 1 year, NO includeSubDomains, NO preload
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');

    return response;
  } catch (err) {
    // Store failure: Fail safe, do NOT randomly fallback across tenants
    console.error('[Proxy] Host resolution store error:', err);
    return new NextResponse('Service Temporarily Unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav|ogg|mp4|webm|css|js|map)$).*)',
  ],
};
