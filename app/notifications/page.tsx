/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Bell, Shield, AlertTriangle, CheckCircle, Info, Eye, Trash2 } from 'lucide-react';

import {
  useSafetyNotificationsListQuery,
  useSafetyNotificationsMarkReadMutation,
  useSafetyNotificationsMarkAllReadMutation,
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function NotificationsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'read' | 'unread' | null>(null);

  const { data: notificationsData, isLoading, refetch } = useSafetyNotificationsListQuery({});
  const [markAsRead] = useSafetyNotificationsMarkReadMutation();
  const [markAllRead] = useSafetyNotificationsMarkAllReadMutation();

  const notifications = notificationsData?.results || [];

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = !filterType || notification.notification_type === filterType;
    const matchesStatus = !filterStatus ||
      (filterStatus === 'read' && notification.is_read) ||
      (filterStatus === 'unread' && !notification.is_read);

    return matchesType && matchesStatus;
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        id: notificationId,
        notification: {} as any // Backend doesn't use this, but API requires it
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    // Note: Delete functionality not available in current API
    // This function is kept for UI compatibility
    console.warn(notificationId,'Delete notification not implemented in API');
  };

  const markAllAsRead = async () => {
    try {
      await markAllRead({
        notification: {} as any // Backend doesn't use this, but API requires it
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security_alert': return <Shield className="h-5 w-5 text-red-500" />;
      case 'safety_tip': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'confirmation': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'security_alert': return 'border-l-red-500 bg-red-50';
      case 'safety_tip': return 'border-l-blue-500 bg-blue-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'confirmation': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'security_alert': return 'Security Alert';
      case 'safety_tip': return 'Safety Tip';
      case 'warning': return 'Warning';
      case 'confirmation': return 'Confirmation';
      default: return 'Notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
              ))}
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Bell className="h-6 w-6 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Stay informed about security and safety updates</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <select
                  value={filterType || ''}
                  onChange={(e) => setFilterType(e.target.value || null)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="security_alert">Security Alerts</option>
                  <option value="safety_tip">Safety Tips</option>
                  <option value="warning">Warnings</option>
                  <option value="confirmation">Confirmations</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus((e.target.value as any) || null)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow border-l-4 ${getNotificationColor(notification.notification_type || '')} ${
                  !notification.is_read ? 'ring-2 ring-blue-100' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="shrink-0 mt-1">
                        {getNotificationIcon(notification.notification_type || '')}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-lg font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {getNotificationTypeLabel(notification.notification_type || '')}
                            </span>
                            {!notification.is_read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(notification.created_at || '')}
                          </span>
                        </div>

                        <p className={`text-sm ${!notification.is_read ? 'text-gray-800' : 'text-gray-600'} mb-4`}>
                          {notification.message}
                        </p>

                        {/* Action Link */}
                        {notification.reference_id && (
                          <div className="mb-4">
                            <button
                              onClick={() => {
                                // Navigate based on notification type and reference
                                if (notification.notification_type === 'message') {
                                  router.push(`/messages/${notification.reference_id}`);
                                } else if (notification.notification_type === 'offer') {
                                  router.push('/transactions');
                                } else if (notification.reference_type === 'listing') {
                                  router.push(`/listings/${notification.reference_id}`);
                                }
                              }}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Details →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id!)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                          title="Mark as read"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id!)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {filterType || filterStatus ? 'No matching notifications' : 'No notifications'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterType || filterStatus
                  ? 'Try adjusting your filters'
                  : 'We\'ll notify you about important security and safety updates'
                }
              </p>
            </div>
          )}
        </div>

        {/* Safety Information */}
        <div className="mt-12 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Stay Safe on Campus Marketplace</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Meeting Safely:</h4>
                  <ul className="space-y-1">
                    <li>• Meet in well-lit, public areas</li>
                    <li>• Bring a friend when possible</li>
                    <li>• Choose campus locations or nearby coffee shops</li>
                    <li>• Trust your instincts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Transaction Security:</h4>
                  <ul className="space-y-1">
                    <li>• Inspect items carefully before purchase</li>
                    <li>• Use secure payment methods</li>
                    <li>• Keep records of transactions</li>
                    <li>• Report suspicious behavior</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/safety')}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn more about safety →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}