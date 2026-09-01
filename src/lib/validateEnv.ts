export interface EnvironmentValidationResult {
  isValid: boolean;
  missingRequired: string[];
  warnings: string[];
  environment: string;
}

export function validateEnvironment(): EnvironmentValidationResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    missingRequired.push('NEXT_PUBLIC_SUPABASE_URL');
  }

  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseAnon) {
    missingRequired.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    warnings.push('SUPABASE_SERVICE_ROLE_KEY is recommended for privileged background tasks');
  }

  const adminSecret = process.env.ADMIN_SESSION_SECRET;
  if (!adminSecret && process.env.NODE_ENV === 'production') {
    missingRequired.push('ADMIN_SESSION_SECRET');
  }

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    warnings,
    environment: process.env.NODE_ENV || 'development'
  };
}
