import axios from '../axios';

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
    const { data } = await axios.get('/notifications');
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await axios.get('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axios.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axios.post('/notifications/read-all');
  }
};
