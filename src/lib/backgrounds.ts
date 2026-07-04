export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'Mermer' | 'Kumaş & Doku' | 'Sanatsal Kağıt' | 'Taş & Ahşap' | 'Pastel Renk';
}

export const backgroundPresets: BackgroundPreset[] = [
  // 1. Mermer Desenler
  { id: 'marble-white', name: 'Beyaz Altın Damarlı Mermer', category: 'Mermer' },
  { id: 'marble-black', name: 'Siyah Nero Marquina Mermer', category: 'Mermer' },
  { id: 'marble-green', name: 'Zümrüt Yeşil Orman Mermer', category: 'Mermer' },
  { id: 'marble-rose', name: 'Pembe Oniks Saray Mermeri', category: 'Mermer' },

  // 2. Kumaş & Kadife Dokular
  { id: 'linen-cream', name: 'Krem Rengi Doğal Keten', category: 'Kumaş & Doku' },
  { id: 'linen-sage', name: 'Adaçayı Yeşili Premium Keten', category: 'Kumaş & Doku' },
  { id: 'linen-rose', name: 'Gül Kurusu Dokulu Keten', category: 'Kumaş & Doku' },
  { id: 'velvet-navy', name: 'Gece Mavisi Lüks Kadife', category: 'Kumaş & Doku' },
  { id: 'velvet-burgundy', name: 'Bordo Lüks Saray Kadifesi', category: 'Kumaş & Doku' },
  { id: 'silk-ivory', name: 'Fildişi İpek Parıltısı', category: 'Kumaş & Doku' },

  // 3. Sanatsal Kağıtlar
  { id: 'paper-kraft', name: 'Doğal Kraft Ambalaj Kağıdı', category: 'Sanatsal Kağıt' },
  { id: 'paper-parchment', name: 'Eskitilmiş Vintage Parşömen', category: 'Sanatsal Kağıt' },
  { id: 'paper-cotton', name: 'El Yapımı Dokulu Pamuk Kağıt', category: 'Sanatsal Kağıt' },
  { id: 'paper-pressed', name: 'Yaprak Baskılı Özel Davet Kağıdı', category: 'Sanatsal Kağıt' },

  // 4. Taş & Ahşap
  { id: 'terrazzo-beige', name: 'İtalyan Mozaik (Terrazzo) Krem', category: 'Taş & Ahşap' },
  { id: 'concrete-grey', name: 'Endüstriyel Ham Gri Beton', category: 'Taş & Ahşap' },
  { id: 'concrete-dark', name: 'Antrasit Koyu Beton zemin', category: 'Taş & Ahşap' },
  { id: 'wood-rustic', name: 'Rustik Eskitme Ahşap Masa', category: 'Taş & Ahşap' },
  { id: 'wood-walnut', name: 'Koyu İtalyan Ceviz Ağacı', category: 'Taş & Ahşap' },
  { id: 'wood-oak', name: 'Doğal İskandinav Meşe', category: 'Taş & Ahşap' },

  // 5. Pastel Renkler
  { id: 'solid-champagne', name: 'Şampanya Pastel', category: 'Pastel Renk' },
  { id: 'solid-sage', name: 'Adaçayı Pastel', category: 'Pastel Renk' },
  { id: 'solid-dustyrose', name: 'Gül Kurusu Pastel', category: 'Pastel Renk' },
  { id: 'solid-terracotta', name: 'Kiremit Terracotta Pastel', category: 'Pastel Renk' },
  { id: 'solid-midnight', name: 'Gece Mavisi Pastel', category: 'Pastel Renk' },
  { id: 'solid-darkslate', name: 'Antrasit Koyu', category: 'Pastel Renk' },
  { id: 'solid-ivory', name: 'Fildişi Sade', category: 'Pastel Renk' },
  { id: 'solid-blush', name: 'Narin Pembe Pastel', category: 'Pastel Renk' },
  { id: 'solid-mint', name: 'Nane Yeşili Pastel', category: 'Pastel Renk' },
  { id: 'solid-lavender', name: 'Zarif Lavanta Pastel', category: 'Pastel Renk' },
  { id: 'solid-gold', name: 'Mat Klasik Altın', category: 'Pastel Renk' },
  { id: 'solid-crimson', name: 'Koyu Kan Kırmızı', category: 'Pastel Renk' },
  { id: 'solid-teal', name: 'Derin Okyanus Yeşili', category: 'Pastel Renk' },
  { id: 'solid-plum', name: 'Koyu Mürdüm / Erik', category: 'Pastel Renk' },
  { id: 'solid-sand', name: 'Çöl Kumu Pastel', category: 'Pastel Renk' }
];

