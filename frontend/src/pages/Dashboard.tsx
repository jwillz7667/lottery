import React from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
                        <p className="text-2xl font-bold">0.00 ETH</p>
                    </div>
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Active Lotteries</h2>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
                        <p className="text-2xl font-bold">Coming Soon</p>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">No recent activity</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard; 