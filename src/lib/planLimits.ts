export interface PlanLimits {
  tier: 'standard' | 'premium' | 'corporate';
  name: string;
  maxPhotos: number;
  maxAudioBytes: number;
  allowedTemplates: string[] | 'all';
  allowCustomDomain: boolean;
  allowRemoveWatermark: boolean;
  allowQrCheckin: boolean;
  allowCorporateModules: boolean;
}

export const PLAN_CONFIGS: Record<string, PlanLimits> = {
  standard: {
    tier: 'standard',
    name: 'Standart Paket',
    maxPhotos: 10,
    maxAudioBytes: 5 * 1024 * 1024, // 5MB
    allowedTemplates: ['template1', 'template2', 'template3', 'template4', 'template5', 'royal-gold', 'minimal-paper'],
    allowCustomDomain: false,
    allowRemoveWatermark: false,
    allowQrCheckin: false,
    allowCorporateModules: false,
  },
  premium: {
    tier: 'premium',
    name: 'Premium Paket',
    maxPhotos: 50,
    maxAudioBytes: 15 * 1024 * 1024, // 15MB
    allowedTemplates: 'all',
    allowCustomDomain: true,
    allowRemoveWatermark: true,
    allowQrCheckin: true,
    allowCorporateModules: false,
  },
  corporate: {
    tier: 'corporate',
    name: 'Kurumsal Paket',
    maxPhotos: 200,
    maxAudioBytes: 50 * 1024 * 1024, // 50MB
    allowedTemplates: 'all',
    allowCustomDomain: true,
    allowRemoveWatermark: true,
    allowQrCheckin: true,
    allowCorporateModules: true,
  },
};

/**
 * Checks if a feature or upload exceeds the plan tier limits
 */
export function validatePlanLimit(wedding: any, action: 'upload_photo' | 'upload_audio' | 'select_template', payload?: any): { allowed: boolean; error?: string } {
  const planTier = wedding?.plan_tier || (wedding?.is_paid ? 'premium' : 'standard');
  const limits = PLAN_CONFIGS[planTier] || PLAN_CONFIGS.standard;

  if (action === 'upload_photo') {
    const currentCount = payload?.currentCount || 0;
    if (currentCount >= limits.maxPhotos) {
      return { allowed: false, error: `${limits.name} kapsamındaki fotoğraf yükleme limitine (${limits.maxPhotos} adet) ulaştınız.` };
    }
  }

  if (action === 'upload_audio') {
    const sizeBytes = payload?.sizeBytes || 0;
    if (sizeBytes > limits.maxAudioBytes) {
      return { allowed: false, error: `Ses dosyası boyutu ${limits.name} limitini (${limits.maxAudioBytes / (1024 * 1024)}MB) aşıyor.` };
    }
  }

  if (action === 'select_template') {
    const templateId = payload?.templateId;
    if (limits.allowedTemplates !== 'all' && templateId && !limits.allowedTemplates.includes(templateId)) {
      return { allowed: false, error: `Seçtiğiniz "${templateId}" şablonu ${limits.name} paketine dahil değildir. Lütfen paketinizi yükseltin.` };
    }
  }

  return { allowed: true };
}
