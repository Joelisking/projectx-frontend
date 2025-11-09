'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, TrendingUp, DollarSign, MoreVertical } from 'lucide-react';
import {
  useMarketplaceListingsMyListingsQuery,
  useMarketplaceListingsDeleteMutation,
  useMarketplaceListingsPartialUpdateMutation
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';
import ListingCard from '@/components/listings/listing-card';

export default function MyListingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold' | 'inactive'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  const { data: listingsData, isLoading, refetch } = useMarketplaceListingsMyListingsQuery({});

  const [deleteListing] = useMarketplaceListingsDeleteMutation();
  const [updateListing] = useMarketplaceListingsPartialUpdateMutation();

  // Cast to proper type since backend returns ListingListRead format
  const listings = (listingsData?.results || []) as Array<{
    id?: string;
    title: string;
    price: string;
    condition: string;
    status?: string;
    seller?: any;
    primary_image?: string;
    created_at?: string;
    view_count?: number;
  }>;

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return listing.status === 'active';
    if (activeTab === 'sold') return listing.status === 'sold';
    if (activeTab === 'inactive') return listing.status === 'expired' || listing.status === 'deleted';
    return true;
  });

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    try {
      await deleteListing({ id: listingToDelete }).unwrap();
      setShowDeleteModal(false);
      setListingToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  const handleMarkAsSold = async (listingId: string) => {
    try {
      await updateListing({
        id: listingId,
        listing: {
          status: 'sold'
        } as any
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark as sold:', error);
    }
  };

  const handleReactivate = async (listingId: string) => {
    try {
      await updateListing({
        id: listingId,
        listing: {
          status: 'active'
        } as any
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to reactivate listing:', error);
    }
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return listings.length;
    return listings.filter(listing => listing.status === status).length;
  };

  const getListingStats = () => {
    const activeCount = listings.filter(l => l.status === 'active').length;
    const soldCount = listings.filter(l => l.status === 'sold').length;
    const totalViews = listings.reduce((sum, l) => sum + ((l as {view_count?: number}).view_count || 0), 0);
    const totalValue = listings
      .filter(l => l.status === 'sold')
      .reduce((sum, l) => sum + parseFloat(l.price || '0'), 0);

    return { activeCount, soldCount, totalViews, totalValue };
  };

  const stats = getListingStats();

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your marketplace listings</p>
          </div>
          <button
            onClick={() => router.push('/create-listing')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Items Sold</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.soldCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: 'All Listings' },
                { key: 'active', label: 'Active' },
                { key: 'sold', label: 'Sold' },
                { key: 'inactive', label: 'Inactive' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'all' | 'active' | 'sold' | 'inactive')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {getTabCount(tab.key)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Listings Grid */}
          <div className="p-6">
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="relative">
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
                        view_count: (listing as {view_count?: number}).view_count || 0,
                      }}
                    />

                    {/* Actions Menu */}
                    <div className="absolute top-2 left-2">
                      <div className="relative group">
                        <button className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>

                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button
                            onClick={() => router.push(`/listings/${listing.id}/edit`)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Listing
                          </button>

                          <button
                            onClick={() => router.push(`/listings/${listing.id}`)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Listing
                          </button>

                          {listing.status === 'active' && listing.id && (
                            <button
                              onClick={() => listing.id && handleMarkAsSold(listing.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Mark as Sold
                            </button>
                          )}

                          {listing.status === 'sold' && listing.id && (
                            <button
                              onClick={() => listing.id && handleReactivate(listing.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Reactivate
                            </button>
                          )}

                          <hr className="my-1" />

                          {listing.id && (
                            <button
                              onClick={() => {
                                if (listing.id) {
                                  setListingToDelete(listing.id);
                                  setShowDeleteModal(true);
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Listing
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Plus className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No {activeTab !== 'all' ? activeTab : ''} listings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all'
                    ? "Get started by creating your first listing."
                    : `You don't have any ${activeTab} listings yet.`
                  }
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/create-listing')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-5">Delete Listing</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this listing? This action cannot be undone.
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
                  onClick={handleDeleteListing}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}