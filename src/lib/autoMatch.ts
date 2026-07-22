export function getSmartAutoMatch(eventType: string) {
  const type = eventType.trim().toLowerCase();
  
  if (type === 'kına' || type === 'kina') {
    return {
      template_id: 'henna-velvet',
      primary_color: '#dfb76c',
      text_color: '#ffffff',
      envelope_bg_color: 'solid-burgundy',
      envelope_color: '#7f1d1d',
      seal_style: 'crown',
      font_family: 'Cormorant Garamond',
      names_font_family: 'Playfair Display',
      background_animation: 'rosePetals',
      custom_overrides: {
        henna_variant: 'gold'
      }
    };
  } else if (type === 'sünnet' || type === 'sunnet') {
    return {
      template_id: 'royal-circumcision',
      primary_color: '#dfb76c',
      text_color: '#ffffff',
      envelope_bg_color: 'navy-gold-night',
      envelope_color: '#0b1329',
      seal_style: 'crown',
      font_family: 'Cormorant Garamond',
      names_font_family: 'Playfair Display',
      background_animation: 'goldParticles',
      custom_overrides: {
        circumcision_variant: 'royal'
      }
    };
  } else if (type === 'nişan' || type === 'nisan' || type === 'söz' || type === 'soz') {
    return {
      template_id: 'minimal-paper',
      primary_color: '#7c2d12',
      text_color: '#0f172a',
      envelope_bg_color: 'paper-kraft',
      envelope_color: '#fef3c7',
      seal_style: 'heart',
      font_family: 'Lora',
      names_font_family: 'Outfit',
      background_animation: 'sakura',
      custom_overrides: {
        minimal_variant: 'earth'
      }
    };
  } else if (
    type === 'baby shower' || 
    type === 'çocuk' || 
    type === 'cocuk' ||
    type === 'doğum günü' ||
    type === 'dogum gunu'
  ) {
    return {
      template_id: 'kids-thematic',
      primary_color: '#f43f5e',
      text_color: '#334155',
      envelope_bg_color: 'solid-blush',
      envelope_color: '#fce7f3',
      seal_style: 'heart',
      font_family: 'Nunito',
      names_font_family: 'Nunito',
      background_animation: 'hearts',
      custom_overrides: {
        gender_variant: 'neutral'
      }
    };
  } else if (
    type === 'lansman' || 
    type === 'mezuniyet' || 
    type === 'gala' || 
    type === 'party' || 
    type === 'parti' ||
    type === 'etkinlik'
  ) {
    return {
      template_id: 'modern-event',
      primary_color: '#10b981',
      text_color: '#ffffff',
      envelope_bg_color: 'solid-ivory',
      envelope_color: '#ffffff',
      seal_style: 'minimal',
      font_family: 'Outfit',
      names_font_family: 'Outfit',
      background_animation: 'bokehLights',
      custom_overrides: {
        event_variant: 'tech-launch'
      }
    };
  } else {
    // Düğün / Diğer Davetler
    return {
      template_id: 'folded-seal',
      primary_color: '#c5a880',
      text_color: '#2d1b69',
      envelope_bg_color: 'rose-gold-silk',
      envelope_color: '#ffe4e6',
      seal_style: 'burgundy',
      font_family: 'Lora',
      names_font_family: 'Playfair Display',
      background_animation: 'goldParticles',
      custom_overrides: {}
    };
  }
}
