'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MessageCircle, Search, User, Clock, ChevronRight } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useMessagingConversationsListQuery,
  ConversationRead
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

export default function MessagesPage() {
  console.log('=== MESSAGES PAGE RENDER ===');

  const router = useRouter();
  const user = useSelector(selectUser);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('User from selector:', user);

  const { data: conversationsData, isLoading, error } = useMessagingConversationsListQuery({});

  console.log('Query result:', { data: conversationsData, isLoading, error });

  const conversations = React.useMemo(() => {
    console.log('Processing conversations data:', conversationsData);

    if (!conversationsData || !conversationsData.results) {
      console.log('No data or no results');
      return [];
    }

    if (!Array.isArray(conversationsData.results)) {
      console.error('Results is not an array!', conversationsData.results);
      return [];
    }

    console.log('Found', conversationsData.results.length, 'conversations');
    return conversationsData.results;
  }, [conversationsData]);

  const filteredConversations = React.useMemo(() => {
    if (!Array.isArray(conversations)) return [];

    if (!searchQuery.trim()) return conversations;

    return conversations.filter(conversation => {
      const lastMessageText = conversation.last_message?.toLowerCase() || '';
      return lastMessageText.includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (conversation: ConversationRead) => {
    const participant1 = conversation.participant_1;
    const participant2 = conversation.participant_2;
    const participant1Id = typeof participant1 === 'object' ? (participant1 as any)?.id : participant1;
    const participant2Id = typeof participant2 === 'object' ? (participant2 as any)?.id : participant2;

    if (participant1Id === user?.id) {
      return typeof participant2 === 'object' ? (participant2 as any) : null;
    } else {
      return typeof participant1 === 'object' ? (participant1 as any) : null;
    }
  };

  // Conversation Item Component
  const ConversationItem = ({ conversation }: { conversation: ConversationRead }) => {
    const otherParticipant = getOtherParticipant(conversation);

    const lastMessage = conversation.last_message;
    const unreadCount = parseInt(conversation.unread_count || '0');

    return (
      <button
        key={conversation.id}
        onClick={() => router.push(`/messages/${conversation.id}`)}
        className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="shrink-0">
              {otherParticipant?.profile_picture_url ? (
                <img
                  src={otherParticipant.profile_picture_url}
                  alt={otherParticipant.first_name && otherParticipant.last_name
                    ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                    : otherParticipant.username || 'User'}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-sm font-medium truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                  {otherParticipant
                    ? otherParticipant.first_name && otherParticipant.last_name
                      ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                      : otherParticipant.username || 'Unknown User'
                    : 'Unknown User'}
                </h3>
                {conversation.last_message_at && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(conversation.last_message_at)}
                  </div>
                )}
              </div>

              {lastMessage ? (
                <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {typeof lastMessage === 'object' && (lastMessage as any).text ? (lastMessage as any).text : typeof lastMessage === 'string' ? lastMessage : 'New message'}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No messages yet</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </button>
    );
  };

  if (isLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering main view with', filteredConversations.length, 'conversations');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Communicate with buyers and sellers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Start a conversation by contacting a seller on their listing'
                }
              </p>
              {!searchQuery && (
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
  );
}
