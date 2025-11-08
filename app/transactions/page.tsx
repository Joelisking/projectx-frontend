/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Eye, MessageCircle, Star } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useTransactionsOffersListQuery,
  useTransactionsOffersAcceptMutation,
  useTransactionsOffersRejectMutation,
  type OfferRead
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function TransactionsPage() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'completed'>('received');

  const { data: offersData, isLoading, refetch } = useTransactionsOffersListQuery({});
  const [acceptOffer] = useTransactionsOffersAcceptMutation();
  const [rejectOffer] = useTransactionsOffersRejectMutation();

  const offers = offersData?.results || [];

  // Filter offers based on current user and tab
  const filteredOffers = offers.filter((offer: OfferRead) => {
    if (activeTab === 'received') {
      // Offers received by current user (on their listings)
      return offer.seller?.id === user?.id;
    } else if (activeTab === 'sent') {
      // Offers sent by current user
      return offer.buyer?.id === user?.id && offer.status !== 'accepted';
    } else if (activeTab === 'completed') {
      // Completed transactions (accepted offers)
      return (offer.buyer?.id === user?.id || offer.seller?.id === user?.id) && offer.status === 'accepted';
    }
    return false;
  });

  const handleOfferAction = async (offerId: string, action: 'accepted' | 'rejected') => {
    try {
      if (action === 'accepted') {
        await acceptOffer({
          id: offerId,
          offer: {} as any // Backend doesn't use this, but API requires it
        }).unwrap();
      } else {
        await rejectOffer({
          id: offerId,
          offer: {} as any // Backend doesn't use this, but API requires it
        }).unwrap();
      }
      refetch();
    } catch (error) {
      console.error(`Failed to ${action} offer:`, error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">Manage your offers and completed transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offers.filter((o: OfferRead) => o.seller?.id === user?.id && o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offers Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offers.filter((o: OfferRead) => o.buyer?.id === user?.id && o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offers.filter((o: OfferRead) => (o.buyer?.id === user?.id || o.seller?.id === user?.id) && o.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'received', label: 'Offers Received', count: offers.filter((o: OfferRead) => o.seller?.id === user?.id).length },
                { key: 'sent', label: 'Offers Sent', count: offers.filter((o: OfferRead) => o.buyer?.id === user?.id && o.status !== 'accepted').length },
                { key: 'completed', label: 'Completed', count: offers.filter((o: OfferRead) => (o.buyer?.id === user?.id || o.seller?.id === user?.id) && o.status === 'accepted').length }
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

          {/* Tab Content */}
          <div className="p-6">
            {filteredOffers.length > 0 ? (
              <div className="space-y-4">
                {filteredOffers.map((offer: OfferRead) => (
                  <div key={offer.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          {/* Listing Image */}
                          <div className="shrink-0">
                            {offer.listing?.primary_image ? (
                              <img
                                src={offer.listing.primary_image}
                                alt={offer.listing.title}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Offer Details */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {offer.listing?.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(offer.status || 'pending')}`}>
                                {getStatusIcon(offer.status || 'pending')}
                                <span className="ml-1 capitalize">{offer.status || 'pending'}</span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span className="font-medium">Offer: ${offer.offer_amount}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-400">Original: ${offer.listing?.price}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTimeAgo(offer.created_at || '')}</span>
                              </div>
                            </div>

                            {offer.message && (
                              <div className="mt-3 p-3 bg-gray-100 rounded-md">
                                <p className="text-sm text-gray-700">"{offer.message}"</p>
                              </div>
                            )}

                            {/* Buyer/Seller Info */}
                            <div className="mt-3 flex items-center text-sm text-gray-600">
                              {activeTab === 'received' ? (
                                <span>From: {offer.buyer?.first_name} {offer.buyer?.last_name}</span>
                              ) : (
                                <span>To: {offer.seller?.first_name} {offer.seller?.last_name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 ml-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/listings/${offer.listing?.id}`)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {activeTab !== 'completed' && (
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          )}

                          {activeTab === 'received' && offer.status === 'pending' && (
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => handleOfferAction(offer.id!, 'accepted')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleOfferAction(offer.id!, 'rejected')}
                                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {activeTab === 'completed' && (
                            <button className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-full">
                              <Star className="h-4 w-4" />
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
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {activeTab === 'received' && 'No offers received'}
                  {activeTab === 'sent' && 'No offers sent'}
                  {activeTab === 'completed' && 'No completed transactions'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'received' && 'Offers on your listings will appear here'}
                  {activeTab === 'sent' && 'Offers you make will appear here'}
                  {activeTab === 'completed' && 'Your completed transactions will appear here'}
                </p>
                {activeTab !== 'completed' && (
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Listings
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