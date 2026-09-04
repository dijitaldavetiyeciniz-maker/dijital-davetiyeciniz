/**
 * C13 W5 & W10.3 Shared Host Resolution Store
 * Low-latency tenant mapping store for data-plane edge / proxy host routing.
 * Control plane publishes active domain mappings here; data plane resolves them at request time.
 */

import { normalizeHostname } from './domain-utils';

export interface HostMapping {
  weddingId: string;
  weddingSlug: string;
  hostname: string;
  status: 'active';
  publishedAt: string;
}

export class HostStoreUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HostStoreUnavailableError';
  }
}

export interface HostResolutionStore {
  resolve(hostname: string): Promise<HostMapping | null>;
  publish(mapping: HostMapping): Promise<boolean>;
  remove(hostname: string): Promise<boolean>;
}

/**
 * Production implementation using Vercel Edge Config or REST API.
 * High-speed, globally replicated key-value store.
 */
export class EdgeConfigHostResolutionStore implements HostResolutionStore {
  private edgeConfigUrl: string | null;
  private edgeConfigId: string | null;
  private apiToken: string | null;

  constructor(edgeConfigUrl?: string, edgeConfigId?: string, apiToken?: string) {
    this.edgeConfigUrl = edgeConfigUrl || process.env.EDGE_CONFIG || null;
    this.edgeConfigId = edgeConfigId || process.env.EDGE_CONFIG_ID || null;
    this.apiToken = apiToken || process.env.VERCEL_API_TOKEN || null;

    if (process.env.NODE_ENV === 'production' && !this.edgeConfigUrl) {
      console.warn('[EdgeConfigStore] WARNING: EDGE_CONFIG is not configured in production environment. Custom host resolution will fail closed.');
    }
  }

  /**
   * Data-plane: Resolves hostname from Edge Config.
   * Eliminates stale 1-hour cache and distinguishes 404 from 500/503.
   */
  async resolve(hostname: string): Promise<HostMapping | null> {
    const { hostname: normalized } = normalizeHostname(hostname);
    if (!normalized) return null;
    if (!this.edgeConfigUrl) {
      throw new HostStoreUnavailableError('Edge Config URL is not configured');
    }

    try {
      const key = `domain_${normalized.replace(/\./g, '_')}`;
      const url = new URL(this.edgeConfigUrl);
      const endpoint = `https://edge-config.vercel.com/${url.pathname.replace(/^\//, '')}/item/${key}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${this.edgeConfigUrl.split('?token=')[1] || this.apiToken || ''}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new HostStoreUnavailableError(`Edge Config returned HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      if (!data || typeof data !== 'object') {
        return null;
      }

      if (data.status !== 'active' || !data.weddingId) {
        return null;
      }

      const mappingHostname = data.hostname || normalized;
      // Cross-host mapping protection: resolved hostname must match normalized host
      if (mappingHostname.toLowerCase() !== normalized.toLowerCase()) {
        console.error(`[EdgeConfigStore] Mismatched hostname: expected ${normalized}, got ${mappingHostname}`);
        return null;
      }

      return {
        weddingId: String(data.weddingId),
        weddingSlug: String(data.weddingSlug || data.weddingId),
        hostname: mappingHostname,
        status: 'active',
        publishedAt: data.publishedAt || new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof HostStoreUnavailableError) throw err;
      throw new HostStoreUnavailableError(`Edge Config connection failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }

  /**
   * Control-plane: Publishes verified active domain mapping to Edge Config.
   */
  async publish(mapping: HostMapping): Promise<boolean> {
    const { hostname: normalized } = normalizeHostname(mapping.hostname);
    if (!normalized || !this.edgeConfigId || !this.apiToken) {
      return false;
    }

    try {
      const key = `domain_${normalized.replace(/\./g, '_')}`;
      const res = await fetch(`https://api.vercel.com/v1/edge-config/${this.edgeConfigId}/items`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key,
              value: {
                weddingId: mapping.weddingId,
                weddingSlug: mapping.weddingSlug,
                hostname: normalized,
                status: 'active',
                publishedAt: mapping.publishedAt || new Date().toISOString(),
              },
            },
          ],
        }),
      });

      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Control-plane: Removes domain mapping from Edge Config.
   */
  async remove(hostname: string): Promise<boolean> {
    const { hostname: normalized } = normalizeHostname(hostname);
    if (!normalized || !this.edgeConfigId || !this.apiToken) {
      return false;
    }

    try {
      const key = `domain_${normalized.replace(/\./g, '_')}`;
      const res = await fetch(`https://api.vercel.com/v1/edge-config/${this.edgeConfigId}/items`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'delete',
              key,
            },
          ],
        }),
      });

      return res.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Deterministic In-Memory Adapter for local development, CI, and test execution.
 */
