'use client';

import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

const variantStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconColors = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500'
};

export default function ErrorMessage({
  title,
  message,
  variant = 'error',
  dismissible = false,
  onDismiss,
  onRetry,
  className
}: ErrorMessageProps) {
  return (
    <div className={cn(
      'border rounded-md p-4',
      variantStyles[variant],
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className={cn('h-5 w-5', iconColors[variant])} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try again
              </button>
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}