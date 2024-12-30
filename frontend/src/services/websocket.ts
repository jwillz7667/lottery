import { notify } from '../utils/notifications';

interface TransactionUpdate {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

interface PromptUpdate {
  promptId: number;
  status: 'pending' | 'completed' | 'failed';
  response: string | null;
  timestamp: string;
}

interface PotUpdate {
  currentPot: number;
  participantCount: number;
  timestamp: string;
}

type WebSocketPayload = TransactionUpdate | PromptUpdate | PotUpdate;

interface WebSocketMessage {
  type: 'transaction_update' | 'prompt_update' | 'pot_update';
  payload: WebSocketPayload;
}

type MessageHandler<T extends WebSocketPayload> = (payload: T) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, Set<MessageHandler<WebSocketPayload>>> = new Map();

  constructor() {
    this.messageHandlers.set('transaction_update', new Set());
    this.messageHandlers.set('prompt_update', new Set());
    this.messageHandlers.set('pot_update', new Set());
  }

  connect(token: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.info('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        const handlers = this.messageHandlers.get(message.type);
        handlers?.forEach(handler => handler(message.payload));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.info('WebSocket disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      notify.error('Connection error. Attempting to reconnect...');
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(this.getStoredToken());
      }, delay);
    } else {
      notify.error('Unable to establish connection. Please refresh the page.');
    }
  }

  private getStoredToken(): string {
    return localStorage.getItem('token') || '';
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onTransactionUpdate(handler: MessageHandler<TransactionUpdate>): () => void {
    this.messageHandlers.get('transaction_update')?.add(handler as MessageHandler<WebSocketPayload>);
    return () => this.messageHandlers.get('transaction_update')?.delete(handler as MessageHandler<WebSocketPayload>);
  }

  onPromptUpdate(handler: MessageHandler<PromptUpdate>): () => void {
    this.messageHandlers.get('prompt_update')?.add(handler as MessageHandler<WebSocketPayload>);
    return () => this.messageHandlers.get('prompt_update')?.delete(handler as MessageHandler<WebSocketPayload>);
  }

  onPotUpdate(handler: MessageHandler<PotUpdate>): () => void {
    this.messageHandlers.get('pot_update')?.add(handler as MessageHandler<WebSocketPayload>);
    return () => this.messageHandlers.get('pot_update')?.delete(handler as MessageHandler<WebSocketPayload>);
  }
}

export const ws = new WebSocketService(); 