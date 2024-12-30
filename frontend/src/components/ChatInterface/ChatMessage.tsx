import React from 'react';
import { classNames } from '../../utils/styles';

interface ChatMessageProps {
  isAI: boolean;
  message: string;
  timestamp: string;
  status?: 'success' | 'failure' | 'release_code';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  isAI,
  message,
  timestamp,
  status
}) => {
  return (
    <div
      className={classNames(
        'flex w-full space-x-3 max-w-4xl',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={classNames(
          'flex flex-col space-y-2 text-sm max-w-xs mx-2',
          isAI ? 'order-2' : 'order-1'
        )}
      >
        <div>
          <span
            className={classNames(
              'inline-block rounded-lg px-4 py-3',
              isAI
                ? 'bg-gray-100 text-gray-900'
                : 'bg-indigo-600 text-white'
            )}
          >
            <p className="text-sm">{message}</p>
          </span>
          {status && (
            <span
              className={classNames(
                'inline-block ml-2 px-2 py-1 text-xs font-medium rounded-full',
                status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : status === 'release_code'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {status === 'release_code' ? 'Winner!' : status}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}; 