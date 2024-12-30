import { useState, useCallback } from 'react';
import { notify } from '../utils/notifications';

interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRetry<T>(
  operation: () => Promise<T>,
  {
    maxAttempts = 3,
    delayMs = 1000,
    onSuccess,
    onError
  }: RetryConfig = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAttempt(0);

    const attemptOperation = async (currentAttempt: number): Promise<T> => {
      try {
        const result = await operation();
        setIsLoading(false);
        setError(null);
        onSuccess?.();
        return result;
      } catch (error) {
        if (!(error instanceof Error)) {
          throw new Error('Unknown error occurred');
        }

        if (currentAttempt < maxAttempts - 1) {
          setAttempt(currentAttempt + 1);
          notify.error(`Attempt ${currentAttempt + 1} failed. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return attemptOperation(currentAttempt + 1);
        }
        
        setError(error);
        setIsLoading(false);
        onError?.(error);
        throw error;
      }
    };

    return attemptOperation(0);
  }, [operation, maxAttempts, delayMs, onSuccess, onError]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAttempt(0);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
    attempt,
    hasMoreAttempts: attempt < maxAttempts
  };
} 