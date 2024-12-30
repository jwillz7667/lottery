import { notify } from '../utils/notifications';
import { monitoring } from './monitoring';
import { logger } from './logger';

interface ErrorContext {
  component: string;
  operation: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

interface RecoveryStrategy {
  maxAttempts: number;
  backoffFactor: number;
  initialDelay: number;
  maxDelay: number;
}

class ErrorRecoveryService {
  private errorHistory: Map<string, number> = new Map();
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();

  constructor() {
    // Default recovery strategies
    this.setRecoveryStrategy('api', {
      maxAttempts: 3,
      backoffFactor: 2,
      initialDelay: 1000,
      maxDelay: 10000,
    });

    this.setRecoveryStrategy('websocket', {
      maxAttempts: 5,
      backoffFactor: 1.5,
      initialDelay: 2000,
      maxDelay: 30000,
    });

    this.setRecoveryStrategy('transaction', {
      maxAttempts: 4,
      backoffFactor: 2,
      initialDelay: 3000,
      maxDelay: 20000,
    });
  }

  async handleError(error: Error, context: ErrorContext): Promise<boolean> {
    const errorKey = `${context.component}:${context.operation}`;
    const attempts = this.errorHistory.get(errorKey) || 0;
    
    // Log the error
    logger.error('Operation failed', {
      error: error.message,
      stack: error.stack,
      context,
      attempts,
    });

    // Get recovery strategy
    const strategy = this.getRecoveryStrategy(context.component);
    if (!strategy || attempts >= strategy.maxAttempts) {
      this.handleUnrecoverableError(error, context);
      return false;
    }

    // Increment attempt counter
    this.errorHistory.set(errorKey, attempts + 1);

    // Calculate delay for next attempt
    const delay = Math.min(
      strategy.initialDelay * Math.pow(strategy.backoffFactor, attempts),
      strategy.maxDelay
    );

    // Notify user
    notify.warning('Attempting to recover from error...');

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));

    return true;
  }

  private handleUnrecoverableError(error: Error, context: ErrorContext): void {
    logger.error('Unrecoverable error', {
      error: error.message,
      stack: error.stack,
      context,
    });

    notify.error('An unrecoverable error occurred. Please try again later.');
    monitoring.trackApiCall(context.operation, 0, false);

    // Clear error history for this operation
    const errorKey = `${context.component}:${context.operation}`;
    this.errorHistory.delete(errorKey);
  }

  setRecoveryStrategy(component: string, strategy: RecoveryStrategy): void {
    this.recoveryStrategies.set(component, strategy);
  }

  private getRecoveryStrategy(component: string): RecoveryStrategy | undefined {
    return this.recoveryStrategies.get(component);
  }

  async recoverableOperation<T>(
    operation: () => Promise<T>,
    context: ErrorContext
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error) {
        const canRetry = await this.handleError(error, context);
        if (canRetry) {
          return this.recoverableOperation(operation, context);
        }
      }
      throw error;
    }
  }

  clearErrorHistory(): void {
    this.errorHistory.clear();
  }

  getErrorCount(component: string, operation: string): number {
    const errorKey = `${component}:${operation}`;
    return this.errorHistory.get(errorKey) || 0;
  }

  isOperationFailing(component: string, operation: string): boolean {
    const errorKey = `${component}:${operation}`;
    const attempts = this.errorHistory.get(errorKey) || 0;
    const strategy = this.getRecoveryStrategy(component);
    return strategy ? attempts >= strategy.maxAttempts : false;
  }
}

export const errorRecovery = new ErrorRecoveryService(); 