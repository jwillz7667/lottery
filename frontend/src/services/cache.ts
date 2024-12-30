interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxEntries?: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxEntries = 100;

  set<T>(key: string, data: T, config?: CacheConfig): void {
    this.ensureCapacity();

    const timestamp = Date.now();
    const ttl = config?.ttl ?? this.defaultTTL;
    const expiresAt = timestamp + ttl;

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config?: CacheConfig
  ): Promise<T> {
    const cachedData = this.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    const data = await fetchFn();
    this.set(key, data, config);
    return data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private ensureCapacity(): void {
    if (this.cache.size >= this.maxEntries) {
      // Remove oldest entries
      const entriesToRemove = this.cache.size - this.maxEntries + 1;
      const entries = Array.from(this.cache.entries());
      entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, entriesToRemove)
        .forEach(([key]) => this.cache.delete(key));
    }
  }
}

// Create cache instances for different types of data
export const userCache = new CacheService();
export const transactionCache = new CacheService();
export const promptCache = new CacheService();
export const lotteryCache = new CacheService();

// Example usage:
// const userData = await userCache.getOrFetch(
//   `user-${userId}`,
//   () => api.getUser(userId),
//   { ttl: 10 * 60 * 1000 } // 10 minutes
// ); 