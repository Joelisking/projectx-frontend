'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  DollarSign,
  MapPin,
  Clock,
  Eye,
  Star,
  Flag,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag
} from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useMarketplaceListingsReadQuery,
  useMessagingMessagesCreateMutation,
  useTransactionsOffersCreateMutation
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const currentUser = useSelector(selectUser);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isOfferLoading, setIsOfferLoading] = useState(false);

  const { data: listing, isLoading, error } = useMarketplaceListingsReadQuery({ id: listingId });
  const [sendMessage] = useMessagingMessagesCreateMutation();
  const [makeOffer] = useTransactionsOffersCreateMutation();

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

  const handleNextImage = () => {
    if (listing?.images && listing.images.length > 1) {
      const imagesLength = listing.images.length;
      setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
    }
  };

  const handlePrevImage = () => {
    if (listing?.images && listing.images.length > 1) {
      const imagesLength = listing.images.length;
      setCurrentImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !listing?.seller) return;

    setIsMessageLoading(true);
    try {
      // According to type, seller is a string, but handle both cases defensively
      const sellerId = typeof listing.seller === 'string' 
        ? listing.seller 
        : (listing.seller as { id?: string })?.id;
      
      if (!sellerId) {
        console.error('Unable to determine seller ID');
        setIsMessageLoading(false);
        return;
      }

      await sendMessage({
        messageCreate: {
          receiver_id: sellerId,
          message_text: message.trim(),
        }
      }).unwrap();

      setMessage('');
      setShowContactForm(false);
      // Show success message or redirect to messages
      router.push('/messages');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!offerAmount.trim() || !listing?.id) return;

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsOfferLoading(true);
    try {
      await makeOffer({
        offer: {
          listing_id: listing.id,
          offer_amount: amount.toString(),
          message: offerMessage.trim() || undefined
        }
      }).unwrap();

      setOfferAmount('');
      setOfferMessage('');
      setShowOfferForm(false);
      // Show success message
      alert('Offer submitted successfully!');
    } catch (error) {
      console.error('Failed to make offer:', error);
      alert('Failed to submit offer. Please try again.');
    } finally {
      setIsOfferLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
            <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // According to type, seller is a string (user ID), but handle object case defensively
  const sellerId = typeof listing.seller === 'string' 
    ? listing.seller 
    : (listing.seller as unknown as { id?: string })?.id;
  // If seller is an object (not matching type but API might return it), extract info
  const sellerInfo = typeof listing.seller === 'object' && listing.seller !== null ? listing.seller as { 
    id?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_picture_url?: string;
    average_rating?: string;
    total_reviews?: number;
  } : null;
  
  const isOwner = currentUser?.id === sellerId;
  const images = listing.images || [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <>
                  <Image
                    src={currentImage.image_url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingBag className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square relative rounded-md overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${listing.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-500">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Flag className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-green-600">${listing.price}</span>
                {listing.is_negotiable && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    Negotiable
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(listing.condition)}`}>
                  {formatCondition(listing.condition)}
                </span>
              </div>

              {/* Status */}
              {listing.status && listing.status !== 'active' && (
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.status === 'sold'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {listing.category && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-900 w-20">Category:</span>
                  <span className="text-blue-600">{listing.category.name}</span>
                </div>
              )}

              {listing.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900 w-16">Location:</span>
                  <span className="text-gray-700">{listing.location}</span>
                </div>
              )}

              {listing.campus && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-900 w-20">Campus:</span>
                  <span className="text-gray-700">{listing.campus.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Listed {formatTimeAgo(listing.created_at || '')}</span>
                </div>
                {listing.view_count !== undefined && (
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{listing.view_count} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            {sellerInfo && (
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  {sellerInfo.profile_picture_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={sellerInfo.profile_picture_url}
                        alt={sellerInfo.first_name && sellerInfo.last_name 
                          ? `${sellerInfo.first_name} ${sellerInfo.last_name}` 
                          : sellerInfo.username || 'Seller'}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {sellerInfo.first_name && sellerInfo.last_name
                        ? `${sellerInfo.first_name} ${sellerInfo.last_name}`
                        : sellerInfo.username || 'Seller'}
                    </p>
                    <div className="flex items-center space-x-2">
                      {sellerInfo.average_rating && sellerInfo.total_reviews !== undefined && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {parseFloat(sellerInfo.average_rating).toFixed(1)} ({sellerInfo.total_reviews} {sellerInfo.total_reviews === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && listing.status === 'active' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Make Offer
                  </button>
                </div>

                {/* Contact Form */}
                {showContactForm && (
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-900 mb-3">Send a message</h4>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi! I'm interested in this item..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isMessageLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMessageLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Offer Form */}
                {showOfferForm && (
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-900 mb-3">Make an Offer</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Offer Amount ($)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            placeholder={`Current price: $${listing?.price}`}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message (Optional)
                        </label>
                        <textarea
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          placeholder="Add a message to your offer..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setShowOfferForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleMakeOffer}
                        disabled={!offerAmount.trim() || isOfferLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isOfferLoading ? 'Submitting...' : 'Submit Offer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isOwner && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-800 text-sm">This is your listing</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/listings/${listingId}/edit`)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Edit Listing
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Mark as Sold
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}