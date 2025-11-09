import { BASE_URL, ORYX_ERP_COOKIE_ID } from '../../constants';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { getCookie } from 'cookies-next';
import qs from 'qs';

// Import the getCookie function

// Mutex instance to handle potential concurrent requests
export const mutex = new Mutex();

// Define the baseQuery with added authorization header
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Changed from 'same-origin' to 'include' for cross-origin requests
  mode: 'cors',
  prepareHeaders: (headers, { getState }) => {
    // First try to get token from Redux state
    const state = getState() as any;
    const token = state?.persistedReducer?.auth?.accessToken;

    // Fallback to cookie if token not in state
    const cookieToken = getCookie(ORYX_ERP_COOKIE_ID);
    const finalToken = token || cookieToken;

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Auth Debug]', {
        hasTokenInState: !!token,
        hasTokenInCookie: !!cookieToken,
        hasFinalToken: !!finalToken,
        tokenPreview: finalToken ? finalToken.substring(0, 20) + '...' : 'none'
      });
    }

    if (finalToken) {
      headers.set('Authorization', `Bearer ${finalToken}`);
    }
    return headers;
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'repeat', // This formats arrays as repeated params
      skipNulls: true, // Optional: removes null/undefined values
    });
  },
});

// Middleware function with re-authentication logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait for the mutex to unlock
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - session expired
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as any;
        const refreshToken = state?.persistedReducer?.auth?.refreshToken;

        if (refreshToken) {
          // Try to refresh the token
          const refreshResult = await baseQuery(
            {
              url: '/api/v1/auth/refresh/',
              method: 'POST',
              body: { refresh: refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            // Token refreshed successfully - update the state
            const data = refreshResult.data as { access?: string };
            if (data.access) {
              // Import authActions dynamically to avoid circular dependency
              const { authActions } = await import('../slices/auth');
              api.dispatch(authActions.loginSuccess({
                user: state?.persistedReducer?.auth?.user,
                accessToken: data.access,
                refreshToken: refreshToken,
              }));

              // Retry the original request with new token
              result = await baseQuery(args, api, extraOptions);
            } else {
              // Refresh failed - logout user
              await handleLogout(api);
            }
          } else {
            // Refresh failed - logout user
            await handleLogout(api);
          }
        } else {
          // No refresh token - logout user
          await handleLogout(api);
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

// Helper function to handle logout
async function handleLogout(api: any) {
  const { authActions } = await import('../slices/auth');
  const { deleteCookie } = await import('cookies-next');

  // Dispatch logout action
  api.dispatch(authActions.logout());

  // Clear cookies
  deleteCookie(ORYX_ERP_COOKIE_ID);

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login?session_expired=true';
  }
}

// Define API slice with endpoints
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Campus',
    'Category',
    'Listing',
    'Conversation',
    'Message',
    'Wishlist',
    'Review',
    'Notification',
    'StudyMaterial',
    'FlaggedContent',
    'SavedSearch'
  ],
  endpoints: (_builder) => ({}),
});

export const restApi = api;
