/**
 * C13 W5 Shared Host Resolution Store
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

export interface HostResolutionStore {
  resolve(hostname: string): Promise<HostMapping | null>;
  publish(mapping: HostMapping): Promise<boolean>;
  remove(hostname: string): Promise<boolean>;
}

/**
 * Production implementation using Vercel Edge Config or REST API.
 * High-speed, globally replicated key-value store with sub-10ms read latency.
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
   * Data-plane: Resolves hostname from Edge Config with ultra-low latency.
   */
  async resolve(hostname: string): Promise<HostMapping | null> {
    const { hostname: normalized } = normalizeHostname(hostname);
    if (!normalized || !this.edgeConfigUrl) {
      return null;
    }

    try {
      // If @vercel/edge-config is available or using Edge Config REST endpoint
      const key = `domain_${normalized.replace(/\./g, '_')}`;
      
      // Parse Edge Config connection string URL
      const url = new URL(this.edgeConfigUrl);
      const endpoint = `https://edge-config.vercel.com/${url.pathname.replace(/^\//, '')}/item/${key}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${this.edgeConfigUrl.split('?token=')[1] || this.apiToken || ''}`,
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        return null;
      }

      const data = await res.json();
      if (!data || data.status !== 'active') return null;

      return {
        weddingId: data.weddingId,
        weddingSlug: data.weddingSlug,
        hostname: data.hostname || normalized,
        status: 'active',
        publishedAt: data.publishedAt || new Date().toISOString(),
      };
    } catch (err) {
      // Fail closed safely on connection errors
      return null;
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
    } catch (err) {
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
    } catch (err) {
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
      throw new Error('[FakeHostResolutionStore] Store unavailable (injected 503)');
    }
    if (error === 'TIMEOUT') {
      throw new Error('[FakeHostResolutionStore] Store request timed out (injected timeout)');
    }

    const mapping = FakeHostResolutionStore.mappings.get(normalized);
    if (!mapping || mapping.status !== 'active') {
      return null;
    }

    return { ...mapping };
  }

  async publish(mapping: HostMapping): Promise<boolean> {
    const { hostname: normalized } = normalizeHostname(mapping.hostname);
    if (!normalized) return false;

    if (mapping.status !== 'active') {
      // Inactive or pending domains must never be published to data-plane routing store
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

/**
 * Factory function to retrieve the appropriate HostResolutionStore.
 */
export function getHostResolutionStore(): HostResolutionStore {
  if (process.env.NODE_ENV === 'production') {
    if (!edgeStoreInstance) {
      edgeStoreInstance = new EdgeConfigHostResolutionStore();
    }
    return edgeStoreInstance;
  }

  // In test / dev environments
  if (!fakeStoreInstance) {
    fakeStoreInstance = new FakeHostResolutionStore();
  }
  return fakeStoreInstance;
}

/**
 * Control plane helper: Publishes verified active domain mapping.
 */
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

/**
 * Control plane helper: Removes domain mapping upon deletion.
 */
export async function removeDomainMapping(hostname: string): Promise<boolean> {
  const store = getHostResolutionStore();
  return store.remove(hostname);
}
