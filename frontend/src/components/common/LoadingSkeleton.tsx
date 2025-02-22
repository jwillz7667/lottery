import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
}

export const LoadingSkeleton = ({ className = '' }: LoadingSkeletonProps) => (
    <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    </div>
); 