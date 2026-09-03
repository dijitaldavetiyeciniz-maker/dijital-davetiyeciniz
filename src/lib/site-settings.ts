import { getSupabaseAdmin } from './supabase-admin';

export interface SiteBrandingConfig {
  siteName: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  lightLogoUrl?: string;
  mobileLogoUrl?: string;
  faviconUrl?: string;
  primaryBrandColor?: string;
  accentBrandColor?: string;
  defaultShareImage?: string;
}

export interface SiteAnnouncementConfig {
  enabled: boolean;
  text: string;
  ctaText?: string;
  ctaUrl?: string;
  openInNewTab?: boolean;
  tone?: 'rose' | 'amber' | 'emerald' | 'indigo' | 'dark';
  textColor?: string;
  dismissible?: boolean;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  url: string;
  isVisible: boolean;
  order: number;
}

export interface SiteHeaderConfig {
  logoText: string;
  logoUrl?: string;
  navItems: HeaderNavItem[];
  ctaVisible: boolean;
  ctaText: string;
  ctaUrl: string;
}

export interface FooterSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface FooterLegalLinks {
  kvkk: string;
  privacy: string;
  terms: string;
  cookies: string;
}

export interface SiteFooterConfig {
  enabled: boolean;
  logoText: string;
  description: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  copyrightText: string;
  socialLinks: FooterSocialLinks;
  legalLinks: FooterLegalLinks;
}

export interface HomepageSection {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
}

export interface SiteHomepageConfig {
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaUrl: string;
  heroVisualUrl?: string;
  sections: HomepageSection[];
}

export interface SiteMaintenanceConfig {
  enabled: boolean;
  title: string;
  description: string;
  estimatedReturn?: string;
  supportEmail?: string;
  visualUrl?: string;
}

export interface SiteSupportConfig {
  enabled: boolean;
  allowGuestTickets: boolean;
  categories: string[];
  operatingHours?: string;
}

export interface SiteGlobalConfig {
  branding: SiteBrandingConfig;
  announcement: SiteAnnouncementConfig;
  header: SiteHeaderConfig;
  footer: SiteFooterConfig;
  homepage: SiteHomepageConfig;
  maintenance: SiteMaintenanceConfig;
  support: SiteSupportConfig;
}

