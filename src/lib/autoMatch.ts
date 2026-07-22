export function getSmartAutoMatch(eventType: string) {
  const type = eventType.trim().toLowerCase();
  
  if (type === 'kına' || type === 'kina') {
    return {
      template_id: 'velvet-henna',
      primary_color: '#dfc384',
      text_color: '#fff7ed',
      envelope_bg_color: 'velvet-burgundy',
      envelope_color: '#5c0618',
      seal_style: 'monogram',
      font_family: 'Cormorant Garamond',
      names_font_family: 'Playfair Display',
      background_animation: 'goldParticles',
      custom_overrides: {
        layoutStyle: 'henna-velvet',
        thematicAssets: ['henna-plate', 'lace-border', 'rose-petals'],
        animationPreset: 'petal-rain',
        sealPreset: 'crest'
      }
    };
  } else if (type === 'sünnet' || type === 'sunnet') {
    return {
      template_id: 'nazar-circumcision',
      primary_color: '#fbbf24',
      text_color: '#fffbeb',
      envelope_bg_color: 'gold-edge',
      envelope_color: '#1e293b',
      seal_style: 'crown',
      font_family: 'Playfair Display',
      names_font_family: 'Playfair Display',
      background_animation: 'goldParticles',
      custom_overrides: {
        layoutStyle: 'royal-circumcision',
        thematicAssets: ['evil-eye', 'shahi-dome', 'crescent-gold'],
        animationPreset: 'star-twinkle',
        sealPreset: 'crown'
      }
    };
  } else if (type === 'nişan' || type === 'nisan' || type === 'söz' || type === 'soz') {
    return {
      template_id: 'minimal-white-wedding',
      primary_color: '#333333',
      text_color: '#111111',
      envelope_bg_color: 'minimal-white-paper',
      envelope_color: '#ffffff',
      seal_style: 'infinity',
      font_family: 'Outfit',
      names_font_family: 'Outfit',
      background_animation: 'pearlLight',
      custom_overrides: {
        layoutStyle: 'minimal-paper'
      }
    };
  } else if (type === 'baby shower' || type === 'baby_shower') {
    return {
      template_id: 'clouds-above',
      primary_color: '#be123c',
      text_color: '#4c0519',
      envelope_bg_color: 'solid-blush',
      envelope_color: '#ffe4e6',
      seal_style: 'heart',
      font_family: 'Outfit',
      names_font_family: 'Outfit',
      background_animation: 'rosePetals',
      custom_overrides: {
        layoutStyle: 'kids-thematic',
        thematicAssets: ['cloud-left', 'cloud-right', 'balloons', 'stars'],
        animationPreset: 'balloon-rise',
        sealPreset: 'heart'
      }
    };
  } else if (type === 'doğum günü' || type === 'dogum gunu' || type === 'çocuk' || type === 'cocuk') {
    return {
      template_id: 'little-racer',
      primary_color: '#ef4444',
      text_color: '#1e293b',
      envelope_bg_color: 'minimal-white-paper',
      envelope_color: '#f8fafc',
      seal_style: 'minimal-monogram',
      font_family: 'Outfit',
      names_font_family: 'Outfit',
      background_animation: 'pearlLight',
      custom_overrides: {
        layoutStyle: 'kids-thematic',
        thematicAssets: ['race-car', 'checkered-flag', 'trophy'],
        animationPreset: 'car-drift',
        sealPreset: 'monogram'
      }
    };
  } else if (
    type === 'lansman' || 
    type === 'corporate' ||
    type === 'kurumsal' || 
    type === 'kurumsal etkinlik' || 
    type === 'gala' || 
    type === 'party' || 
    type === 'parti' ||
    type === 'etkinlik'
  ) {
    return {
      template_id: 'modern-tech-event',
      primary_color: '#06b6d4',
      text_color: '#f8fafc',
      envelope_bg_color: 'glass-effect',
      envelope_color: '#0f172a',
      seal_style: 'minimal-monogram',
      font_family: 'Outfit',
      names_font_family: 'Outfit',
      background_animation: 'neonGradient',
      custom_overrides: {
        layoutStyle: 'modern-event',
        thematicAssets: ['neon-grid', 'tech-orbs'],
        animationPreset: 'neon-pulse',
        sealPreset: 'neon'
      }
    };
  } else {
    // Düğün / Diğer Davetler
    return {
      template_id: 'folded-tassel-linen',
      primary_color: '#78350f',
      text_color: '#1e293b',
      envelope_bg_color: 'kraft-natural',
      envelope_color: '#ecd5b8',
      seal_style: 'double-initials',
      font_family: 'Montserrat',
      names_font_family: 'Montserrat',
      background_animation: 'none',
      custom_overrides: {
        layoutStyle: 'folded-seal',
        thematicAssets: ['hanging-tassel', 'wax-seal-wax', 'gold-threads'],
        animationPreset: 'tassel-swing',
        sealPreset: 'monogram'
      }
    };
  }
}
