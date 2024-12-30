import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ChatMessage } from '../components/ChatInterface/ChatMessage';
import { ChatInput } from '../components/ChatInterface/ChatInput';
import { prompts } from '../services/api';
import { useAuthStore } from '../context/authStore';
import { Prompt } from '../types';

export const Chat: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: promptHistory } = useQuery(['promptHistory'], prompts.getHistory);

  const submitMutation = useMutation(
    (prompt_text: string) => prompts.submit(prompt_text),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['promptHistory']);
        queryClient.invalidateQueries(['currentPot']);
      },
    }
  );

  const handleSubmit = (message: string) => {
    submitMutation.mutate(message);
  };

  const sortedHistory = React.useMemo(() => {
    return [...(promptHistory || [])].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [promptHistory]);

  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg flex flex-col h-[calc(100vh-16rem)]">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            AI Challenge Interface
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Try to outsmart our AI to win the pot. Each attempt costs 1 credit.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedHistory?.map((prompt: Prompt) => (
            <React.Fragment key={prompt.id}>
              <ChatMessage
                isAI={false}
                message={prompt.prompt_text}
                timestamp={prompt.created_at}
              />
              {prompt.response_text && (
                <ChatMessage
                  isAI={true}
                  message={prompt.response_text}
                  timestamp={prompt.created_at}
                  status={prompt.result}
                />
              )}
            </React.Fragment>
          ))}
          {submitMutation.isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-bounce flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSubmit={handleSubmit}
          disabled={!user?.prompt_credits || submitMutation.isLoading}
          isLoading={submitMutation.isLoading}
          promptCredits={user?.prompt_credits || 0}
        />
      </div>
    </DashboardLayout>
  );
}; 