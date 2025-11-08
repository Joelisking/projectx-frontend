/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Edit, MapPin, Calendar, Star, User, Mail, Phone, Camera, Award } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useUsersReadQuery,
  useMarketplaceListingsMyListingsQuery,
  useReviewsMyReviewsQuery
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';
import ListingCard from '@/components/listings/listing-card';

export default function ProfilePage() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');

  const { data: userProfile, isLoading: loadingProfile } = useUsersReadQuery(
    { id: user?.id || '' },
    { skip: !user?.id }
  );

  const { data: userListings, isLoading: loadingListings } = useMarketplaceListingsMyListingsQuery({});

  const { data: userReviews, isLoading: loadingReviews } = useReviewsMyReviewsQuery({});

  const listings = userListings?.results || [];
  const reviews = userReviews?.results || [];

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating();

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="relative">
            {/* Cover Image Placeholder */}
            <div className="h-32 bg-linear-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>

            {/* Profile Content */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-12">
                {/* Profile Picture */}
                <div className="relative">
                  {userProfile?.profile_picture_url ? (
                    <img
                      src={userProfile.profile_picture_url}
                      alt={`${userProfile.first_name} ${userProfile.last_name}`}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {userProfile?.first_name} {userProfile?.last_name}
                      </h1>
                      <p className="text-gray-600">@{userProfile?.username}</p>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{averageRating.toFixed(1)}</span>
                          <span className="ml-1">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Joined {formatJoinDate(userProfile?.created_at || '')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push('/settings')}
                      className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{userProfile?.email}</span>
                </div>
                {userProfile?.phone_number && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{userProfile.phone_number}</span>
                  </div>
                )}
                {userProfile?.campus && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{typeof userProfile.campus === 'string' ? userProfile.campus : (userProfile.campus as any)?.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements/Badges */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{reviews.length}</div>
              <div className="text-sm text-gray-600">Reviews Received</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatJoinDate(userProfile?.created_at || '').split(' ')[1]}
              </div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'listings', label: 'My Listings', count: listings.length },
                { key: 'reviews', label: 'Reviews', count: reviews.length },
                { key: 'about', label: 'About' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'listings' && (
              <div>
                {loadingListings ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
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
                          primary_image: listing.images?.[0]?.image_url,
                          created_at: listing.created_at || new Date().toISOString(),
                          view_count: 0,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active listings</p>
                    <button
                      onClick={() => router.push('/create-listing')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Create First Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {loadingReviews ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="shrink-0">
                            {review.reviewer?.profile_picture_url ? (
                              <img
                                src={review.reviewer.profile_picture_url}
                                alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                {review.reviewer?.first_name} {review.reviewer?.last_name}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (review.rating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mt-1">{review.review_text}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-500 mt-2">No reviews yet</p>
                    <p className="text-sm text-gray-400">Reviews will appear here when you start selling</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-700">
                      {userProfile?.username ? `@${userProfile.username}` : 'No username added yet.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-20">Email:</span>
                        <span className="text-gray-600">{userProfile?.email}</span>
                      </div>
                      {userProfile?.phone_number && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Phone:</span>
                          <span className="text-gray-600">{userProfile.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Campus Information</h3>
                    <div className="space-y-2">
                      {userProfile?.campus && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Campus:</span>
                          <span className="text-gray-600">{typeof userProfile.campus === 'string' ? userProfile.campus : (userProfile.campus as any)?.name}</span>
                        </div>
                      )}
                      {/* {userProfile?. && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Year:</span>
                          <span className="text-gray-600">{userProfile.year}</span>
                        </div>
                      )}
                      {userProfile?.major && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Major:</span>
                          <span className="text-gray-600">{userProfile.major}</span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}