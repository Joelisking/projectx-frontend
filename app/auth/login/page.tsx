/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useUsersLoginMutation } from '@/lib/redux/api/openapi.generated';
import { authActions, selectAuthLoading, selectAuthError } from '@/lib/redux/slices/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [loginMutation] = useUsersLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(authActions.loginStart());

      const result = await loginMutation({
        user: {
          email: formData.email,
          password: formData.password,
        } as any
      }).unwrap();

      // Extract user and tokens from response
      const userData = (result as {user?: unknown, tokens?: {access_token: string, refresh_token: string}}).user || result;
      const tokens = (result as {tokens?: {access_token: string, refresh_token: string}}).tokens;

      // Transform the API response to match our auth state structure
      const userInfo = userData as {id?: string, email?: string, username?: string, first_name?: string, last_name?: string, campus?: {name?: string}};
      const user = {
        id: userInfo.id || '',
        email: userInfo.email || '',
        username: userInfo.username || '',
        firstName: userInfo.first_name || '',
        lastName: userInfo.last_name || '',
        phoneNumber: (userInfo as {phone_number?: string}).phone_number || undefined,
        profilePictureUrl: (userInfo as {profile_picture_url?: string}).profile_picture_url || undefined,
        campusId: (userInfo as {campus_id?: string}).campus_id || undefined,
        campus: userInfo.campus?.name || undefined,
        isVerified: (userInfo as {is_verified?: boolean}).is_verified || false,
        averageRating: (userInfo as {average_rating?: string}).average_rating ? parseFloat((userInfo as {average_rating: string}).average_rating) : undefined,
        totalReviews: (userInfo as {total_reviews?: number}).total_reviews || 0,
      };

      dispatch(authActions.loginSuccess({
        user,
        accessToken: tokens?.access_token,
        refreshToken: tokens?.refresh_token
      }));

      // Redirect to home page or intended destination
      router.push('/');
    } catch (err: unknown) {
      const error = err as {data?: {message?: string}};
      dispatch(authActions.loginFailure(error?.data?.message || 'Login failed. Please try again.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">New to Campus Marketplace?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create your account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}