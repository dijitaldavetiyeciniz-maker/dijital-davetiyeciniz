/**
 * Centralized Canonical Auth & Verification Gate Helper
 */

export interface AuthUserLike {
  id?: string;
  email?: string;
  email_confirmed_at?: string | null;
}

export interface ProfileLike {
  id?: string;
  email?: string;
  is_email_verified?: boolean | null;
  onboarding_completed?: boolean | null;
}

/**
 * Checks whether an account is canonically email verified.
 * Guarantees existing historical users with email_confirmed_at remain verified,
 * while newly registered users must pass OTP verification (is_email_verified === true).
 */
export function isEmailVerified(
  user?: AuthUserLike | null,
  profile?: ProfileLike | null
): boolean {
  if (!user && !profile) return false;

  // 1. If explicit profile flag is verified, user is verified
  if (profile?.is_email_verified === true) {
    return true;
  }

  // 2. If historical Supabase Auth email_confirmed_at is present, preserve compatibility
  if (user?.email_confirmed_at) {
    return true;
  }

  // 3. If explicitly marked false in profile, user is not verified
  if (profile?.is_email_verified === false) {
    return false;
  }

  // 4. Default safe fallback
  return false;
}
