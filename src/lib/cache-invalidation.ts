import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidates cache tags and paths on state transitions (publish, settings update, maintenance toggle)
 */
export async function invalidateInvitationCache(slug: string, customDomain?: string): Promise<void> {
  try {
    if (slug) {
      revalidatePath(`/${slug}`);
      revalidateTag(`invitation-${slug}`, 'max');
    }
    if (customDomain) {
      revalidateTag(`domain-${customDomain}`, 'max');
    }
  } catch {
    // Graceful fallback during static analysis or non-cache contexts
  }
}

export async function invalidateGlobalSiteSettingsCache(): Promise<void> {
  try {
    revalidatePath('/');
    revalidatePath('/sablonlar');
    revalidatePath('/fiyatlandirma');
    revalidatePath('/iletisim');
    revalidatePath('/bakim');
    revalidateTag('site-settings', 'max');
  } catch {
    // Graceful fallback
  }
}
