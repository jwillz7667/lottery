import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { lottery } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import { Navigation } from '../common/Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { data: potData } = useQuery(['currentPot'], lottery.getCurrentPot);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Stats Section */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Current Pot */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Current Pot
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {potData ? `${potData.current_pot} ETH` : 'Loading...'}
                </dd>
              </div>
            </div>

            {/* Available Credits */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Available Credits
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {user?.prompt_credits || 0}
                </dd>
              </div>
            </div>

            {/* Ethereum Address */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Connected Wallet
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-900 break-all">
                  {user?.eth_address || 'No wallet connected'}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}; 