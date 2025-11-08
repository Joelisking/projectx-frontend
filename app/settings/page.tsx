'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Lock, Bell, Shield, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { selectUser, authActions } from '@/lib/redux/slices/auth';
import {
  useUsersMeQuery,
  useUsersPartialUpdateMutation,
  useMarketplaceCampusesListQuery
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  campus: string;
  year: string;
  major: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'privacy' | 'account'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: userProfile, isLoading } = useUsersMeQuery({search:user?.id || ''});

  const { data: campuses } = useMarketplaceCampusesListQuery({});
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUsersPartialUpdateMutation();

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    campus: '',
    year: '',
    major: ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailListings: true,
    emailMessages: true,
    emailOffers: true,
    pushListings: false,
    pushMessages: true,
    pushOffers: true
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // useUsersMeQuery returns a paginated response, get the first result
    const profile = userProfile?.results?.[0];
    if (profile) {
      setProfileForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone_number || '',
        bio: '', // bio is not in UserRead type
        campus: profile.campus_id || '',
        year: '', // year is not in UserRead type
        major: '' // major is not in UserRead type
      });
    }
  }, [userProfile]);

  const handleProfileInputChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordInputChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!profileForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profileForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profileForm.email.trim()) newErrors.email = 'Email is required';
    if (profileForm.email && !/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateProfileForm()) return;

    try {
      const profile = userProfile?.results?.[0];
      const response = await updateProfile({
        id: user?.id || '',
        user: {
          username: profile?.username || user?.username || '',
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          email: profileForm.email,
          phone_number: profileForm.phone || undefined,
          campus_id: profileForm.campus || undefined,
        }
      }).unwrap();

      // Update user in Redux store
      dispatch(authActions.updateUser({
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        phoneNumber: response.phone_number || undefined,
      }));

      setSuccessMessage('Profile updated successfully!');
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);
      const err = error as { data?: { message?: string } };
      setErrors({ submit: err?.data?.message || 'Failed to update profile. Please try again.' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);
    try {
      // TODO: Implement password change when API endpoint is available
      // For now, show an error message
      setErrors({ submit: 'Password change is not yet implemented. Please contact support.' });
      setIsChangingPassword(false);
      return;
      // await changePassword({
      //   passwordChange: {
      //     old_password: passwordForm.currentPassword,
      //     new_password: passwordForm.newPassword
      //   }
      // }).unwrap();

      // setPasswordForm({
      //   currentPassword: '',
      //   newPassword: '',
      //   confirmPassword: ''
      // });

      // setSuccessMessage('Password changed successfully!');
    } catch (error: unknown) {
      console.error('Failed to change password:', error);
      const err = error as { data?: { old_password?: string[]; message?: string } };
      if (err?.data?.old_password) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        setErrors({ submit: err?.data?.message || 'Failed to change password. Please try again.' });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      console.log('Delete account requested');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Settings Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'password', label: 'Password', icon: Lock },
                { key: 'notifications', label: 'Notifications', icon: Bell },
                { key: 'privacy', label: 'Privacy', icon: Shield },
                { key: 'account', label: 'Account', icon: Trash2 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'profile' | 'password' | 'notifications' | 'privacy' | 'account')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => handleProfileInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => handleProfileInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campus
                      </label>
                      <select
                        value={profileForm.campus}
                        onChange={(e) => handleProfileInputChange('campus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select campus</option>
                        {campuses?.results?.map(campus => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <select
                        value={profileForm.year}
                        onChange={(e) => handleProfileInputChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select year</option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="graduate">Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Major
                      </label>
                      <input
                        type="text"
                        value={profileForm.major}
                        onChange={(e) => handleProfileInputChange('major', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="text-red-500 text-sm">{errors.submit}</div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {errors.submit && (
                  <div className="text-red-500 text-sm">{errors.submit}</div>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'emailListings', label: 'New listings in your categories' },
                        { key: 'emailMessages', label: 'New messages' },
                        { key: 'emailOffers', label: 'New offers on your listings' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center">
                          <input
                            id={key}
                            type="checkbox"
                            checked={notifications[key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Push Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'pushListings', label: 'New listings in your categories' },
                        { key: 'pushMessages', label: 'New messages' },
                        { key: 'pushOffers', label: 'New offers on your listings' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center">
                          <input
                            id={key}
                            type="checkbox"
                            checked={notifications[key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Profile Visibility</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'showEmail', label: 'Show email address on profile' },
                        { key: 'showPhone', label: 'Show phone number on profile' },
                        { key: 'showOnlineStatus', label: 'Show when you\'re online' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center">
                          <input
                            id={key}
                            type="checkbox"
                            checked={privacy[key as keyof typeof privacy]}
                            onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Communication</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="allowDirectMessages"
                          type="checkbox"
                          checked={privacy.allowDirectMessages}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, allowDirectMessages: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="allowDirectMessages" className="ml-2 block text-sm text-gray-900">
                          Allow direct messages from other users
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </button>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900">Account Management</h3>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 className="text-md font-medium text-yellow-800 mb-2">Data Export</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Download a copy of your data including listings, messages, and profile information.
                  </p>
                  <button className="inline-flex items-center px-3 py-2 border border-yellow-300 shadow-sm text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200">
                    Download Data
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-md font-medium text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}