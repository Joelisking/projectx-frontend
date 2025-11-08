/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Star, User, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useReviewsListQuery,
  useReviewsCreateMutation
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function ReviewsPage() {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewee: '',
    rating: 5,
    comment: '',
    transaction: ''
  });

  const { data: reviewsData, isLoading } = useReviewsListQuery({});

  const [createReview] = useReviewsCreateMutation();

  const reviews = reviewsData?.results || [];

  const filteredReviews = reviews.filter(review => {
    if (filterRating === null) return true;
    return review.rating === filterRating;
  });

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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = review.rating || 1;
      distribution[rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleCreateReview = async () => {
    if (!newReview.reviewee || !newReview.comment.trim()) return;

    try {
      await createReview({
        review: {
          reviewee_id: newReview.reviewee,
          rating: newReview.rating,
          review_text: newReview.comment.trim(),
          transaction_id: newReview.transaction || '',
          is_buyer_review: true // This should be determined based on the user's role in the transaction
        }
      }).unwrap();

      setNewReview({
        reviewee: '',
        rating: 5,
        comment: '',
        transaction: ''
      });
      setShowCreateReview(false);
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h1>
            <p className="text-gray-600">View and manage your reviews</p>
          </div>
          <button
            onClick={() => setShowCreateReview(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Star className="h-4 w-4 mr-2" />
            Write Review
          </button>
        </div>

        {/* Rating Overview - Only show for received reviews */}
        {activeTab === 'received' && reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(parseFloat(averageRating as string))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: reviews.length > 0 ? `${(distribution[rating as keyof typeof distribution] / reviews.length) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {distribution[rating as keyof typeof distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterRating(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterRating === null
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      filterRating === rating
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating}
                    <Star className="h-3 w-3 ml-1 text-yellow-400 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'received', label: 'Reviews Received', count: reviews.filter(r => r.reviewee === user?.id).length },
                { key: 'given', label: 'Reviews Given', count: reviews.filter(r => r.reviewer === user?.id).length }
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
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Reviews List */}
          <div className="p-6">
            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="shrink-0">
                        {activeTab === 'received' && review.reviewer?.profile_picture_url ? (
                          <img
                            src={review.reviewer.profile_picture_url}
                            alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : activeTab === 'given' && review.reviewee?.profile_picture_url ? (
                          <img
                            src={review.reviewee.profile_picture_url}
                            alt={`${review.reviewee.first_name} ${review.reviewee.last_name}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {activeTab === 'received'
                                ? `${review.reviewer?.first_name} ${review.reviewer?.last_name}`
                                : `${review.reviewee?.first_name} ${review.reviewee?.last_name}`
                              }
                            </h4>
                            <div className="flex items-center mt-1">
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
                              <span className="ml-2 text-sm text-gray-600">
                                {formatTimeAgo(review.created_at ?? '')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.review_text}</p>

                        {/* Transaction Info */}
                        {review.transaction_id && (
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Transaction:</span> #{review.transaction_id}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {activeTab === 'received' ? 'No reviews received' : 'No reviews given'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'received'
                    ? 'Reviews from buyers will appear here after transactions'
                    : 'Reviews you write will appear here'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Review Modal */}
      {showCreateReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowCreateReview(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReview}
                  disabled={!newReview.comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}