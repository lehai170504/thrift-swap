import api from '@/lib/axios';
import { PageResponse } from '@/types/pagination';

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl?: string;
  buyerName: string;
  sellerName: string;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELED' | 'DISPUTED';
  trackingCode?: string;
  disputeReason?: string;
  isReviewed?: boolean;
  reviewRating?: number;
  reviewComment?: string;
  createdAt: string;
}

export const orderApi = {
  getMyOrders: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/orders/me?page=${page}&size=${size}`);
    return data;
  },

  createBuyNowOrder: async (productId: string): Promise<Order> => {
    const { data } = await api.post(`/orders/buy-now/${productId}`);
    return data;
  },

  getMySales: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/orders/sales?page=${page}&size=${size}`);
    return data;
  },

  payOrder: async (orderId: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${orderId}/pay`);
    return data;
  },

  confirmReceipt: async (orderId: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${orderId}/confirm-receipt`);
    return data;
  },

  disputeOrder: async (orderId: string, reason: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${orderId}/dispute`, { reason });
    return data;
  },

  shipOrder: async (orderId: string, trackingCode: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${orderId}/ship`, { trackingCode });
    return data;
  },

  endAuction: async (productId: string): Promise<Order> => {
    const { data } = await api.post(`/auctions/${productId}/end`);
    return data;
  },

  getDisputedOrders: async (page = 0, size = 10, search = ''): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/admin/orders/disputed?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
    return data;
  },

  getAllOrders: async (page = 0, size = 20, search = ''): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/admin/orders?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
    return data;
  },

  resolveDispute: async (orderId: string, winner: 'BUYER' | 'SELLER'): Promise<Order> => {
    const { data } = await api.post(`/admin/orders/${orderId}/resolve`, { winner });
    return data;
  },
};
