import { create } from 'zustand';
import { api } from '../services/api';
import { notify } from '../utils/notifications';

interface User {
  id: number;
  email: string;
  ethAddress: string | null;
  promptCredits: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, ethAddress: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      localStorage.setItem('token', response.token);
      api.setToken(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        token: response.token,
      });
      notify.success('Successfully logged in');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      notify.error(errorMessage);
      throw error;
    }
  },

  register: async (email: string, password: string, ethAddress: string) => {
    try {
      const response = await api.register(email, password, ethAddress);
      localStorage.setItem('token', response.token);
      api.setToken(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        token: response.token,
      });
      notify.success('Successfully registered');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      notify.error(errorMessage);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    api.clearToken();
    set({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    notify.info('Logged out successfully');
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      api.setToken(token);
      const response = await api.verifyToken();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('token');
      api.clearToken();
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,
      });
    }
  },
})); 