export interface EnvironmentValidationResult {
  isValid: boolean;
  missingRequired: string[];
  warnings: string[];
  environment: string;
}

export function validateEnvironment(): EnvironmentValidationResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];
  const isProd = process.env.NODE_ENV === 'production';

  // Core Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    missingRequired.push('NEXT_PUBLIC_SUPABASE_URL');
  }

  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseAnon) {
    missingRequired.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!serviceRoleKey) {
    if (isProd) {
      missingRequired.push('SUPABASE_SERVICE_ROLE_KEY');
    } else {
      warnings.push('SUPABASE_SERVICE_ROLE_KEY is recommended for privileged background tasks');
    }
  }

  // Security Secrets
  if (isProd) {
    if (!process.env.SUPERADMIN_PASSWORD) {
      missingRequired.push('SUPERADMIN_PASSWORD');
    }
    if (!process.env.SUPERADMIN_SESSION_SECRET && !process.env.SUPERADMIN_SECRET) {
      missingRequired.push('SUPERADMIN_SESSION_SECRET');
    }
    if (!process.env.ADMIN_COOKIE_SECRET_V1 && !process.env.ADMIN_COOKIE_SECRET) {
      missingRequired.push('ADMIN_COOKIE_SECRET_V1');
    }
  }

  // Optional External Providers
  if (isProd) {
    if (!process.env.GLOBAL_CONFIG && !process.env.EDGE_CONFIG) {
      warnings.push('GLOBAL_CONFIG is not configured (custom domain data plane will fail closed)');
    }
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      warnings.push('IYZICO credentials are not configured (live billing will return 503)');
    }
  }

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    warnings,
    environment: process.env.NODE_ENV || 'development'
  };
}
