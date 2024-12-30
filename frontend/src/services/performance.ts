import { monitoring } from './monitoring';

interface PerformanceConfig {
  prefetchThreshold: number; // Time in ms before data is considered stale
  retryDelay: number; // Time in ms between retries
  maxRetries: number;
  cacheTimeout: number; // Time in ms before cache expires
}

type AnyFunction = (...args: unknown[]) => unknown;

class PerformanceService {
  private config: PerformanceConfig = {
    prefetchThreshold: 30000, // 30 seconds
    retryDelay: 1000, // 1 second
    maxRetries: 3,
    cacheTimeout: 300000, // 5 minutes
  };

  // Resource prefetching
  prefetchResources(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Image optimization
  optimizeImage(url: string, width: number, height: number, quality = 80): string {
    const imageUrl = new URL(url);
    imageUrl.searchParams.set('w', width.toString());
    imageUrl.searchParams.set('h', height.toString());
    imageUrl.searchParams.set('q', quality.toString());
    return imageUrl.toString();
  }

  // Lazy loading implementation
  lazyLoad<T>(loader: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loader()
                .then(resolve)
                .catch(reject)
                .finally(() => observer.disconnect());
            }
          });
        },
        { threshold: 0.1 }
      );

      // Create a dummy element to observe
      const target = document.createElement('div');
      document.body.appendChild(target);
      observer.observe(target);
      
      // Cleanup
      setTimeout(() => {
        observer.disconnect();
        target.remove();
        loader().then(resolve).catch(reject);
      }, 5000); // Fallback timeout
    });
  }

  // Debounce function for performance optimization
  debounce<T extends AnyFunction>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function for performance optimization
  throttle<T extends AnyFunction>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Request batching for multiple API calls
  async batchRequests<T>(
    requests: (() => Promise<T>)[],
    batchSize = 3
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(req => req()));
      results.push(...batchResults);
    }
    return results;
  }

  // Memory management
  clearMemory(): void {
    if ('memory' in performance) {
      const memoryInfo = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
        // Clear caches
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear performance entries
        performance.clearResourceTimings();
        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  }

  // Performance monitoring
  measurePerformance(operation: string, callback: () => void): void {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;
    monitoring.trackApiCall(operation, duration, true);
  }

  // Update configuration
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const performance = new PerformanceService(); 