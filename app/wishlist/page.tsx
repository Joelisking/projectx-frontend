'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, Trash2, Share2 } from 'lucide-react';
import {
  useMarketplaceWishlistListQuery,
  useMarketplaceWishlistDeleteMutation,
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';
import ListingCard from '@/components/listings/listing-card';

export default function WishlistPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data: wishlistData, isLoading, refetch } = useMarketplaceWishlistListQuery({});
  const [removeFromWishlist] = useMarketplaceWishlistDeleteMutation();

  const wishlistItems = wishlistData?.results || [];

  const filteredItems = wishlistItems.filter(item => {
    const listing = item.listing;
    if (!listing) return false;

    // ListingListRead only has basic fields (no description or category)
    const matchesSearch = !searchQuery.trim() ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleRemoveFromWishlist = async () => {
    if (!itemToDelete) return;

    try {
      await removeFromWishlist({ id: itemToDelete }).unwrap();
      setShowDeleteModal(false);
      setItemToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleWishlistToggle = () => {
    refetch(); // Refresh the wishlist when items are toggled
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600">Items you're interested in</p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-gray-500">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search */}
        {wishlistItems.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search your wishlist..."
              />
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const listing = item.listing;
              if (!listing) return null;

              return (
                <div key={item.id} className="relative">
                  <ListingCard
                    listing={{
                      id: listing.id || '',
                      title: listing.title,
                      price: listing.price,
                      condition: listing.condition,
                      status: listing.status,
                      seller: listing.seller,
                      primary_image: listing.primary_image,
                      created_at: listing.created_at || new Date().toISOString(),
                      view_count: 0,
                      location: listing.location,
                    }}
                    isInWishlist={true}
                    onWishlistToggle={handleWishlistToggle}
                  />

                  {/* Additional Actions */}
                  <div className="absolute top-2 left-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setItemToDelete(item.id!);
                          setShowDeleteModal(true);
                        }}
                        className="bg-white rounded-full p-2 shadow-sm hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 text-gray-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Added Date */}
                  {item.created_at && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        Added {formatTimeAgo(item.created_at)}
                      </span>
                    </div>
                  )}

                  {/* Status Overlay */}
                  {listing.status && listing.status !== 'active' && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                        {listing.status === 'sold' ? 'SOLD' : 'UNAVAILABLE'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding items to your wishlist by clicking the heart icon on listings
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Listings
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items match your search</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms
            </p>
            <div className="mt-6">
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Wishlist Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Get notified when items go on sale or prices drop</li>
              <li>• Share your wishlist with friends and family</li>
              <li>• Items marked as sold will be highlighted in your list</li>
              <li>• Contact sellers directly from your wishlist</li>
            </ul>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-5">Remove from Wishlist</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to remove this item from your wishlist?
                </p>
              </div>
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveFromWishlist}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}