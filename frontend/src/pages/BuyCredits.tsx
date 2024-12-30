import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { CreditPurchase } from '../components/Payment/CreditPurchase';
import { payments } from '../services/api';

export const BuyCredits: React.FC = () => {
  const { data: transactions } = useQuery(['transactions'], payments.getTransactions);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CreditPurchase />

        {/* Recent Transactions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {transactions?.slice(0, 5).map((tx) => (
                <div key={tx.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600">
                        {tx.transaction_type === 'credit_purchase'
                          ? 'Credit Purchase'
                          : 'Payout'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">
                        {tx.amount_eth} ETH
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tx.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-mono truncate">
                    {tx.tx_hash}
                  </p>
                </div>
              ))}
              {!transactions?.length && (
                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}; 