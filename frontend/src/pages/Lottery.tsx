import React, { useState } from 'react';
import Layout from '../components/Layout';

const Lottery: React.FC = () => {
    const [ticketCount, setTicketCount] = useState(1);
    const ticketPrice = 0.01; // ETH

    const handlePurchase = async () => {
        // TODO: Implement ticket purchase logic
        console.log(`Purchasing ${ticketCount} tickets`);
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Lottery</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Current Round</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Prize Pool</span>
                                <span className="font-bold">10.00 ETH</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Remaining</span>
                                <span className="font-bold">23:59:59</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Your Tickets</span>
                                <span className="font-bold">0</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Buy Tickets</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <button 
                                    className="btn-secondary"
                                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    className="w-20 text-center bg-transparent border border-gray-600 rounded-lg p-2"
                                    value={ticketCount}
                                    onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button 
                                    className="btn-secondary"
                                    onClick={() => setTicketCount(ticketCount + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Cost</span>
                                <span className="font-bold">{(ticketCount * ticketPrice).toFixed(3)} ETH</span>
                            </div>
                            <button 
                                className="btn-primary w-full"
                                onClick={handlePurchase}
                            >
                                Purchase Tickets
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Previous Winners</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">No previous winners</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Lottery; 