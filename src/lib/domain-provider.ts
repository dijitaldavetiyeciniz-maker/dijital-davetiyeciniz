/**
 * Server-only Domain Provider Implementation for Vercel Project Domains API & Fake Testing Provider.
 * NEVER import this file in client-side React components!
 */
import crypto from 'crypto';

/**
 * Normalized Domain Provider Error Codes
 */
export type ProviderErrorCode =
  | 'DOMAIN_ALREADY_EXISTS'
  | 'DOMAIN_NOT_FOUND'
  | 'VERIFICATION_PENDING'
  | 'PROVIDER_UNAUTHORIZED'
  | 'PROVIDER_RATE_LIMITED'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_DOMAIN'
  | 'UNKNOWN_PROVIDER_ERROR';

export interface DomainVerificationRequirement {
  type: 'TXT' | 'CNAME' | 'A';
  domain: string;
  value: string;
  reason?: string;
}

export interface DomainOperationResult {
  success: boolean;
  domainId?: string;
  hostname?: string;
  status?: 'pending' | 'verifying' | 'active' | 'error' | 'removing';
  sslStatus?: 'pending' | 'active' | 'error';
  verified?: boolean;
  verificationRequirements?: DomainVerificationRequirement[];
  errorCode?: ProviderErrorCode;
  errorMessage?: string;
}

/**
 * Domain Provider Contract Interface
 */
export interface DomainProvider {
  addDomain(hostname: string): Promise<DomainOperationResult>;
  verifyDomain(hostname: string): Promise<DomainOperationResult>;
  getDomainStatus(hostname: string): Promise<DomainOperationResult>;
  removeDomain(hostname: string): Promise<DomainOperationResult>;
}

/**
 * Production Vercel Project Domains API Implementation
 */
export class VercelDomainProvider implements DomainProvider {
  private projectId: string;
  private token: string;
  private teamId?: string;

  constructor(projectId: string, token: string, teamId?: string) {
    if (!projectId || !token) {
      throw new Error('VercelDomainProvider requires both projectId and token.');
    }
    this.projectId = projectId;
    this.token = token;
    this.teamId = teamId;
  }

  private getTeamQuery(): string {
    return this.teamId ? `?teamId=${encodeURIComponent(this.teamId)}` : '';
  }