export class FakeHostResolutionStore implements HostResolutionStore {
  private static mappings = new Map<string, HostMapping>();
  private static errorInjections = new Map<string, 'STORE_UNAVAILABLE' | 'TIMEOUT'>();

  static reset(): void {
    FakeHostResolutionStore.mappings.clear();
    FakeHostResolutionStore.errorInjections.clear();
  }

  static injectError(hostname: string, type: 'STORE_UNAVAILABLE' | 'TIMEOUT'): void {
    const { hostname: normalized } = normalizeHostname(hostname);
    FakeHostResolutionStore.errorInjections.set(normalized, type);
  }

  async resolve(hostname: string): Promise<HostMapping | null> {
    const { hostname: normalized } = normalizeHostname(hostname);
    if (!normalized) return null;

    const error = FakeHostResolutionStore.errorInjections.get(normalized);
    if (error === 'STORE_UNAVAILABLE') {
      throw new HostStoreUnavailableError('[FakeHostResolutionStore] Store unavailable (injected 503)');
    }
    if (error === 'TIMEOUT') {
      throw new HostStoreUnavailableError('[FakeHostResolutionStore] Store request timed out (injected timeout)');
    }

    const mapping = FakeHostResolutionStore.mappings.get(normalized);
    if (!mapping || mapping.status !== 'active') {
      return null;
    }

    // Cross-host verification
    if (mapping.hostname.toLowerCase() !== normalized.toLowerCase()) {
      return null;
    }

    return { ...mapping };
  }

  async publish(mapping: HostMapping): Promise<boolean> {
    const { hostname: normalized } = normalizeHostname(mapping.hostname);
    if (!normalized) return false;

    if (mapping.status !== 'active') {
      return false;
    }

    FakeHostResolutionStore.mappings.set(normalized, {
      ...mapping,
      hostname: normalized,
    });
    return true;
  }

  async remove(hostname: string): Promise<boolean> {
    const { hostname: normalized } = normalizeHostname(hostname);
    if (!normalized) return false;

    FakeHostResolutionStore.mappings.delete(normalized);
    return true;
  }
}

// Singleton instances
let fakeStoreInstance: FakeHostResolutionStore | null = null;
let edgeStoreInstance: EdgeConfigHostResolutionStore | null = null;

export function getHostResolutionStore(): HostResolutionStore {
  if (process.env.NODE_ENV === 'production') {
    if (!edgeStoreInstance) {
      edgeStoreInstance = new EdgeConfigHostResolutionStore();
    }
    return edgeStoreInstance;
  }

  if (!fakeStoreInstance) {
    fakeStoreInstance = new FakeHostResolutionStore();
  }
  return fakeStoreInstance;
}

export async function publishActiveDomainMapping(
  weddingId: string,
  weddingSlug: string,
  hostname: string
): Promise<boolean> {
  const store = getHostResolutionStore();
  return store.publish({
    weddingId,
    weddingSlug,
    hostname,
    status: 'active',
    publishedAt: new Date().toISOString(),
  });
}

export async function removeDomainMapping(hostname: string): Promise<boolean> {
  const store = getHostResolutionStore();
  return store.remove(hostname);
}
