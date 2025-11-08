// Use relative URL in browser to leverage Next.js rewrite proxy
// This avoids CORS issues during development
export const BASE_URL = typeof window !== 'undefined' 
  ? '/api/v1' 
  : 'http://localhost:8000/api/v1';
export const ORYX_ERP_COOKIE_ID = 'campusmarketplace_auth_token';

export const ITEM_CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const LISTING_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
} as const;

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
} as const;

export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'new_message',
  LISTING_INTEREST: 'listing_interest',
  REVIEW_RECEIVED: 'review_received',
  SAFETY_ALERT: 'safety_alert',
} as const;

export const ROUTES = {
  HOME: '/',
  LISTINGS: '/listings',
  MY_LISTINGS: '/my-listings',
  CREATE_LISTING: '/create-listing',
  PROFILE: '/profile',
  MESSAGES: '/messages',
  WISHLIST: '/wishlist',
  REVIEWS: '/reviews',
  CATEGORIES: '/categories',
  SEARCH: '/search',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
} as const;