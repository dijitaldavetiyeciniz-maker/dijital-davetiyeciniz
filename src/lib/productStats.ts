/**
 * Authoritative Product Registry Truth
 * Centralized numbers dynamically derived directly from active source registries.
 * Zero hardcoded magic constants.
 */
import { predefinedThemes } from './themes';
import { entranceAnimationTypes } from '../data/openingAnimations';
import { fontOptionsList, fontCategories } from '../data/fontOptions';

export const PRODUCT_STATS = {
  get templateCount(): number {
    return predefinedThemes.length;
  },
  get openingCount(): number {
    return entranceAnimationTypes.length;
  },
  get fontCount(): number {
    return fontOptionsList.length;
  },
  get fontCategoriesCount(): number {
    return fontCategories.filter(c => c.id !== 'all').length;
  },
  get description(): string {
    return `${predefinedThemes.length} seçkin dijital davetiye şablonu, ${entranceAnimationTypes.length} zarf ve sahne açılış animasyonu, ${fontOptionsList.length} tipografi seçeneği.`;
  }
};

export const PRODUCT_TEMPLATE_COUNT = predefinedThemes.length;
export const PRODUCT_OPENING_COUNT = entranceAnimationTypes.length;
export const PRODUCT_FONT_COUNT = fontOptionsList.length;
