/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, MapPin, DollarSign, ShoppingBag } from 'lucide-react';
import {
  useMarketplaceListingsListQuery,
  useMarketplaceCategoriesListQuery,
  useMarketplaceCampusesListQuery,
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';
import ListingCard from '@/components/listings/listing-card';

interface SearchFilters {
  category: string;
  campus: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  sortBy: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    campus: searchParams.get('campus') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sort') || 'created_at'
  });

  const { data: categories } = useMarketplaceCategoriesListQuery({});
  const { data: campuses } = useMarketplaceCampusesListQuery({});

  // Build query parameters for the API call
  const queryParams: any = {};
  if (searchQuery.trim()) queryParams.search = searchQuery.trim();
  if (filters.category) queryParams.category = filters.category;
  if (filters.campus) queryParams.campus = filters.campus;
  if (filters.condition) queryParams.condition = filters.condition;
  if (filters.minPrice) queryParams.price_min = filters.minPrice;
  if (filters.maxPrice) queryParams.price_max = filters.maxPrice;
  if (filters.location) queryParams.location = filters.location;
  queryParams.ordering = filters.sortBy.startsWith('-') ? filters.sortBy : `-${filters.sortBy}`;

  const { data: listingsData, isLoading } = useMarketplaceListingsListQuery(queryParams);

  const listings = listingsData?.results || [];

  useEffect(() => {
    // Update URL with current search and filters
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (filters.category) params.set('category', filters.category);
    if (filters.campus) params.set('campus', filters.campus);
    if (filters.condition) params.set('condition', filters.condition);
    if (filters.minPrice) params.set('min_price', filters.minPrice);
    if (filters.maxPrice) params.set('max_price', filters.maxPrice);
    if (filters.location) params.set('location', filters.location);
    if (filters.sortBy !== 'created_at') params.set('sort', filters.sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : '/search';

    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl);
    }
  }, [searchQuery, filters, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle URL updates
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      campus: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'created_at'
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.campus) count++;
    if (filters.condition) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.location) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for items..."
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 border rounded-lg font-medium transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories?.results?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  value={filters.campus}
                  onChange={(e) => handleFilterChange('campus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Campuses</option>
                  {campuses?.results?.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Condition</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at">Newest First</option>
                  <option value="-created_at">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="title">Title: A to Z</option>
                  <option value="-title">Title: Z to A</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex gap-6">
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Browse listings'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching...' : `${listings.length} item${listings.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
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
                      view_count: 0,
                      category: (listing as any).category,
                      campus: (listing as any).campus,
                      location: listing.location,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No listings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || activeFilterCount > 0
                    ? 'Try adjusting your search terms or filters'
                    : 'Be the first to list an item!'
                  }
                </p>
                {(searchQuery || activeFilterCount > 0) && (
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Clear search and filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}