'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send, User, Paperclip, MoreVertical, AlertTriangle } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useMessagingConversationsReadQuery,
  useMessagingMessagesListQuery,
  useMessagingMessagesCreateMutation,
  useMarketplaceListingsReadQuery,
  useUsersReadQuery
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const user = useSelector(selectUser);

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading: loadingConversation } = useMessagingConversationsReadQuery({
    id: conversationId
  });

  const { data: messagesData, isLoading: loadingMessages, refetch: refetchMessages } = useMessagingMessagesListQuery({
    search: conversationId
  });

  const [sendMessage, { isLoading: isSending }] = useMessagingMessagesCreateMutation();

  const messages = messagesData?.results || [];
  const otherParticipantId = conversation?.participant_1 === user?.id ? conversation?.participant_2 : conversation?.participant_1;

  // Fetch other participant's user data
  const { data: otherParticipant } = useUsersReadQuery(
    { id: otherParticipantId || '' },
    { skip: !otherParticipantId }
  );

  // Get related listing if this conversation is about a specific listing
  const { data: relatedListing } = useMarketplaceListingsReadQuery(
    { id: conversation?.listing || '' },
    { skip: !conversation?.listing }
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      refetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const messageText = message.trim();
    setMessage('');

    try {
      await sendMessage({
        messageCreate: {
          receiver_id: otherParticipantId || '',
          message_text: messageText
        }
      }).unwrap();

      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageText); // Restore message on error
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loadingConversation || loadingMessages) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversation not found</h2>
            <button
              onClick={() => router.push('/messages')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/messages')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              {/* Other participant info */}
              <div className="flex items-center space-x-3">
                {otherParticipant?.profile_picture_url ? (
                  <img
                    src={otherParticipant.profile_picture_url}
                    alt={otherParticipant.first_name && otherParticipant.last_name
                      ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                      : otherParticipant.username || 'User'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {otherParticipant
                      ? otherParticipant.first_name && otherParticipant.last_name
                        ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                        : otherParticipant.username || 'Unknown User'
                      : 'Unknown User'
                    }
                  </h2>
                  {relatedListing && (
                    <p className="text-sm text-gray-600">
                      About: {relatedListing.title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button className="text-gray-600 hover:text-gray-900">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Listing Card */}
      {relatedListing && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                {relatedListing.images?.find(img => img.is_primary)?.image_url ? (
                  <img
                    src={relatedListing.images?.find(img => img.is_primary)?.image_url}
                    alt={relatedListing.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {relatedListing.title}
                </p>
                <p className="text-sm text-blue-700">
                  ${relatedListing.price}
                </p>
              </div>
              <button
                onClick={() => {
                  const listingId = (relatedListing as { id?: string }).id;
                  if (listingId) {
                    router.push(`/listings/${listingId}`);
                  }
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = msg.sender === user?.id;
              const showAvatar = index === 0 || messages[index - 1]?.sender !== msg.sender;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`shrink-0 ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
                      {showAvatar && !isOwnMessage ? (
                        otherParticipant?.profile_picture_url ? (
                          <img
                            src={otherParticipant.profile_picture_url}
                            alt={otherParticipant.first_name && otherParticipant.last_name
                              ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                              : otherParticipant.username || 'User'}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                        )
                      ) : (
                        <div className="h-8 w-8"></div>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.message_text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(msg.created_at || new Date().toISOString())}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="block w-full px-4 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSending}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="shrink-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          {/* Safety Notice */}
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>
              Meet in public places and trust your instincts. Report suspicious behavior.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}