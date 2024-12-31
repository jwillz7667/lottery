import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lottery', label: 'Lottery', icon: '🎲' },
    { path: '/chat', label: 'AI Chat', icon: '🤖' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="flex">
                <aside className="w-64 min-h-screen glass-card m-4 p-4 rounded-xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-center">AI Lottery</h1>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-purple-500 bg-opacity-20'
                                        : 'hover:bg-purple-500 hover:bg-opacity-10'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="absolute bottom-8 left-4 right-4">
                        <button
                            onClick={handleLogout}
                            className="w-full p-3 rounded-lg text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors flex items-center gap-3"
                        >
                            <span className="text-xl">🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout; 