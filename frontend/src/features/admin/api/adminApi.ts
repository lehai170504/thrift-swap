import api from '@/lib/axios';
import { PageResponse } from '@/types/pagination';
import { AdminTransactionResponse, GlobalSearchResult, UserResponse, ChartDataResponse } from '../types/admin';

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

  getAllCategories: async (): Promise<any[]> => {
    const response = await api.get(`/categories`);
    return response.data;
  },

  createCategory: async (data: { name: string, description?: string, icon?: string, parentId?: string }): Promise<any> => {
    const response = await api.post(`/categories`, data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name: string, description?: string, icon?: string, parentId?: string }): Promise<any> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  adjustUserBalance: async (userId: string, amount: number, reason: string): Promise<any> => {
    const response = await api.post(`/admin/withdrawals/users/${userId}/adjust-balance?amount=${amount}&reason=${encodeURIComponent(reason)}`);
    return response.data;
  },

  updateUserTier: async (userId: string, tier: string): Promise<any> => {
    const response = await api.post(`/users/${userId}/tier?tier=${tier}`);
    return response.data;
  },

  getAuditLogs: async (params: string): Promise<any> => {
    const response = await api.get(`/admin/audit-logs?${params}`);
    return response.data;
  },
};
