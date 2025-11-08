'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center py-12 px-4',
      className
    )}>
      {icon && (
        <div className="mx-auto mb-4 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
            action.variant === 'secondary'
              ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
              : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}