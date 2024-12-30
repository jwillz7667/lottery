import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lottery } from '../services/api';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../context/authStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: potData } = useQuery(['currentPot'], lottery.getCurrentPot);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  AI Lottery Challenge
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Try to outsmart our AI and win the pot! Each attempt costs 0.01 ETH.
                  Successfully jailbreak the AI to win 75% of the pot.
                </p>
                
                {/* Current Pot Display */}
                <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
                  <h2 className="text-lg font-semibold text-gray-900">Current Pot</h2>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">
                    {potData ? `${potData.current_pot} ETH` : 'Loading...'}
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-x-6">
                  {user ? (
                    <Button onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => navigate('/register')}>
                        Get Started
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" />
            
            {/* How it Works Section */}
            <div className="shadow-lg rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Connect Your Wallet</h3>
                    <p className="text-gray-600">Link your Ethereum wallet to get started</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Purchase Credits</h3>
                    <p className="text-gray-600">Each prompt attempt costs 0.01 ETH</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Challenge the AI</h3>
                    <p className="text-gray-600">Try to outsmart our Security Llama 3.3 AI</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Win Big</h3>
                    <p className="text-gray-600">Successfully jailbreak the AI to win 75% of the pot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 