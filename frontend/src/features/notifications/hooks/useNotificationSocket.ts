import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/features/notifications/api/notificationApi';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const useNotificationSocket = (isAuthenticated: boolean) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081/ws'}/auction/websocket`,
      beforeConnect: () => {
        const userStr = Cookies.get('user');
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            if (userObj.token) {
              client.connectHeaders = { Authorization: `Bearer ${userObj.token}` };
            }
          } catch (e) { }
        }
      },
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to Notification WebSocket!');

      client.subscribe('/user/queue/notifications', (message) => {
        if (message.body) {
          const notification: Notification = JSON.parse(message.body);

          // Update query data directly for instant UI update
          queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
            if (!old) return [notification];
            // Prevent duplicates if already exists
            if (old.some(n => n.id === notification.id)) return old;
            return [notification, ...old];
          });

          queryClient.setQueryData(['notifications', 'unread-count'], (old: number | undefined) => {
            return (old || 0) + 1;
          });

          // Also invalidate to ensure sync with server eventually
          queryClient.invalidateQueries({ queryKey: ['notifications'] });

          // Show toast notification
          toast(notification.message, {
            icon: '🔔',
            duration: 4000,
          });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Notification Broker reported error: ' + frame.headers['message']);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [isAuthenticated, queryClient]);

  return { stompClient };
};
