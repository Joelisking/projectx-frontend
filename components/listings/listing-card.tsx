'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, Clock, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/lib/redux/slices/auth';
import { useMarketplaceWishlistCreateMutation, useMarketplaceWishlistDeleteMutation } from '@/lib/redux/api/openapi.generated';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: string;
    condition: string;
    status?: string;
    seller?: string;
    primary_image?: string;
    created_at: string;
    category?: {
      id: string;
      name: string;
    };
    campus?: {
      id: string;
      name: string;
    };
    view_count?: number;
    location?: string;
  };
  isInWishlist?: boolean;
  onWishlistToggle?: () => void;
}

export default function ListingCard({ listing, isInWishlist = false, onWishlistToggle }: ListingCardProps) {
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [addToWishlist] = useMarketplaceWishlistCreateMutation();
  const [removeFromWishlist] = useMarketplaceWishlistDeleteMutation();

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

  const formatCondition = (condition: string) => {
    return condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like_new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login or show modal
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist({ id: listing.id });
      } else {
        // Add to wishlist
        await addToWishlist({
          wishlist: {
            listing_id: listing.id
          }
        });
      }
      onWishlistToggle?.();
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Image */}
        <div className="aspect-square bg-gray-200 overflow-hidden relative">
          {listing.primary_image ? (
            <Image
              src={listing.primary_image}
              alt={listing.title}
              width={300}
              height={300}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInWishlist
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white text-gray-600 hover:text-red-500 hover:bg-gray-50'
            } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Status badge */}
          {listing.status && listing.status !== 'active' && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                listing.status === 'sold'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {listing.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {listing.title}
            </h3>
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-semibold text-green-600">${listing.price}</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(listing.condition)}`}>
              {formatCondition(listing.condition)}
            </span>
          </div>

          {/* Category */}
          {listing.category && (
            <p className="text-sm text-blue-600 mb-2">{listing.category.name}</p>
          )}

          {/* Location */}
          {listing.location && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{listing.location}</span>
            </div>
          )}

          {/* Campus */}
          {listing.campus && (
            <p className="text-xs text-gray-500 mb-2">{listing.campus.name}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTimeAgo(listing.created_at)}</span>
            </div>

            {listing.view_count !== undefined && (
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{listing.view_count} views</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}