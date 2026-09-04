import { NextRequest, NextResponse } from 'next/server';
import { normalizeHostname, isValidHostname, isPlatformDomain } from '@/lib/domain-utils';
import { getHostResolutionStore, HostStoreUnavailableError } from '@/lib/host-resolution-store';

/**
 * Explicit Custom Domain API Allowlist (Deny-by-default policy)
 * Only public invitation services may be called from a custom domain.
 */
const ALLOWED_CUSTOM_DOMAIN_API_PREFIXES = [
  '/api/rsvp',
  '/api/guestbook',
  '/api/checkin',
  '/api/invitation',
];

function isCustomDomainApiAllowed(pathname: string): boolean {
  return ALLOWED_CUSTOM_DOMAIN_API_PREFIXES.some(prefix => 
    pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}?`)
  );
}

/**
 * Next.js 16 Custom Domain Request Proxy (Data Plane)
 * High-performance edge routing for tenant custom domains with zero DB lookups on normal request path.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Extract and sanitize Host header
  const rawHost = request.headers.get('host') || request.headers.get('x-forwarded-host') || '';
  const { hostname: normalizedHost, error: normError } = normalizeHostname(rawHost);

  // If host is empty or unparseable, pass through to platform router
  if (!normalizedHost || normError) {
    return NextResponse.next();
  }

  // 2. Platform Domain Bypass (localhost, platform root domain, .vercel.app, preview hosts)
  if (isPlatformDomain(normalizedHost)) {
    return NextResponse.next();
  }

  // --- CUSTOM DOMAIN BOUNDARY ---

  // 3. Custom Host Surface Policy: Strictly DENY platform admin, super-admin, and private routes
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/super-admin' ||
    pathname.startsWith('/super-admin/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/giris-yap' ||
    pathname === '/kayit-ol' ||
    pathname === '/onboarding' ||
    pathname === '/odeme' ||
    pathname.startsWith('/odeme/') ||
    pathname === '/bakim'
  ) {
    return new NextResponse('Güvenlik nedeniyle bu alana yalnızca platform ana adresi üzerinden erişilebilir.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-domain-status': 'admin-restricted',
      },
    });
  }

  // 4. API Request Handling on Custom Domains (Deny-by-default)
  if (pathname.startsWith('/api/')) {
    if (!isCustomDomainApiAllowed(pathname)) {
      return new NextResponse('Güvenlik politikası: Bu API uç noktasına özel alan adı üzerinden erişilemez.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-domain-status': 'api-restricted',
        },
      });
    }
    // Allowed public API on custom domain
    return NextResponse.next();
  }

  // 5. Static assets pass-through on custom domains
  if (
    pathname.startsWith('/_next') ||
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
    
    // Avoid double rewrite if internal path already prefixed
    if (pathname.startsWith(`/${tenantIdentifier}`)) {
      return NextResponse.next();
    }

    const internalPath = pathname === '/' ? `/${tenantIdentifier}` : `/${tenantIdentifier}${pathname}`;
    const targetUrl = new URL(`${internalPath}${request.nextUrl.search}`, request.url);

    // 10. Tenant Header Sanitization & Injection
    const requestHeaders = new Headers(request.headers);
    // Strip client-supplied spoofed internal headers
    requestHeaders.delete('x-tenant-id');
    requestHeaders.delete('x-custom-domain');
    requestHeaders.delete('x-proxy-rewritten');
    requestHeaders.delete('x-resolved-by');

    // Inject verified server-resolved tenant identity
    requestHeaders.set('x-tenant-id', mapping.weddingId);
    requestHeaders.set('x-custom-domain', mapping.hostname);
    requestHeaders.set('x-resolved-by', 'data-plane');

    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    // Custom domain HSTS: 1 year, NO includeSubDomains, NO preload
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');

    return response;
  } catch (err) {
    // Store failure: Fail safe with 503, do NOT randomly fallback across tenants
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
     * Match all request paths except for static files and asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav|ogg|mp4|webm|css|js|map)$).*)',
  ],
};
