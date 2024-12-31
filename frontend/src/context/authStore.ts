import { create } from 'zustand';
import { api } from '../services/api';

interface User {
    id: string;
    email: string;
    credits: number;
    ethAddress?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.login(email, password);
            localStorage.setItem('token', response.token);
            set({ user: response.user, token: response.token, isLoading: false });
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            set({ error: message, isLoading: false });
            return false;
        }
    },
    register: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.register(email, password);
            localStorage.setItem('token', response.token);
            set({ user: response.user, token: response.token, isLoading: false });
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            set({ error: message, isLoading: false });
            return false;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
    setUser: (user: User) => set({ user }),
    clearError: () => set({ error: null })
})); 