  /**
   * Helper to perform sanitized fetch to Vercel REST API without leaking tokens in logs
   */
  private async vercelFetch(endpoint: string, options: RequestInit = {}): Promise<{ status: number; data: any }> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    return { status: res.status, data };
  }

  /**
   * Maps Vercel HTTP status and response payload to normalized internal error
   */
  private normalizeVercelError(status: number, data: any, defaultMsg: string): { errorCode: ProviderErrorCode; errorMessage: string } {
    const rawMsg = data?.error?.message || '';

    if (status === 401 || status === 403) {
      return {
        errorCode: 'PROVIDER_UNAUTHORIZED',
        errorMessage: 'Domain sağlayıcı yetkilendirmesi başarısız oldu. Lütfen platform yöneticisi ile iletişime geçin.',
      };
    }

    if (status === 409 || rawMsg.toLowerCase().includes('already in use') || rawMsg.toLowerCase().includes('already exists')) {
      return {
        errorCode: 'DOMAIN_ALREADY_EXISTS',
        errorMessage: 'Bu alan adı sistemde veya başka bir projede zaten kayıtlıdır.',
      };
    }

    if (status === 404 || rawMsg.toLowerCase().includes('not found')) {
      return {
        errorCode: 'DOMAIN_NOT_FOUND',
        errorMessage: 'Alan adı sağlayıcı üzerinde bulunamadı.',
      };
    }

    if (status === 429) {
      return {
        errorCode: 'PROVIDER_RATE_LIMITED',
        errorMessage: 'Çok fazla istek yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.',
      };
    }

    if (status >= 500) {
      return {
        errorCode: 'PROVIDER_UNAVAILABLE',
        errorMessage: 'Alan adı sağlayıcı servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyin.',
      };
    }

    if (status === 400) {
      return {
        errorCode: 'INVALID_DOMAIN',
        errorMessage: rawMsg || 'Geçersiz alan adı yapılandırması.',
      };
    }

    return {
      errorCode: 'UNKNOWN_PROVIDER_ERROR',
      errorMessage: defaultMsg,
    };
  }

  /**
   * Adds custom domain to Vercel project
   * Endpoint: POST https://api.vercel.com/v10/projects/{projectId}/domains
   */
  async addDomain(hostname: string): Promise<DomainOperationResult> {
    try {
      const url = `https://api.vercel.com/v10/projects/${encodeURIComponent(this.projectId)}/domains${this.getTeamQuery()}`;
      const { status, data } = await this.vercelFetch(url, {
        method: 'POST',
        body: JSON.stringify({ name: hostname }),
      });

      if (status !== 200 && status !== 201) {
        const { errorCode, errorMessage } = this.normalizeVercelError(status, data, 'Alan adı eklenemedi');
        return {
          success: false,
          hostname,
          errorCode,
          errorMessage,
        };
      }

      const isVerified = Boolean(data.verified);
      const verificationRequirements: DomainVerificationRequirement[] = [];

      if (Array.isArray(data.verification)) {
        for (const v of data.verification) {
          verificationRequirements.push({
            type: v.type || 'TXT',
            domain: v.domain || hostname,
            value: v.value || '',
            reason: v.reason,
          });
        }
      }

      // Default CNAME requirement if no special TXT challenge
      if (verificationRequirements.length === 0 && !isVerified) {
        verificationRequirements.push({
          type: 'CNAME',
          domain: hostname,
          value: 'cname.vercel-dns.com',
        });
      }

      return {
        success: true,
        domainId: data.name || hostname,
        hostname,
        status: isVerified ? 'active' : 'pending',
        sslStatus: isVerified ? 'active' : 'pending',
        verified: isVerified,
        verificationRequirements,
      };
    } catch (err: any) {
      return {
        success: false,
        hostname,
        errorCode: 'PROVIDER_UNAVAILABLE',
        errorMessage: 'Sağlayıcı servisiyle bağlantı kurulamadı.',
      };
    }
  }

  /**
   * Triggers verification on Vercel project domain
   * Endpoint: POST https://api.vercel.com/v9/projects/{projectId}/domains/{domain}/verify
   */
  async verifyDomain(hostname: string): Promise<DomainOperationResult> {
    try {
      const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(this.projectId)}/domains/${encodeURIComponent(hostname)}/verify${this.getTeamQuery()}`;
      const { status, data } = await this.vercelFetch(url, {
        method: 'POST',
      });

      if (status !== 200) {
        const { errorCode, errorMessage } = this.normalizeVercelError(status, data, 'Alan adı doğrulaması başarısız oldu');
        return {
          success: false,
          hostname,
          errorCode,
          errorMessage,
        };
      }

      const isVerified = Boolean(data.verified);
      return {
        success: true,
        hostname,
        status: isVerified ? 'active' : 'pending',
        sslStatus: isVerified ? 'active' : 'pending',
        verified: isVerified,
        errorCode: isVerified ? undefined : 'VERIFICATION_PENDING',
        errorMessage: isVerified ? undefined : 'DNS yayılımı devam ediyor veya DNS kayıtları henüz tespit edilemedi.',
      };
    } catch (err: any) {
      return {
        success: false,
        hostname,
        errorCode: 'PROVIDER_UNAVAILABLE',
        errorMessage: 'Doğrulama servisiyle bağlantı kurulamadı.',
      };
    }
  }

  /**
   * Retrieves domain configuration and status from Vercel project
   * Endpoint: GET https://api.vercel.com/v9/projects/{projectId}/domains/{domain}
   */
  async getDomainStatus(hostname: string): Promise<DomainOperationResult> {
    try {
      const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(this.projectId)}/domains/${encodeURIComponent(hostname)}${this.getTeamQuery()}`;
      const { status, data } = await this.vercelFetch(url, {
        method: 'GET',
      });

      if (status !== 200) {
        const { errorCode, errorMessage } = this.normalizeVercelError(status, data, 'Alan adı durumu alınamadı');
        return {
          success: false,
          hostname,
          errorCode,
          errorMessage,
        };
      }

      const isVerified = Boolean(data.verified);
      return {
        success: true,
        hostname,
        status: isVerified ? 'active' : 'pending',
        sslStatus: isVerified ? 'active' : 'pending',
        verified: isVerified,
      };
    } catch (err: any) {
      return {
        success: false,
        hostname,
        errorCode: 'PROVIDER_UNAVAILABLE',
        errorMessage: 'Sağlayıcı durumu sorgulanamadı.',
      };
    }
  }

  /**
   * Removes custom domain from Vercel project
   * Endpoint: DELETE https://api.vercel.com/v9/projects/{projectId}/domains/{domain}
   */
  async removeDomain(hostname: string): Promise<DomainOperationResult> {
    try {
      const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(this.projectId)}/domains/${encodeURIComponent(hostname)}${this.getTeamQuery()}`;
      const { status, data } = await this.vercelFetch(url, {
        method: 'DELETE',
      });

      // 200 or 404 (already deleted) are both treated as successful idempotent removals
      if (status === 200 || status === 404) {
        return {
          success: true,
          hostname,
          status: 'removing',
        };
      }

      const { errorCode, errorMessage } = this.normalizeVercelError(status, data, 'Alan adı sağlayıcıdan silinemedi');
      return {
        success: false,
        hostname,
        errorCode,
        errorMessage,
      };
    } catch (err: any) {
      return {
        success: false,
        hostname,
        errorCode: 'PROVIDER_UNAVAILABLE',
        errorMessage: 'Silme işlemi sırasında sağlayıcıya ulaşılamadı.',
      };
    }
  }
}

/**
 * In-Memory Deterministic FakeDomainProvider for Testing and Offline Development
 * Full state machine: not_added -> pending_verification -> verified/configured -> removed
 * Supports error injection for failure scenario coverage.
 */
export class FakeDomainProvider implements DomainProvider {
  private static registeredDomains = new Map<
    string,
    {
      domainId: string;
      token: string;
      verified: boolean;
      status: 'pending' | 'verifying' | 'active' | 'error' | 'removing';
      sslStatus: 'pending' | 'active' | 'error';
    }
  >();

  private static injectedErrors = new Map<string, ProviderErrorCode>();
  private static globalError: ProviderErrorCode | null = null;

  /**
   * Injects an error for a specific hostname or globally for testing
   */
  static injectError(hostnameOrGlobal: string | null, error: ProviderErrorCode | null) {
    if (hostnameOrGlobal === null) {
      this.globalError = error;
    } else if (error === null) {
      this.injectedErrors.delete(hostnameOrGlobal);
    } else {
      this.injectedErrors.set(hostnameOrGlobal, error);
    }
  }

  /**
   * Resets all in-memory domain state and injected errors
   */
  static reset() {
    this.registeredDomains.clear();
    this.injectedErrors.clear();
    this.globalError = null;
  }

  private checkInjectedError(hostname: string): DomainOperationResult | null {
    const err = FakeDomainProvider.globalError || FakeDomainProvider.injectedErrors.get(hostname);
    if (!err) return null;

    const messages: Record<ProviderErrorCode, string> = {
      DOMAIN_ALREADY_EXISTS: 'Bu alan adı başka bir projede kayıtlıdır.',
      DOMAIN_NOT_FOUND: 'Alan adı bulunamadı.',
      VERIFICATION_PENDING: 'DNS doğrulaması henüz tamamlanmadı.',
      PROVIDER_UNAUTHORIZED: 'Vercel API token geçersiz veya yetkisiz.',
      PROVIDER_RATE_LIMITED: 'İstek sınırı aşıldı (Rate limit).',
      PROVIDER_UNAVAILABLE: 'Vercel API servisi geçici olarak devre dışı.',
      INVALID_DOMAIN: 'Geçersiz alan adı formatı.',
      UNKNOWN_PROVIDER_ERROR: 'Bilinmeyen sağlayıcı hatası.',
    };

    return {
      success: false,
      hostname,
      errorCode: err,
      errorMessage: messages[err] || 'Sağlayıcı hatası',
    };
  }

  async addDomain(hostname: string): Promise<DomainOperationResult> {
    const errorResult = this.checkInjectedError(hostname);
    if (errorResult) return errorResult;

    const norm = hostname.trim().toLowerCase();

    if (FakeDomainProvider.registeredDomains.has(norm)) {
      return {
        success: false,
        hostname: norm,
        errorCode: 'DOMAIN_ALREADY_EXISTS',
        errorMessage: 'Bu alan adı sistemde zaten kayıtlıdır.',
      };
    }

    const token = `vc-verify-${crypto.createHash('sha256').update(norm).digest('hex').slice(0, 16)}`;
    FakeDomainProvider.registeredDomains.set(norm, {
      domainId: `fake-${norm}`,
      token,
      verified: false,
      status: 'pending',
      sslStatus: 'pending',
    });

    return {
      success: true,
      domainId: `fake-${norm}`,
      hostname: norm,
      status: 'pending',
      sslStatus: 'pending',
      verified: false,
      verificationRequirements: [
        {
          type: 'TXT',
          domain: `_vercel.${norm}`,
          value: token,
          reason: 'domain-verification',
        },
        {
          type: 'CNAME',
          domain: norm,
          value: 'cname.vercel-dns.com',
        },
      ],
    };
  }

  async verifyDomain(hostname: string): Promise<DomainOperationResult> {
    const errorResult = this.checkInjectedError(hostname);
    if (errorResult) return errorResult;

    const norm = hostname.trim().toLowerCase();
    const record = FakeDomainProvider.registeredDomains.get(norm);

    if (!record) {
      return {
        success: false,
        hostname: norm,
        errorCode: 'DOMAIN_NOT_FOUND',
        errorMessage: 'Alan adı bulunamadı.',
      };
    }

    // Default verify rule for test domains (or can be controlled via tests)
    const isTestVerifiable = !norm.includes('unverified') && !norm.includes('pending-dns');
    if (isTestVerifiable) {
      record.verified = true;
      record.status = 'active';
      record.sslStatus = 'active';

      return {
        success: true,
        hostname: norm,
        status: 'active',
        sslStatus: 'active',
        verified: true,
      };
    }

    return {
      success: true,
      hostname: norm,
      status: 'pending',
      sslStatus: 'pending',
      verified: false,
      errorCode: 'VERIFICATION_PENDING',
      errorMessage: 'DNS kayıtları henüz tespit edilemedi.',
    };
  }

  async getDomainStatus(hostname: string): Promise<DomainOperationResult> {
    const errorResult = this.checkInjectedError(hostname);
    if (errorResult) return errorResult;

    const norm = hostname.trim().toLowerCase();
    const record = FakeDomainProvider.registeredDomains.get(norm);

    if (!record) {
      return {
        success: false,
        hostname: norm,
        errorCode: 'DOMAIN_NOT_FOUND',
        errorMessage: 'Alan adı bulunamadı.',
      };
    }

    return {
      success: true,
      hostname: norm,
      status: record.status,
      sslStatus: record.sslStatus,
      verified: record.verified,
    };
  }

  async removeDomain(hostname: string): Promise<DomainOperationResult> {
    const errorResult = this.checkInjectedError(hostname);
    if (errorResult) return errorResult;

    const norm = hostname.trim().toLowerCase();
    // Idempotent deletion: succeeds even if domain is not found
    FakeDomainProvider.registeredDomains.delete(norm);

    return {
      success: true,
      hostname: norm,
      status: 'removing',
    };
  }
}

/**
 * Domain Provider Factory
 * In production: strictly enforces valid VERCEL_PROJECT_ID and VERCEL_API_TOKEN credentials (no silent fallback).
 * In test / development: returns FakeDomainProvider unless explicitly configured.
 */
export function getDomainProvider(): DomainProvider {
  const isProduction = process.env.NODE_ENV === 'production';
  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_AUTH_TOKEN || process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const providerOverride = process.env.DOMAIN_PROVIDER;

  if (isProduction) {
    if (!projectId || !token) {
      throw new Error(
        'CRITICAL CONFIGURATION ERROR: VERCEL_PROJECT_ID and VERCEL_API_TOKEN are strictly required in production environment. Fake provider fallback is forbidden.'
      );
    }
    return new VercelDomainProvider(projectId, token, teamId);
  }

  // Explicit Vercel provider opt-in for staging / test
  if (providerOverride === 'vercel' && projectId && token) {
    return new VercelDomainProvider(projectId, token, teamId);
  }

  // Default to FakeDomainProvider in test / development
  return new FakeDomainProvider();
}
