import api from '@/lib/axios';
import { PageResponse } from '@/types/pagination';

export interface AdminTransactionResponse {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  username: string;
  walletId: string;
  createdAt: string;
}

export interface GlobalSearchResult {
  users: { id: string; username: string; email: string; avatar: string | null }[];
  orders: { id: string; productTitle: string; buyerName: string; status: string }[];
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChartDataResponse {
  name: string;
  orders: number;
  revenue: number;
}

export const adminApi = {
  getPendingWithdrawals: async (page = 0, size = 10, search = ''): Promise<PageResponse<AdminTransactionResponse>> => {
    const response = await api.get(`/admin/withdrawals?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
    return response.data;
  },

  approveWithdrawal: async (id: string): Promise<AdminTransactionResponse> => {
    const response = await api.post(`/admin/withdrawals/${id}/approve`);
    return response.data;
  },

  rejectWithdrawal: async (id: string): Promise<AdminTransactionResponse> => {
    const response = await api.post(`/admin/withdrawals/${id}/reject`);
    return response.data;
  },

  globalSearch: async (query: string): Promise<GlobalSearchResult> => {
    const response = await api.get(`/admin/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getAllUsers: async (page = 0, size = 10, search = ''): Promise<PageResponse<UserResponse>> => {
    const response = await api.get(`/users?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
    return response.data;
  },

  banUser: async (id: string): Promise<UserResponse> => {
    const response = await api.post(`/users/${id}/ban`);
    return response.data;
  },

  unbanUser: async (id: string): Promise<UserResponse> => {
    const response = await api.post(`/users/${id}/unban`);
    return response.data;
  },

  getTotalEscrow: async (): Promise<{ totalEscrow: number }> => {
    const response = await api.get('/admin/withdrawals/total-escrow');
    return response.data;
  },

  getChartData: async (): Promise<ChartDataResponse[]> => {
    const response = await api.get('/admin/dashboard/chart');
    return response.data;
  },

  getAllAdminProducts: async (page = 0, size = 10, search = ''): Promise<PageResponse<any>> => {
    const response = await api.get(`/admin/products?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
    return response.data;
  },

  deleteAdminProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};
