import api from '../axios';

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

import { PageResponse } from './orders';

export interface GlobalSearchResult {
  users: { id: string; username: string; email: string; avatar: string | null }[];
  orders: { id: string; productTitle: string; buyerName: string; status: string }[];
}

export const getPendingWithdrawals = async (page = 0, size = 10, search = ''): Promise<PageResponse<AdminTransactionResponse>> => {
  const response = await api.get(`/admin/withdrawals?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
  return response.data;
};

export const approveWithdrawal = async (id: string): Promise<AdminTransactionResponse> => {
  const response = await api.post(`/admin/withdrawals/${id}/approve`);
  return response.data;
};

export const rejectWithdrawal = async (id: string): Promise<AdminTransactionResponse> => {
  const response = await api.post(`/admin/withdrawals/${id}/reject`);
  return response.data;
};

export const globalSearch = async (query: string): Promise<GlobalSearchResult> => {
  const response = await api.get(`/admin/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

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

export const getAllUsers = async (page = 0, size = 10, search = ''): Promise<PageResponse<UserResponse>> => {
  const response = await api.get(`/users?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
  return response.data;
};

export const banUser = async (id: string): Promise<UserResponse> => {
  const response = await api.post(`/users/${id}/ban`);
  return response.data;
};

export const unbanUser = async (id: string): Promise<UserResponse> => {
  const response = await api.post(`/users/${id}/unban`);
  return response.data;
};

export const getTotalEscrow = async (): Promise<{ totalEscrow: number }> => {
  const response = await api.get('/admin/withdrawals/total-escrow');
  return response.data;
};

export interface ChartDataResponse {
  name: string;
  orders: number;
  revenue: number;
}

export const getChartData = async (): Promise<ChartDataResponse[]> => {
  const response = await api.get('/admin/dashboard/chart');
  return response.data;
};

export const getAllAdminProducts = async (page = 0, size = 10, search = ''): Promise<PageResponse<any>> => {
  const response = await api.get(`/admin/products?page=${page}&size=${size}&search=${encodeURIComponent(search)}`);
  return response.data;
};

export const deleteAdminProduct = async (id: string): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