export function getBackgroundStyle(
  bgType: string,
  customImageUrl?: string | null,
  primaryColor?: string
): React.CSSProperties {
  // 1. If custom image URL is provided, it takes highest priority (except for textures that layer on top)
  if (customImageUrl) {
    return {
      backgroundImage: `url(${customImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  }

  const normalizedBg = bgType || 'solid-ivory';

  // Helper for solid pastel hexes
  const solidColors: Record<string, string> = {
    'solid-champagne': '#f7f1e5',
    'solid-sage': '#e1e8db',
    'solid-dustyrose': '#eddcd9',
    'solid-terracotta': '#e2a087',
    'solid-midnight': '#1e293b',
    'solid-darkslate': '#0f172a',
    'solid-ivory': '#fafaf9',
    'solid-blush': '#fff1f2',
    'solid-mint': '#ecfdf5',
    'solid-lavender': '#f5f3ff',
    'solid-gold': '#d4af37',
    'solid-crimson': '#4c0519',
    'solid-teal': '#042f2e',
    'solid-plum': '#2e1065',
    'solid-sand': '#f3efe0'
  };

  if (solidColors[normalizedBg]) {
    return { backgroundColor: solidColors[normalizedBg] };
  }

  switch (normalizedBg) {
    // MERMER DESENLER
    case 'marble-white':
      return {
        backgroundColor: '#fafafc',
        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(212,175,55,0.05) 0%, transparent 60%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.03)'
      };
    case 'marble-black':
      return {
        backgroundColor: '#111215',
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(212,175,55,0.08) 0%, transparent 60%)',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)'
      };
    case 'marble-green':
      return {
        backgroundColor: '#042d1e',
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), radial-gradient(circle at 100% 0%, rgba(212,175,55,0.09) 0%, transparent 60%)',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)'
      };
    case 'marble-rose':
      return {
        backgroundColor: '#fff1f2',
        backgroundImage: 'linear-gradient(135deg, rgba(251,113,133,0.05) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(212,175,55,0.06) 0%, transparent 50%)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.02)'
      };

    // KUMAŞ DOKULAR
    case 'linen-cream':
      return {
        backgroundColor: '#f6f3eb',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)',
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 6px 6px',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)'
      };
    case 'linen-sage':
      return {
        backgroundColor: '#d8e0d5',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)',
        backgroundSize: '14px 14px',
        backgroundPosition: '0 0, 7px 7px',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.12)'
      };
    case 'linen-rose':
      return {
        backgroundColor: '#e9dcd9',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)',
        backgroundSize: '14px 14px',
        backgroundPosition: '0 0, 7px 7px',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)'
      };
    case 'velvet-navy':
      return {
        backgroundColor: '#0a101f',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #172554 0%, #030712 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'velvet-burgundy':
      return {
        backgroundColor: '#3b0712',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #500718 0%, #1c0005 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)'
      };
    case 'silk-ivory':
      return {
        backgroundColor: '#fafaf7',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f4f1e6 50%, #eae5d3 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };

    // SANATSAL KAĞITLAR
    case 'paper-kraft':
      return {
        backgroundColor: '#d8b589',
        backgroundImage: 'radial-gradient(circle, #e2c29c 0%, #c19f72 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)'
      };
    case 'paper-parchment':
      return {
        backgroundColor: '#f1e7d2',
        backgroundImage: 'radial-gradient(circle, #f9f2e3 0%, #dacbb0 100%)',
        boxShadow: 'inset 0 0 100px rgba(115,85,38,0.2)'
      };
    case 'paper-cotton':
      return {
        backgroundColor: '#fbfbf9',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1.5px, transparent 0)',
        backgroundSize: '24px 24px',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.08)'
      };
    case 'paper-pressed':
      return {
        backgroundColor: '#fcfaf4',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(132,150,111,0.03) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(132,150,111,0.04) 0%, transparent 40%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.05)'
      };

    // TAŞ & AHŞAP
    case 'terrazzo-beige':
      return {
        backgroundColor: '#ece6d9',
        backgroundImage: 'radial-gradient(rgba(100,80,60,0.08) 2px, transparent 0), radial-gradient(rgba(200,180,150,0.12) 3px, transparent 0)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.1)'
      };
    case 'concrete-grey':
      return {
        backgroundColor: '#9aa0a6',
        backgroundImage: 'radial-gradient(circle, #aaafb5 0%, #7e848c 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.35)'
      };
    case 'concrete-dark':
      return {
        backgroundColor: '#374151',
        backgroundImage: 'radial-gradient(circle, #4b5563 0%, #1f2937 100%)',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6)'
      };
    case 'wood-rustic':
      return {
        backgroundColor: '#4a3319',
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px), radial-gradient(circle, #5b4227 0%, #301e0c 100%)',
        backgroundSize: '40px 100%, 100% 100%',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)'
      };
    case 'wood-walnut':
      return {
        backgroundColor: '#3e2723',
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), radial-gradient(circle, #4e342e 0%, #1b0000 100%)',
        backgroundSize: '60px 100%, 100% 100%',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)'
      };
    case 'wood-oak':
      return {
        backgroundColor: '#c19f72',
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(circle, #cfb088 0%, #a28155 100%)',
        backgroundSize: '50px 100%, 100% 100%',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)'
      };

    default:
      return { backgroundColor: '#fafaf9' };
  }
}
