import api from '@/lib/axios';
import { PageResponse } from '@/types/pagination';
import { AdminTransactionResponse, GlobalSearchResult, UserResponse, ChartDataResponse, Voucher, CreateVoucherRequest } from '../types/admin';

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

  updateUserRole: async (userId: string, role: string): Promise<any> => {
    const response = await api.post(`/users/${userId}/role?role=${role}`);
    return response.data;
  },

  getAuditLogs: async (params: string): Promise<any> => {
    const response = await api.get(`/admin/audit-logs?${params}`);
    return response.data;
  },

  getAllPlatformVouchers: async (): Promise<Voucher[]> => {
    const response = await api.get('/admin/vouchers');
    return response.data;
  },

  createPlatformVoucher: async (data: CreateVoucherRequest): Promise<Voucher> => {
    const response = await api.post('/admin/vouchers', data);
    return response.data;
  },

  togglePlatformVoucherStatus: async (id: string): Promise<Voucher> => {
    const response = await api.put(`/admin/vouchers/${id}/toggle-status`);
    return response.data;
  },

  deletePlatformVoucher: async (id: string): Promise<void> => {
    await api.delete(`/admin/vouchers/${id}`);
  },

  forceCancelProduct: async (id: string): Promise<void> => {
    await api.post(`/admin/products/${id}/force-cancel`);
  },

  getSystemConfig: async (): Promise<{ platformFeePercent: number; minWithdrawalAmount: number; isMaintenanceMode: boolean }> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemConfig: async (data: { platformFeePercent: number; minWithdrawalAmount: number; isMaintenanceMode: boolean }): Promise<any> => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  getRevenueStats: async (): Promise<{ totalRevenue: number; totalCommission: number; totalWithdrawalFees: number }> => {
    const response = await api.get('/admin/revenue/stats');
    return response.data;
  },

  getRevenueTransactions: async (page = 0, size = 20): Promise<PageResponse<any>> => {
    const response = await api.get(`/admin/revenue/transactions?page=${page}&size=${size}`);
    return response.data;
  },

  getAllReports: async (page = 0, size = 10): Promise<PageResponse<any>> => {
    const response = await api.get(`/admin/reports?page=${page}&size=${size}`);
    return response.data;
  },

  updateReportStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/reports/${id}/status?status=${status}`);
    return response.data;
  },
};
