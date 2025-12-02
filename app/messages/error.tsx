'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Messages page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          There was an error loading the messages page. This might be due to corrupted data.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              // Clear potentially corrupted data
              if (typeof window !== 'undefined') {
                try {
                  localStorage.removeItem('persist:campusmarketplace');
                  window.location.reload();
                } catch (e) {
                  console.error('Error clearing storage:', e);
                  reset();
                }
              }
            }}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Clear Cache and Reload
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
          >
            Go to Home
          </button>
        </div>
        {error.message && (
          <p className="mt-4 text-sm text-gray-500">
            Error: {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
