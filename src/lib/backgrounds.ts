export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'Premium Konsept' | 'Mevsimlik & Özel Gün' | 'Geleneksel & Pastel';
}

export const backgroundPresets: BackgroundPreset[] = [
  // 1. Premium Konseptler
  { id: 'luxury-gold', name: '👑 Lüks Düğün (Gold & Krem)', category: 'Premium Konsept' },
  { id: 'minimal-white', name: '⬜ Minimal Beyaz', category: 'Premium Konsept' },
  { id: 'marble-gold', name: '🏛️ Mermer Gold', category: 'Premium Konsept' },
  { id: 'black-premium', name: '🖤 Siyah Premium', category: 'Premium Konsept' },
  { id: 'royal-dynasty', name: '🔱 Kraliyet Teması', category: 'Premium Konsept' },
  { id: 'corporate-launch', name: '🏢 Kurumsal Lansman', category: 'Premium Konsept' },

  // 2. Geleneksel & Pastel
  { id: 'henna-burgundy', name: '🍷 Bordo Kına', category: 'Geleneksel & Pastel' },
  { id: 'rose-gold', name: '🌸 Rose Gold Nişan', category: 'Geleneksel & Pastel' },
  { id: 'boho-garden', name: '🌿 Bohem Kır', category: 'Geleneksel & Pastel' },
  { id: 'romantic-floral', name: '🌹 Çiçekli Romantik', category: 'Geleneksel & Pastel' },
  { id: 'baby-shower', name: '🍼 Pastel Baby Shower', category: 'Geleneksel & Pastel' },
  { id: 'lavender-garden', name: '🪻 Lavanta Bahçesi', category: 'Geleneksel & Pastel' },
  { id: 'islamic-minimal', name: '🕌 İslami Sade', category: 'Geleneksel & Pastel' },

  // 3. Mevsimlik & Özel Gün
  { id: 'coastal-blue', name: '🏖️ Deniz Kenarı', category: 'Mevsimlik & Özel Gün' },
  { id: 'garden-party', name: '🏡 Garden Party', category: 'Mevsimlik & Özel Gün' },
  { id: 'vintage-retro', name: '📜 Vintage Davetiye', category: 'Mevsimlik & Özel Gün' },
  { id: 'modern-gradient', name: '🌈 Modern Gradient', category: 'Mevsimlik & Özel Gün' },
  { id: 'neon-night', name: '👾 Neon Gece', category: 'Mevsimlik & Özel Gün' },
  { id: 'winter-snow', name: '❄️ Kış Düğünü', category: 'Mevsimlik & Özel Gün' },
  { id: 'autumn-concept', name: '🍁 Sonbahar Konsepti', category: 'Mevsimlik & Özel Gün' }
];

export function getBackgroundStyle(
  bgType: string,
  customImageUrl?: string | null,
  primaryColor?: string
): React.CSSProperties {
  if (customImageUrl) {
    return {
      backgroundImage: `url(${customImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  }

  const normalizedBg = bgType || 'luxury-gold';

  switch (normalizedBg) {
    case 'luxury-gold':
      return {
        backgroundColor: '#faf6f0',
        backgroundImage: 'radial-gradient(circle at 100% 0%, #f6ecd9 0%, transparent 60%), radial-gradient(circle at 0% 100%, #f6ecd9 0%, transparent 60%)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.02)'
      };
    case 'minimal-white':
      return {
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9'
      };
    case 'marble-gold':
      return {
        backgroundImage: 'url(/backgrounds/marble-gold-light.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    case 'black-premium':
      return {
        backgroundColor: '#09090b',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'royal-dynasty':
      return {
        backgroundColor: '#172554',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #172554 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'corporate-launch':
      return {
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)'
      };
    case 'henna-burgundy':
      return {
        backgroundColor: '#450a0a',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #7f1d1d 0%, #450a0a 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'rose-gold':
      return {
        backgroundColor: '#fcf6f5',
        backgroundImage: 'linear-gradient(135deg, #fbe3e3 0%, #f9d4d4 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };
    case 'boho-garden':
      return {
        backgroundColor: '#edf2eb',
        backgroundImage: 'radial-gradient(rgba(100,120,90,0.08) 2px, transparent 0)',
        backgroundSize: '30px 30px',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };
    case 'romantic-floral':
      return {
        backgroundColor: '#fdf4f5',
        backgroundImage: 'linear-gradient(135deg, rgba(244,63,94,0.03) 0%, transparent 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };
    case 'baby-shower':
      return {
        backgroundColor: '#f0f9ff',
        backgroundImage: 'radial-gradient(circle at 0% 0%, #dbeafe 0%, transparent 50%), radial-gradient(circle at 100% 100%, #fce7f3 0%, transparent 50%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.04)'
      };
    case 'lavender-garden':
      return {
        backgroundColor: '#faf5ff',
        backgroundImage: 'radial-gradient(circle at 100% 0%, #f3e8ff 0%, transparent 50%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.04)'
      };
    case 'islamic-minimal':
      return {
        backgroundColor: '#f4fbf7',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #d1fae5 0%, #f4fbf7 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.04)'
      };
    case 'coastal-blue':
      return {
        backgroundColor: '#f0fdfa',
        backgroundImage: 'linear-gradient(180deg, #ccfbf1 0%, #f0fdfa 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };
    case 'garden-party':
      return {
        backgroundColor: '#f0fdf4',
        backgroundImage: 'radial-gradient(circle at 100% 100%, #dcfce7 0%, transparent 60%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };
    case 'vintage-retro':
      return {
        backgroundColor: '#fdf6e2',
        backgroundImage: 'radial-gradient(circle, #fefbf0 0%, #f4e8c1 100%)',
        boxShadow: 'inset 0 0 100px rgba(115,85,38,0.2)'
      };
    case 'modern-gradient':
      return {
        backgroundImage: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.03)'
      };
    case 'neon-night':
      return {
        backgroundColor: '#1e1b4b',
        backgroundImage: 'radial-gradient(circle at 80% 20%, #311042 0%, #03001e 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'winter-snow':
      return {
        backgroundColor: '#f0fdfa',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #e0f2fe 0%, #f0fdfa 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.04)'
      };
    case 'autumn-concept':
      return {
        backgroundColor: '#fef3c7',
        backgroundImage: 'radial-gradient(circle at 10% 20%, #ffedd5 0%, #fef3c7 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };

    default:
      return { backgroundColor: '#fafaf9' };
  }
}

export function isBackgroundLight(bgId: string): boolean {
  if (!bgId) return true;
  
  const darkBackgrounds = [
    'black-premium',
    'royal-dynasty',
    'corporate-launch',
    'henna-burgundy',
    'neon-night'
  ];
  
  return !darkBackgrounds.includes(bgId);
}
