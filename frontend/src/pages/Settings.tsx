import React, { useState } from 'react';
import Layout from '../components/Layout';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSaveNotifications = () => {
        // TODO: Implement notification settings update
        console.log('Updating notification settings:', notifications);
    };

    const handleSaveTheme = () => {
        // TODO: Implement theme update
        console.log('Updating theme:', theme);
    };

    const handleUpdateEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement email update
        console.log('Updating email:', email);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password update
        console.log('Updating password');
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={(e) => setNotifications(e.target.checked)}
                                        className="form-checkbox"
                                    />
                                    <span>Enable Notifications</span>
                                </label>
                                <button 
                                    className="btn-secondary mt-2"
                                    onClick={handleSaveNotifications}
                                >
                                    Save
                                </button>
                            </div>
                            <div>
                                <label className="block mb-2">Theme</label>
                                <select
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="bg-transparent border border-gray-600 rounded-lg p-2 w-full"
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                                <button 
                                    className="btn-secondary mt-2"
                                    onClick={handleSaveTheme}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Account</h2>
                        <div className="space-y-6">
                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="New email address"
                                        className="bg-transparent border border-gray-600 rounded-lg p-2 w-full"
                                    />
                                </div>
                                <button type="submit" className="btn-secondary">
                                    Update Email
                                </button>
                            </form>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                    <label className="block mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-transparent border border-gray-600 rounded-lg p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="bg-transparent border border-gray-600 rounded-lg p-2 w-full"
                                    />
                                </div>
                                <button type="submit" className="btn-secondary">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings; 