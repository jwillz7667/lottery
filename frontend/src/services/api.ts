import axios, { AxiosInstance } from 'axios';
import { notify } from '../utils/notifications';

// Types
interface User {
  id: number;
  email: string;
  ethAddress: string;
  promptCredits: number;
  createdAt: string;
}

interface Transaction {
  id: number;
  userId: number;
  txHash: string;
  amountEth: number;
  status: 'pending' | 'confirmed' | 'failed';
  transactionType: 'credit_purchase' | 'payout';
  createdAt: string;
}

interface Prompt {
  id: number;
  userId: number;
  promptText: string;
  response: string | null;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface LotteryPot {
  currentPot: number;
  participantCount: number;
  lastWinner: {
    userId: number;
    promptText: string;
    amountWon: number;
    timestamp: string;
  } | null;
}

interface UserStats {
  totalParticipations: number;
  totalWinnings: number;
  bestPrompt: {
    promptText: string;
    amountWon: number;
    timestamp: string;
  } | null;
}

// API Service Class
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        const message = error.response?.data?.error?.message || 'An error occurred';
        notify.error(message);
        return Promise.reject(error);
      }
    );
  }

  // Set auth token
  setToken(token: string) {
    this.token = token;
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async register(email: string, password: string, ethAddress: string) {
    const response = await this.api.post('/api/v1/auth/register', {
      email,
      password,
      ethAddress,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async verifyToken() {
    const response = await this.api.get('/api/v1/auth/verify');
    return response.data;
  }

  // Transaction endpoints
  async createTransaction(txHash: string, amountEth: number, transactionType: 'credit_purchase' | 'payout') {
    const response = await this.api.post('/api/v1/transactions', {
      txHash,
      amountEth,
      transactionType,
    });
    return response.data;
  }

  async getTransactionStatus(txHash: string) {
    const response = await this.api.get(`/api/v1/transactions/${txHash}`);
    return response.data;
  }

  async getUserTransactions() {
    const response = await this.api.get('/api/v1/transactions/user');
    return response.data;
  }

  // Prompt endpoints
  async submitPrompt(promptText: string) {
    const response = await this.api.post('/api/v1/prompts', {
      promptText,
    });
    return response.data;
  }

  async getPromptStatus(id: number) {
    const response = await this.api.get(`/api/v1/prompts/${id}`);
    return response.data;
  }

  async getUserPrompts() {
    const response = await this.api.get('/api/v1/prompts/user');
    return response.data;
  }

  // Lottery endpoints
  async getCurrentPot() {
    const response = await this.api.get('/api/v1/lottery/pot');
    return response.data;
  }

  async getUserStats() {
    const response = await this.api.get('/api/v1/lottery/stats');
    return response.data;
  }
}

// Create and export singleton instance
export const api = new ApiService();

// Export types
export type {
  User,
  Transaction,
  Prompt,
  LotteryPot,
  UserStats,
}; 