function getCspHeader() {
  const isDev = process.env.NODE_ENV !== 'production';

  // Production CSP strictly omits 'unsafe-eval' and minimizes third-party script origins
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;"
    : "script-src 'self' 'unsafe-inline' https://apis.google.com;";

  return [
    "default-src 'self';",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
    "font-src 'self' data: https://fonts.gstatic.com;",
    "img-src 'self' data: blob: https://*.supabase.co https:;",
    "media-src 'self' blob: https://*.supabase.co https:;",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https:;",
    "frame-ancestors 'self';"
  ].join(' ');
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: getCspHeader()
          }
        ]
      }
    ];
  }
};

export default nextConfig;
