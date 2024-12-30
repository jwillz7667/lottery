import React, { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import { ethereum } from '../../services/ethereum';
import { api } from '../../services/api';
import { notify } from '../../utils/notifications';
import { Button } from '../common/Button';
import { useRetry } from '../../hooks/useRetry';
import { useTransactionMonitor } from '../../hooks/useTransactionMonitor';

interface CreditPackage {
  credits: number;
  priceEth: number;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { credits: 10, priceEth: 0.1 },
  { credits: 50, priceEth: 0.45 },
  { credits: 100, priceEth: 0.8 },
];

export const CreditPurchase: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAuthStore(state => state.user);
  const monitorTransaction = useTransactionMonitor();

  const { execute: purchaseCredits } = useRetry(
    async () => {
      if (!selectedPackage || !user) return;

      const txHash = await ethereum.sendTransaction({
        to: import.meta.env.VITE_CONTRACT_ADDRESS,
        value: ethereum.toWei(selectedPackage.priceEth),
      });

      await api.createTransaction(txHash, selectedPackage.priceEth, 'credit_purchase');
      return txHash;
    },
    {
      maxAttempts: 3,
      onError: (error: Error) => {
        notify.error(`Failed to purchase credits: ${error.message}`);
      },
    }
  );

  const handlePurchase = async () => {
    if (!selectedPackage) {
      notify.error('Please select a credit package');
      return;
    }

    setIsProcessing(true);
    try {
      const txHash = await purchaseCredits();
      if (txHash) {
        notify.success('Transaction submitted');
        await monitorTransaction(txHash);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to purchase credits';
      notify.error(message);
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CREDIT_PACKAGES.map(pkg => (
          <button
            key={pkg.credits}
            onClick={() => setSelectedPackage(pkg)}
            className={`p-4 rounded-lg border-2 ${
              selectedPackage === pkg
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="text-lg font-semibold">{pkg.credits} Credits</div>
            <div className="text-sm text-gray-500">{pkg.priceEth} ETH</div>
          </button>
        ))}
      </div>

      <Button
        onClick={handlePurchase}
        loading={isProcessing}
        disabled={!selectedPackage || isProcessing}
        fullWidth
      >
        {isProcessing
          ? 'Processing...'
          : selectedPackage
          ? `Purchase ${selectedPackage.credits} Credits`
          : 'Select a Package'}
      </Button>
    </div>
  );
}; 