import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';

export interface LiveChatMessage {
  liveSessionId: string;
  senderId?: string;
  senderUsername: string;
  senderAvatar?: string;
  content?: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'BID_UPDATE' | 'REACTION';
  timestamp?: string;
  viewerCount?: number;
}

export const useLiveSocket = (liveSessionId: string) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [reactions, setReactions] = useState<{ id: string, emoji: string }[]>([]);

  useEffect(() => {
    if (!liveSessionId) return;

    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081/ws'}/auction/websocket`,
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log('Connected to Live Chat WebSocket!');

      client.subscribe(`/topic/live/${liveSessionId}`, (message) => {
        if (message.body) {
          const chatMsg: LiveChatMessage = JSON.parse(message.body);
          if (chatMsg.type === 'CHAT' || chatMsg.type === 'BID_UPDATE') {
            setMessages((prev) => [...prev, chatMsg]);
          } else if (chatMsg.type === 'REACTION' && chatMsg.content) {
            const reactionId = Date.now().toString() + Math.random().toString();
            setReactions((prev) => [...prev, { id: reactionId, emoji: chatMsg.content! }]);
            // Auto remove reaction after animation completes (e.g. 2s)
            setTimeout(() => {
              setReactions((prev) => prev.filter(r => r.id !== reactionId));
            }, 2000);
          }
          if (chatMsg.viewerCount !== undefined) {
            setViewerCount(chatMsg.viewerCount);
          }
        }
      });

      // Send JOIN message
      let token = '';
      const userStr = Cookies.get('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token;
        } catch (e) { }
      }

      if (token) {
        client.publish({
          destination: `/app/live.chat/${liveSessionId}`,
          body: JSON.stringify({ type: 'JOIN' }),
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        client.publish({
          destination: `/app/live.chat/${liveSessionId}`,
          body: JSON.stringify({ type: 'JOIN' }),
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        // Send LEAVE message
        let token = '';
        const userStr = Cookies.get('user');
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            token = userObj.token;
          } catch (e) { }
        }
        if (client.connected) {
          if (token) {
            client.publish({
              destination: `/app/live.chat/${liveSessionId}`,
              body: JSON.stringify({ type: 'LEAVE' }),
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            client.publish({
              destination: `/app/live.chat/${liveSessionId}`,
              body: JSON.stringify({ type: 'LEAVE' }),
            });
          }
        }
        client.deactivate();
      }
    };
  }, [liveSessionId]);

  const sendMessage = useCallback((content: string) => {
    if (stompClient && stompClient.connected && content.trim()) {
      let token = '';
      const userStr = Cookies.get('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token;
        } catch (e) { }
      }

      const chatMsg = { type: 'CHAT', content };

      stompClient.publish({
        destination: `/app/live.chat/${liveSessionId}`,
        body: JSON.stringify(chatMsg),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    }
  }, [stompClient, liveSessionId]);

  const sendReaction = useCallback((emoji: string) => {
    if (stompClient && stompClient.connected) {
      let token = '';
      const userStr = Cookies.get('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token;
        } catch (e) { }
      }

      const chatMsg = { type: 'REACTION', content: emoji };

      stompClient.publish({
        destination: `/app/live.chat/${liveSessionId}`,
        body: JSON.stringify(chatMsg),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    }
  }, [stompClient, liveSessionId]);

  return { messages, viewerCount, isConnected, sendMessage, sendReaction, reactions };
};
