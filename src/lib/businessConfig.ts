/**
 * Canonical Business Configuration & Commercial Launch Constants
 * Single source of truth for commercial, legal, domain, and payment settings.
 */

export const BUSINESS_CONFIG = {
  appName: 'Dijital Davetiyeciniz',
  legalCompanyName: 'Dijital Davetiyeciniz Yazılım Hizmetleri', // Production legal business entity
  supportEmail: 'dijitaldavetiyeciniz@gmail.com',
  canonicalDomain: 'dijital-davetiyeciniz.vercel.app',
  canonicalCurrency: 'TRY' as const,
  currencySymbol: '₺',
  
  // Legal Document Versioning
  legalVersions: {
    privacyPolicy: 'v1.0.2026',
    kvkkNotice: 'v1.0.2026',
    termsOfUse: 'v1.0.2026',
    distanceSalesAgreement: 'v1.0.2026',
    refundPolicy: 'v1.0.2026',
    cookiePolicy: 'v1.0.2026'
  },

  // Payment Configuration
  payment: {
    provider: 'iyzico' as const,
    supportedCurrencies: ['TRY'] as const,
    defaultPlanTier: 'premium' as const,
  }
};

/**
 * Validates the configured payment mode safely without leaking keys
 */
export function getPaymentModeStatus() {
  const isExplicitProd = process.env.PAYMENT_MODE === 'production';
  const hasApiKey = Boolean(process.env.IYZICO_API_KEY);
  const hasSecretKey = Boolean(process.env.IYZICO_SECRET_KEY);
  const hasBaseUrl = Boolean(process.env.IYZICO_BASE_URL);

  const mode = isExplicitProd ? 'production' : 'sandbox';
  const isProductionReady = isExplicitProd && hasApiKey && hasSecretKey && hasBaseUrl;

  return {
    provider: 'iyzico',
    mode,
    isModeExplicit: true,
    apiKeyPresent: hasApiKey,
    secretKeyPresent: hasSecretKey,
    baseUrlPresent: hasBaseUrl,
    isProductionReady,
    blocker: isProductionReady ? null : 'LIVE_IYZICO_CREDENTIALS_MISSING'
  };
}
