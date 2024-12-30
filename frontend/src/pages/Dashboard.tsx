import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../context/authStore';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Dashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => api.getUserStats(),
  });

  const { data: pot } = useQuery({
    queryKey: ['currentPot'],
    queryFn: () => api.getCurrentPot(),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Account</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{user?.email}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Credits</dt>
                <dd className="text-gray-900">{user?.promptCredits}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Wallet</dt>
                <dd className="text-gray-900 truncate">{user?.ethAddress}</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Total Participations</dt>
                <dd className="text-gray-900">{stats?.totalParticipations}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Total Winnings</dt>
                <dd className="text-gray-900">{stats?.totalWinnings} ETH</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Current Pot</h3>
            <div className="mt-2">
              <p className="text-3xl font-bold text-indigo-600">
                {pot?.currentPot} ETH
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {pot?.participantCount} participants
              </p>
            </div>
            <div className="mt-4">
              <Button
                to="/chat"
                fullWidth
                disabled={!user?.promptCredits}
              >
                {user?.promptCredits
                  ? 'Submit Prompt'
                  : 'Purchase Credits to Participate'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 