import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

export const api = {
    // Auth
    login: async (email: string, password: string) => {
        try {
            const response = await instance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    register: async (email: string, password: string) => {
        try {
            const response = await instance.post('/auth/register', { email, password });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // User
    getUserStats: async () => {
        try {
            const response = await instance.get('/user/stats');
            return response.data;
        } catch (error) {
            console.error('Get user stats error:', error);
            throw error;
        }
    },

    // Chat
    getChatHistory: async () => {
        try {
            const response = await instance.get('/chat/history');
            return response.data;
        } catch (error) {
            console.error('Get chat history error:', error);
            throw error;
        }
    },
    submitPrompt: async (prompt: string) => {
        try {
            const response = await instance.post('/chat/prompt', { prompt });
            return response.data;
        } catch (error) {
            console.error('Submit prompt error:', error);
            throw error;
        }
    },

    // Lottery
    getCurrentPot: async () => {
        try {
            const response = await instance.get('/lottery/current');
            return response.data;
        } catch (error) {
            console.error('Get current pot error:', error);
            throw error;
        }
    },

    // Payments
    purchaseCredits: async (amount: number) => {
        try {
            const response = await instance.post('/payments/purchase', { amount });
            return response.data;
        } catch (error) {
            console.error('Purchase credits error:', error);
            throw error;
        }
    }
}; 