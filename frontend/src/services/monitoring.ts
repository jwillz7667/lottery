import axios from 'axios';
import { notify } from '../utils/notifications';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    api: boolean;
    database: boolean;
    websocket: boolean;
    blockchain: boolean;
  };
  latency: number;
}

interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  successRate: number;
  requestCount: number;
}

class MonitoringService {
  private metricsBuffer: PerformanceMetrics[] = [];
  private healthCheckInterval: number | null = null;
  private readonly METRICS_BUFFER_SIZE = 100;

  constructor() {
    this.initializeHealthCheck();
  }

  private initializeHealthCheck(): void {
    if (import.meta.env.PROD) {
      this.healthCheckInterval = window.setInterval(
        () => void this.checkHealth(),
        30000 // Check every 30 seconds
      );
    }
  }

  async checkHealth(): Promise<HealthStatus> {
    try {
      const start = performance.now();
      const response = await axios.get<HealthStatus>(
        `${import.meta.env.VITE_API_URL}/api/v1/health`
      );
      const latency = performance.now() - start;

      const status: HealthStatus = {
        ...response.data,
        latency,
      };

      if (status.status !== 'healthy') {
        this.handleDegradedService(status);
      }

      return status;
    } catch {
      const status: HealthStatus = {
        status: 'down',
        services: {
          api: false,
          database: false,
          websocket: false,
          blockchain: false,
        },
        latency: 0,
      };

      this.handleServiceDown();
      return status;
    }
  }

  trackApiCall(endpoint: string, duration: number, success: boolean): void {
    const metrics: PerformanceMetrics = {
      responseTime: duration,
      errorRate: success ? 0 : 1,
      successRate: success ? 1 : 0,
      requestCount: 1,
    };

    this.metricsBuffer.push(metrics);
    if (this.metricsBuffer.length > this.METRICS_BUFFER_SIZE) {
      this.metricsBuffer.shift();
    }

    this.analyzePerformance();
  }

  private analyzePerformance(): void {
    const recentMetrics = this.metricsBuffer.slice(-10);
    if (recentMetrics.length < 10) return;

    const avgResponseTime =
      recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) /
      recentMetrics.length;
    const errorRate =
      recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) /
      recentMetrics.length;

    if (avgResponseTime > 1000) {
      // Response time > 1s
      notify.warning('API response times are slower than usual');
    }

    if (errorRate > 0.2) {
      // Error rate > 20%
      notify.error('Experiencing higher than normal error rates');
    }
  }

  private handleDegradedService(status: HealthStatus): void {
    const degradedServices = Object.entries(status.services)
      .filter(([, isHealthy]) => !isHealthy)
      .map(([service]) => service)
      .join(', ');

    notify.warning(
      `Some services are experiencing issues: ${degradedServices}`
    );
  }

  private handleServiceDown(): void {
    notify.error(
      'Unable to connect to the service. Please try again later.'
    );
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const metrics = this.metricsBuffer;
    const totalCalls = metrics.reduce((sum, m) => sum + m.requestCount, 0);

    return {
      responseTime:
        metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length,
      errorRate:
        metrics.reduce((sum, m) => sum + m.errorRate, 0) / totalCalls,
      successRate:
        metrics.reduce((sum, m) => sum + m.successRate, 0) / totalCalls,
      requestCount: totalCalls,
    };
  }

  cleanup(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

export const monitoring = new MonitoringService(); 