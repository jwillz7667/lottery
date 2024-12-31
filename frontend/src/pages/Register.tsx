import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FiMail, FiLock, FiLock as FiLockConfirm } from 'react-icons/fi';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.register(email, password);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
            background: 'radial-gradient(circle at top right, var(--accent-secondary) 0%, transparent 20%), ' +
                       'radial-gradient(circle at bottom left, var(--accent-primary) 0%, transparent 20%)'
        }}>
            <div className="glass-panel w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="gradient-text text-4xl font-bold mb-2">Join AI Lottery</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                className="glass-input pl-10"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="glass-input pl-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <FiLockConfirm className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="glass-input pl-10"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="send-button w-full flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 