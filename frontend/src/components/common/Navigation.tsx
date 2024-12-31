import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

export const Navigation = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">AI Lottery</span>
                        </Link>
                        {user && (
                            <div className="ml-10 flex items-center space-x-4">
                                <Link 
                                    to="/dashboard" 
                                    className={`${
                                        isActive('/dashboard') 
                                            ? 'text-indigo-600' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/chat" 
                                    className={`${
                                        isActive('/chat') 
                                            ? 'text-indigo-600' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Chat
                                </Link>
                                <Link 
                                    to="/buy-credits" 
                                    className={`${
                                        isActive('/buy-credits') 
                                            ? 'text-indigo-600' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Buy Credits
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    {user.credits} Credits
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link 
                                    to="/login" 
                                    className={`${
                                        isActive('/login') 
                                            ? 'text-indigo-600' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`${
                                        isActive('/register') 
                                            ? 'text-indigo-600' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}; 