import { Outlet } from 'react-router-dom';
import { Navigation } from '../common/Navigation';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="py-10">
                <Outlet />
            </main>
        </div>
    );
}; 