import { getSupabaseAdmin } from './supabase-admin';

export type PlanTier = 'standard' | 'premium' | 'corporate';

export interface UserEntitlements {
  planTier: PlanTier;
  planName: string;
  isPaidUser: boolean;
  maxPhotos: number;
  maxAudioMb: number;
  allowedTemplates: string[] | 'all';
  allowedOpenings: string[] | 'all';
  allowCustomDomain: boolean;
  allowRemoveWatermark: boolean;
  allowQrCheckin: boolean;
  allowCorporateModules: boolean;
}

export const STANDARD_ALLOWED_TEMPLATES = [
  'template1',
  'template2',
  'template3',
  'template4',
  'template5',
  'template11',
  'royal-gold',
  'minimal-paper',
  'pure-minimalist'
];

export const STANDARD_ALLOWED_OPENINGS = [
  'envelope',
  'curtain',
  'door',
  'gardenGate',
  'book',
  'luxuryBox',
  'minimalFade',
  'wax-seal-starfield',
  'spotlight',
  'starryNight'
];

export const PREMIUM_ONLY_OPENINGS = [
  'parisianBlackTie',
  'grandOpera',
  'moonlitGarden',
  'vogueEditorial',
  'mediterraneanCeramic',
  'ottomanIllumination',
  'coastalSunset',
  'auroraGlass',
  'botanicalWatercolor',
  'filmPremiere',
  'swissGallery',
  'royalPalace',
  'hennaPalace',
  'princeCeremony',
  'storybook',
  'futureSummit'
];

export const TIER_CONFIGS: Record<PlanTier, UserEntitlements> = {
  standard: {
    planTier: 'standard',
    planName: 'Standart Taslak',
    isPaidUser: false,
    maxPhotos: 10,
    maxAudioMb: 5,
    allowedTemplates: STANDARD_ALLOWED_TEMPLATES,
    allowedOpenings: STANDARD_ALLOWED_OPENINGS,
    allowCustomDomain: false,
    allowRemoveWatermark: false,
    allowQrCheckin: false,
    allowCorporateModules: false,
  },
  premium: {
    planTier: 'premium',
    planName: 'Her Şey Dahil Premium',
    isPaidUser: true,
    maxPhotos: 50,
    maxAudioMb: 15,
    allowedTemplates: 'all',
    allowedOpenings: 'all',
    allowCustomDomain: true,
    allowRemoveWatermark: true,
    allowQrCheckin: true,
    allowCorporateModules: false,
  },
  corporate: {
    planTier: 'corporate',
    planName: 'Kurumsal Etkinlik Paketi',
    isPaidUser: true,
    maxPhotos: 200,
    maxAudioMb: 50,
    allowedTemplates: 'all',
    allowedOpenings: 'all',
    allowCustomDomain: true,
    allowRemoveWatermark: true,
    allowQrCheckin: true,
    allowCorporateModules: true,
  }
};

/**
 * Resolves active plan tier and entitlements for a given user ID
 */
export async function getUserEntitlements(userId?: string | null): Promise<UserEntitlements> {
  if (!userId) {
    return TIER_CONFIGS.standard;
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Check user subscriptions first
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('plan_id, status, plans(code)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sub && (sub as any).plans?.code) {
      const code = (sub as any).plans.code as PlanTier;
      if (TIER_CONFIGS[code]) return TIER_CONFIGS[code];
    }

    // 2. Check profile current_plan_tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_plan_tier')
      .eq('id', userId)
      .maybeSingle();

    if (profile?.current_plan_tier && TIER_CONFIGS[profile.current_plan_tier as PlanTier]) {
      return TIER_CONFIGS[profile.current_plan_tier as PlanTier];
    }
  } catch (err) {
    console.warn('[ENTITLEMENT RESOLUTION WARN]', err);
  }

  return TIER_CONFIGS.standard;
}

/**
 * Checks if a given template is accessible under the plan tier
 */
export function canUseTemplate(planTier: PlanTier | string, templateId: string): boolean {
  const tier = (planTier as PlanTier) in TIER_CONFIGS ? (planTier as PlanTier) : 'standard';
  const config = TIER_CONFIGS[tier];
  if (config.allowedTemplates === 'all') return true;
  return config.allowedTemplates.includes(templateId);
}

/**
 * Checks if a given opening animation is accessible under the plan tier
 */
export function canUseOpening(planTier: PlanTier | string, openingId: string): boolean {
  const tier = (planTier as PlanTier) in TIER_CONFIGS ? (planTier as PlanTier) : 'standard';
  const config = TIER_CONFIGS[tier];
  if (config.allowedOpenings === 'all') return true;
  return !PREMIUM_ONLY_OPENINGS.includes(openingId);
}

/**
 * Evaluates publishing eligibility under C8 safe publishing rules
 */
export function canPublish(
  planTier: PlanTier | string,
  weddingData: {
    is_paid?: boolean;
    template_id?: string;
    entrance_animation?: string;
    custom_domain?: string;
  }
): { allowed: boolean; error?: string } {
  // If wedding was already paid / published historically, preserve backwards-compatibility!
  if (weddingData.is_paid) {
    return { allowed: true };
  }

  const tier = (planTier as PlanTier) in TIER_CONFIGS ? (planTier as PlanTier) : 'standard';
  const config = TIER_CONFIGS[tier];

  // If user has paid subscription (premium / corporate)
  if (config.isPaidUser) {
    return { allowed: true };
  }

  // Free Tier checks:
  if (weddingData.template_id && !canUseTemplate(tier, weddingData.template_id)) {
    return {
      allowed: false,
      error: `Seçilen "${weddingData.template_id}" şablonu Premium pakete dahildir. Yayınlamak için lütfen paketinizi yükseltin.`
    };
  }

  if (weddingData.entrance_animation && !canUseOpening(tier, weddingData.entrance_animation)) {
    return {
      allowed: false,
      error: `Seçilen "${weddingData.entrance_animation}" açılış animasyonu Premium pakete dahildir. Yayınlamak için lütfen paketinizi yükseltin.`
    };
  }

  return { allowed: true };
}
