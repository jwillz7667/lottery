import React, { useState } from 'react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  promptCredits: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  disabled = false,
  isLoading = false,
  promptCredits
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex items-start space-x-4">
        <div className="min-w-0 flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                rows={3}
                name="message"
                id="message"
                className={classNames(
                  'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
                  'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                  disabled ? 'bg-gray-50' : ''
                )}
                placeholder={
                  promptCredits > 0
                    ? 'Enter your prompt...'
                    : 'Purchase credits to continue...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={disabled || isLoading}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Available credits: {promptCredits}
              </div>
              <Button
                type="submit"
                disabled={disabled || isLoading || !message.trim()}
                isLoading={isLoading}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 