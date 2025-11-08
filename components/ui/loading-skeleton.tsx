'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              'h-4 rounded',
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

// Pre-built skeleton components for common use cases
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-5" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center">
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex space-x-3 p-4">
      <LoadingSkeleton variant="circular" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <LoadingSkeleton variant="circular" className="w-16 h-16" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
      </div>
      <LoadingSkeleton variant="text" lines={3} />
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}