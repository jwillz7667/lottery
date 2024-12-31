import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../context/authStore';
import { api } from '../services/api';

const CREDIT_PACKAGES = [
    { credits: 10, price: 0.01 },
    { credits: 50, price: 0.04 },
    { credits: 100, price: 0.07 }
];

export const BuyCredits = () => {
    const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[0]);
    const user = useAuthStore((state) => state.user);

    const mutation = useMutation({
        mutationFn: () => api.purchaseCredits(selectedPackage.credits),
        onSuccess: () => {
            alert('Credits purchased successfully!');
        }
    });

    const handlePurchase = () => {
        mutation.mutate();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Buy Credits
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Current Credits: {user?.credits || 0}</p>
                    </div>

                    <div className="mt-5 space-y-4">
                        {CREDIT_PACKAGES.map((pkg) => (
                            <div
                                key={pkg.credits}
                                className={`relative rounded-lg border p-4 cursor-pointer ${
                                    selectedPackage === pkg
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-300'
                                }`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {pkg.credits} Credits
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Best for {pkg.credits} prompts
                                        </p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {pkg.price} ETH
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={mutation.isPending}
                        className="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Processing...' : 'Purchase Credits'}
                    </button>
                </div>
            </div>
        </div>
    );
}; 