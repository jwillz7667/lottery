import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ethereum } from '../../services/ethereum';
import { notify } from '../../utils/notifications';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await ethereum.connectWallet();
      setEthAddress(address);
      notify.success('Wallet connected successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      notify.error(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethAddress) {
      notify.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, ethAddress);
      navigate('/dashboard');
    } catch {
      // Error is handled by the auth store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={connectWallet}
          loading={isConnecting}
          disabled={isConnecting || !!ethAddress}
        >
          {ethAddress ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
        {ethAddress && (
          <p className="mt-2 text-sm text-gray-500 truncate">
            Connected: {ethAddress}
          </p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !ethAddress}
        >
          Register
        </Button>
      </div>
    </form>
  );
}; 