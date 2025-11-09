'use client';

import { useState } from 'react';
import { useMarketplaceListingsListQuery, useMarketplaceCategoriesListQuery } from '@/lib/redux/api/openapi.generated';
import { Filter, ShoppingBag } from 'lucide-react';
import Header from '@/components/navigation/header';
import ListingCard from '@/components/listings/listing-card';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: listings, isLoading: loadingListings } = useMarketplaceListingsListQuery({
    category: selectedCategory || undefined,
  });
  const { data: categories, isLoading: loadingCategories } = useMarketplaceCategoriesListQuery({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex gap-6">
            {/* Sidebar - Categories */}
            <aside className="w-64 shrink-0">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>

                {loadingCategories ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {/* All Categories Option */}
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left py-1 text-sm transition-colors ${
                          selectedCategory === null
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        All Categories
                      </button>
                    </li>

                    {categories?.results?.slice(0, 8).map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id || null)}
                          className={`w-full text-left py-1 text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'text-blue-600 font-semibold'
                              : 'text-gray-600 hover:text-blue-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* Main Listings Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedCategory
                      ? `${categories?.results?.find((cat) => cat.id === selectedCategory)?.name || 'Category'} Listings`
                      : 'Recent Listings'}
                  </h2>
                </div>

                {loadingListings ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {listings?.results?.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={{
                          id: listing.id || '',
                          title: listing.title,
                          price: listing.price,
                          condition: listing.condition,
                          status: listing.status,
                          seller: listing.seller,
                          primary_image: listing.primary_image,
                          created_at: listing.created_at || new Date().toISOString(),
                          view_count: 0, // ListingListRead doesn't have view_count
                        }}
                      />
                    ))}
                  </div>
                )}

                {!loadingListings && (!listings?.results || listings.results.length === 0) && (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first listing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
