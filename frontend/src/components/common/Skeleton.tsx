import React from 'react';
import { classNames } from '../../utils/styles';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true,
}) => (
  <div
    className={classNames(
      'bg-gray-200 rounded',
      animate ? 'animate-pulse' : '',
      className
    )}
  />
);

export const ChatMessageSkeleton: React.FC<{ isAI?: boolean }> = ({ isAI }) => (
  <div
    className={classNames(
      'flex w-full space-x-3 max-w-4xl',
      isAI ? 'justify-start' : 'justify-end'
    )}
  >
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-20 w-64" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const TransactionSkeleton: React.FC = () => (
  <div className="px-4 py-4 sm:px-6">
    <div className="flex items-center justify-between">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
    <Skeleton className="mt-2 h-4 w-96" />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white overflow-hidden rounded-lg shadow">
    <div className="px-4 py-5 sm:p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32" />
    </div>
  </div>
); 