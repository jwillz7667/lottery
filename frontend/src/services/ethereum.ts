import { ethers } from 'ethers';
import { notify } from '../utils/notifications';

interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
}

interface EthereumProvider extends ethers.BrowserProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

class EthereumService {
  private provider: EthereumProvider | null = null;

  async initialize(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    this.provider = window.ethereum as EthereumProvider;
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (!accounts[0]) {
        throw new Error('No accounts found');
      }

      return accounts[0];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      throw new Error(message);
    }
  }

  async sendTransaction(request: TransactionRequest): Promise<string> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const signer = await this.provider.getSigner();
      const tx = await signer.sendTransaction(request);
      return tx.hash;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed';
      notify.error(message);
      throw error;
    }
  }

  toWei(amount: number): string {
    return ethers.parseEther(amount.toString()).toString();
  }

  fromWei(amount: string): string {
    return ethers.formatEther(amount);
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('MetaMask is not installed');
    }

    const balance = await this.provider.getBalance(address);
    return this.fromWei(balance.toString());
  }

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('MetaMask is not installed');
    }

    const network = await this.provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
    };
  }
}

export const ethereum = new EthereumService();
export default ethereum; 