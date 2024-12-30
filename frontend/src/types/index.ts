export interface User {
  id: number;
  email: string;
  eth_address?: string;
  prompt_credits: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  tx_hash: string;
  amount_eth: number;
  transaction_type: 'credit_purchase' | 'payout';
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface Prompt {
  id: number;
  user_id: number;
  prompt_text: string;
  response_text?: string;
  result?: 'success' | 'failure' | 'release_code';
  created_at: string;
}

export interface LotteryPot {
  id: number;
  current_pot: number;
  last_winner_id?: number;
  payout_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: { field: string; message: string }[];
} 