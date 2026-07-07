import api from '@/lib/axios';

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  type: 'AUCTION_WON' | 'AUCTION_OUTBID' | 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_SHIPPED' | 'ESCROW_RELEASED' | 'ORDER_DISPUTED' | 'SYSTEM' | 'AUCTION_START';
  relatedEntityId: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },
};
