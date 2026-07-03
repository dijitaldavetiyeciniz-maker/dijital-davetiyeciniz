/**
 * YIQ renk hesaplama algoritmasını kullanarak bir rengin (HEX) açık mı koyu mu olduğunu belirler.
 * @param hex Rengin hex kodu (örn: #FFFFFF, #000)
 * @returns Renk açık (light) ise true, koyu (dark) ise false döner.
 */
export function isColorLight(hex: string): boolean {
  if (!hex) return true;
  
  // Hash işaretini kaldır
  hex = hex.replace('#', '');

  // 3 karakterli hex kodunu 6 karaktere çevir (örn: FFF -> FFFFFF)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Geçersiz format ise varsayılan true
  if (hex.length !== 6) return true;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // YIQ denklemi
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // 128 eşik değeri. 128 ve üstü açık renktir.
  return yiq >= 128;
}