export const defaultSiteConfig: SiteGlobalConfig = {
  branding: {
    siteName: 'Dijital Davetiyeciniz',
    logoUrl: '',
    darkLogoUrl: '',
    lightLogoUrl: '',
    mobileLogoUrl: '',
    faviconUrl: '',
    primaryBrandColor: '#e11d48',
    accentBrandColor: '#d4af37',
    defaultShareImage: ''
  },
  announcement: {
    enabled: false,
    text: 'Yeni Premium Davetiye Şablonlarımız Yayında — Hemen İnceleyin',
    ctaText: 'Şablonları Gör',
    ctaUrl: '/sablonlar',
    openInNewTab: false,
    tone: 'rose',
    textColor: '#ffffff',
    dismissible: true,
    showOnMobile: true,
    showOnDesktop: true
  },
  header: {
    logoText: 'Dijital Davetiyeciniz',
    logoUrl: '',
    navItems: [
      { id: 'nav-templates', label: 'Şablonlar', url: '/sablonlar', isVisible: true, order: 1 },
      { id: 'nav-pricing', label: 'Fiyatlandırma', url: '/fiyatlandirma', isVisible: true, order: 2 },
      { id: 'nav-how', label: 'Nasıl Çalışır?', url: '/nasil-calisir', isVisible: true, order: 3 },
      { id: 'nav-faq', label: 'S.S.S.', url: '/sss', isVisible: true, order: 4 },
      { id: 'nav-contact', label: 'İletişim', url: '/iletisim', isVisible: true, order: 5 }
    ],
    ctaVisible: true,
    ctaText: 'Davetiye Oluştur',
    ctaUrl: '/olustur'
  },
  footer: {
    enabled: true,
    logoText: 'Dijital Davetiyeciniz',
    description: 'Hayalinizdeki dijital düğün, nişan ve kına davetiyesini dakikalar içinde oluşturun, misafirlerinizle anında paylaşın.',
    companyName: 'Dijital Davetiyeciniz Yazılım Hizmetleri',
    contactEmail: 'destek@dijitaldavetiyeciniz.com',
    contactPhone: '',
    copyrightText: '© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: ''
    },
    legalLinks: {
      kvkk: '/kvkk',
      privacy: '/gizlilik-politikasi',
      terms: '/kullanim-kosullari',
      cookies: '/cerez-politikasi'
    }
  },
  homepage: {
    heroHeadline: 'Hayatınızın En Özel Gününü Dijital Zarafetle Duyurun',
    heroSubtitle: 'Dakikalar içinde lüks dijital davetiyenizi tasarlayın; müzik, yol tarifi, LCV ve özel açılış animasyonlarıyla misafirlerinizi büyüleyin.',
    heroCtaText: 'Hemen Ücretsiz Başlayın',
    heroCtaUrl: '/olustur',
    heroVisualUrl: '',
    sections: [
      { id: 'hero', name: 'Hero Alanı', isVisible: true, order: 1 },
      { id: 'templates-showcase', name: 'Popüler Şablonlar', isVisible: true, order: 2 },
      { id: 'features', name: 'Özellikler', isVisible: true, order: 3 },
      { id: 'how-it-works', name: 'Nasıl Çalışır?', isVisible: true, order: 4 },
      { id: 'testimonials', name: 'Mutlu Çiftler', isVisible: true, order: 5 },
      { id: 'faq', name: 'Sıkça Sorulan Sorular', isVisible: true, order: 6 },
      { id: 'final-cta', name: 'Alt Çağrı Alanı', isVisible: true, order: 7 }
    ]
  },
  maintenance: {
    enabled: false,
    title: 'Kısa Süreli Bakım Çalışması',
    description: 'Sizlere daha kesintisiz bir deneyim sunmak amacıyla altyapımızı güncelliyoruz. Çok yakında tekrar yayındayız.',
    estimatedReturn: 'Yaklaşık 30 dakika',
    supportEmail: 'destek@dijitaldavetiyeciniz.com',
    visualUrl: ''
  },
  support: {
    enabled: true,
    allowGuestTickets: true,
    categories: ['Genel Soru', 'Ödeme & Planlar', 'Tasarım & Şablon', 'Özel Alan Adı', 'Teknik Destek'],
    operatingHours: 'Hafta içi 09:00 - 18:00'
  }
};

/**
 * Validates that an URL is safe:
 * - Allows relative internal routes (/...)
 * - Allows secure https URLs
 * - Strictly denies javascript:, data:, and insecure http: in production
 */
export function isSafeUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim().toLowerCase();
  if (trimmed === '' || trimmed === '#') return true;
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  if (trimmed.startsWith('/')) {
    return true;
  }
  if (trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return true;
  }
  if (process.env.NODE_ENV !== 'production' && trimmed.startsWith('http://localhost')) {
    return true;
  }
  return false;
}

export async function getPublicSiteSettings(): Promise<SiteGlobalConfig> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('published_config')
      .eq('id', 'global')
      .maybeSingle();

    if (error || !data || !data.published_config) {
      return defaultSiteConfig;
    }

    const pub = data.published_config;
    return {
      branding: { ...defaultSiteConfig.branding, ...(pub.branding || {}) },
      announcement: { ...defaultSiteConfig.announcement, ...(pub.announcement || {}) },
      header: { ...defaultSiteConfig.header, ...(pub.header || {}) },
      footer: { ...defaultSiteConfig.footer, ...(pub.footer || {}) },
      homepage: { ...defaultSiteConfig.homepage, ...(pub.homepage || {}) },
      maintenance: { ...defaultSiteConfig.maintenance, ...(pub.maintenance || {}) },
      support: { ...defaultSiteConfig.support, ...(pub.support || {}) }
    };
  } catch {
    return defaultSiteConfig;
  }
}
