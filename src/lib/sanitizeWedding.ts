/**
 * Sanitizes wedding object for public display by completely removing sensitive fields:
 * - telegram_bot_token
 * - telegram_chat_id
 * - user_email
 * - user_id
 * - payment secrets or internal admin notes
 */
export function sanitizePublicWedding(wedding: any) {
  if (!wedding) return null;
  
  // Clone to avoid mutating original
  const clean = { ...wedding };

  // Delete sensitive fields
  delete clean.telegram_bot_token;
  delete clean.telegram_chat_id;
  delete clean.user_email;
  delete clean.user_id;
  delete clean.service_role_key;
  delete clean.admin_notes;

  // Also clean custom_overrides if any secrets were placed inside
  if (clean.custom_overrides) {
    clean.custom_overrides = { ...clean.custom_overrides };
    delete clean.custom_overrides.telegram_bot_token;
    delete clean.custom_overrides.telegram_chat_id;
    delete clean.custom_overrides.user_email;
  }

  return clean;
}
