import { useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { ws } from '../services/websocket';
import { notify } from '../utils/notifications';

interface TransactionStatus {
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

interface TransactionUpdate {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export function useTransactionMonitor() {
  useEffect(() => {
    const unsubscribe = ws.onTransactionUpdate((update: TransactionUpdate) => {
      if (update.status === 'confirmed') {
        notify.success('Transaction confirmed');
      } else if (update.status === 'failed') {
        notify.error('Transaction failed');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const monitorTransaction = useCallback(async (txHash: string): Promise<TransactionStatus> => {
    try {
      const result = await api.getTransactionStatus(txHash);
      return {
        status: result.status,
        timestamp: result.timestamp,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to monitor transaction';
      notify.error(message);
      throw error;
    }
  }, []);

  return monitorTransaction;
} 