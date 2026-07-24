import { z } from 'zod';

export const CURRENT_SCHEMA_VERSION = 3;

export const CardSurfaceSchema = z.object({
  color: z.string().optional(),
  opacity: z.number().min(0).max(100).optional(),
  blur: z.number().min(0).max(50).optional(),
  borderColor: z.string().optional(),
  borderOpacity: z.number().min(0).max(100).optional(),
  shadowIntensity: z.number().min(0).max(100).optional(),
}).passthrough();

export const DesignOverridesSchema = z.object({
  cardBgColor: z.string().optional(),
  cardOpacity: z.number().min(0).max(100).optional(),
  cardBlur: z.number().min(0).max(50).optional(),
  sceneBackgroundColor: z.string().optional(),
  cardSurface: CardSurfaceSchema.optional(),
  backgroundDesign: z.string().optional(),
  fontFamily: z.string().optional(),
  namesFontFamily: z.string().optional(),
  primaryColor: z.string().optional(),
  textColor: z.string().optional(),
}).passthrough();

export const ContentOverridesSchema = z.object({
  primarySubjectName: z.string().optional(),
  secondarySubjectName: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  eventTitle: z.string().optional(),
  customMessage: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  eventDate: z.string().optional(),
}).passthrough();

export const ModuleOverridesSchema = z.object({
  showPhotos: z.boolean().optional(),
  showRsvp: z.boolean().optional(),
  showComments: z.boolean().optional(),
  showCountdown: z.boolean().optional(),
  showMap: z.boolean().optional(),
}).passthrough();

export const CustomOverridesSchema = z.object({
  schemaVersion: z.number().default(CURRENT_SCHEMA_VERSION),
  design: DesignOverridesSchema.default({}),
  content: ContentOverridesSchema.default({}),
  modules: ModuleOverridesSchema.default({}),
}).passthrough();

export type CustomOverrides = z.infer<typeof CustomOverridesSchema>;

/**
 * Validates, migrates, and returns a safe CustomOverrides object.
 * NEVER throws an unhandled exception or crashes. Returns safe defaults on corrupt JSON.
 */
export function validateAndMigrateOverrides(rawOverrides: any): CustomOverrides {
  if (!rawOverrides || typeof rawOverrides !== 'object') {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      design: {},
      content: {},
      modules: {},
    };
  }

  try {
    let copy = { ...rawOverrides };
    const version = typeof copy.schemaVersion === 'number' ? copy.schemaVersion : 1;

    // Migrate Legacy Version 1 or 2 -> Version 3
    if (version < CURRENT_SCHEMA_VERSION) {
      const design: Record<string, any> = copy.design || {};

      // Migrate root-level legacy keys if present
      if (copy.cardBgColor) design.cardBgColor = copy.cardBgColor;
      if (copy.cardOpacity !== undefined) design.cardOpacity = copy.cardOpacity;
      if (copy.sceneBackgroundColor) design.sceneBackgroundColor = copy.sceneBackgroundColor;
      if (copy.cardBlur !== undefined) design.cardBlur = copy.cardBlur;

      copy = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        design: {
          ...design,
          cardSurface: {
            color: design.cardBgColor || design.cardSurface?.color || '#ffffff',
            opacity: design.cardOpacity !== undefined ? design.cardOpacity : (design.cardSurface?.opacity ?? 90),
            blur: design.cardBlur !== undefined ? design.cardBlur : (design.cardSurface?.blur ?? 0),
          },
        },
        content: copy.content || {},
        modules: copy.modules || {},
      };
    }

    const result = CustomOverridesSchema.safeParse(copy);
    if (result.success) {
      return result.data;
    }

    // Return partial valid schema with fallbacks on validation error
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      design: copy.design || {},
      content: copy.content || {},
      modules: copy.modules || {},
    };
  } catch (err) {
    console.error('Error validating custom_overrides:', err);
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      design: {},
      content: {},
      modules: {},
    };
  }
}
