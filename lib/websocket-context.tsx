'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSelector } from 'react-redux';
import { selectToken } from '@/lib/redux/slices/auth';
import { ReduxState } from '@/lib/redux/store';

interface WebSocketContextType {
    sendMessage: (message: string) => void;
    lastMessage: MessageEvent<any> | null;
    readyState: ReadyState;
    connectToConversation: (conversationId: string) => void;
    disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    // Safe selector that returns undefined if state isn't ready
    const token = useSelector((state: ReduxState) => {
        try {
            return selectToken(state);
        } catch (e) {
            return undefined;
        }
    });

    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure we only run on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        isClient ? socketUrl : null,
        {
            shouldReconnect: () => true,
            reconnectAttempts: 10,
            reconnectInterval: 3000,
            queryParams: token ? { token } : undefined,
            onOpen: () => {
                console.log('✅ WebSocket Connected');
                console.log('WebSocket URL:', socketUrl);
            },
            onClose: (event) => {
                console.log('❌ WebSocket Disconnected', event);
            },
            onError: (event) => {
                console.error('⚠️ WebSocket Error:', event);
            },
            onMessage: (event) => {
                console.log('📨 WebSocket Message received:', event.data);
            },
        },
        isClient // Only enable WebSocket on client side
    );

    // Debug: Log when socketUrl or token changes
    useEffect(() => {
        console.log('WebSocket config changed:', { socketUrl, hasToken: !!token, isClient });
    }, [socketUrl, token, isClient]);

    const connectToConversation = React.useCallback((conversationId: string) => {
        if (!isClient) {
            console.log('Cannot connect: isClient is false');
            return;
        }

        // Assuming backend runs on localhost:8001 (updated port)
        // In production, this should be an environment variable
        const wsProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = 'localhost:8001'; // Updated to match backend port
        const url = `${wsProtocol}//${wsHost}/ws/chat/${conversationId}/`;
        console.log('Setting WebSocket URL:', url);
        console.log('Token available:', !!token);
        setSocketUrl(url);
    }, [isClient, token]);

    const disconnect = React.useCallback(() => {
        console.log('Disconnecting WebSocket');
        setSocketUrl(null);
    }, []);

    return (
        <WebSocketContext.Provider
            value={{
                sendMessage,
                lastMessage,
                readyState,
                connectToConversation,
                disconnect,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};
