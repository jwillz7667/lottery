import { Outlet } from 'react-router-dom';
import { Navigation } from '../common/Navigation';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}; 