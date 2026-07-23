/**
 * WCAG 2.1 Renk Parlaklığı & Kontrast Hesaplama Yardımcıları
 */

export interface ReadabilityConfig {
  overlayType: 'none' | 'top' | 'bottom' | 'radial' | 'full' | 'local-panel';
  overlayOpacity: number;
  textShadow: boolean;
  backdropBlur?: number;
}

export const WCAG_MIN_RATIO = {
  NORMAL_TEXT: 4.5,
  LARGE_HEADING: 3.0,
  BUTTON_TEXT: 4.5,
  COUNTDOWN_TEXT: 4.5,
};

/**
 * HEX renk kodunu RGB nesnesine dönüştürür.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (!hex) return { r: 255, g: 255, b: 255 };
  let cleanHex = hex.replace('#', '').trim();
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  
  if (cleanHex.length !== 6) {
    return { r: 255, g: 255, b: 255 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return {
    r: isNaN(r) ? 255 : r,
    g: isNaN(g) ? 255 : g,
    b: isNaN(b) ? 255 : b,
  };
}

/**
 * WCAG 2.1 standardına göre bir rengin bağıl parlaklığını (Relative Luminance) hesaplar.
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const normalize = (val: number) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const R = normalize(r);
  const G = normalize(g);
  const B = normalize(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * İki renk arasındaki WCAG 2.1 kontrast oranını hesaplar (1:1 ile 21:1 arasında).
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Arka plan rengine göre okunabilir (WCAG uyumlu) metin rengini döndürür (#171717 veya #FFFFFF).
 */
export function getReadableTextColor(
  backgroundColor: string,
  preferredLight = '#FFFFFF',
  preferredDark = '#171717'
): string {
  if (!backgroundColor) return preferredDark;
  
  const lightContrast = getContrastRatio(preferredLight, backgroundColor);
  const darkContrast = getContrastRatio(preferredDark, backgroundColor);

  return lightContrast >= darkContrast ? preferredLight : preferredDark;
}

/**
 * Geliştirme ortamında kontrast oranını denetler ve düşükse konsola uyarı yazar.
 */
export function checkTemplateContrast(
  templateId: string,
  roleName: string,
  fgColor: string,
  bgColor: string,
  minRequiredRatio: number = WCAG_MIN_RATIO.NORMAL_TEXT
): number {
  const ratio = getContrastRatio(fgColor, bgColor);
  if (process.env.NODE_NODE_ENV === 'development' && ratio < minRequiredRatio) {
    console.warn(
      `[WCAG Contrast Warning] Template "${templateId}" - ${roleName}: ratio is ${ratio.toFixed(2)}:1 (Required: ${minRequiredRatio}:1). FG: ${fgColor}, BG: ${bgColor}`
    );
  }
  return ratio;
}

/**
 * YIQ renk hesaplama (Geriye dönük uyumluluk için)
 */
export function isColorLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}
