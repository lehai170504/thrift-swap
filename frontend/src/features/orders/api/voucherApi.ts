import api from '@/lib/axios';
import { Voucher, CreateVoucherDTO, VoucherUsage } from '../types/voucher';

export const voucherApi = {
  getAvailableVouchers: async (sellerId?: string): Promise<Voucher[]> => {
    const { data } = await api.get<Voucher[]>('/vouchers/available', {
      params: { sellerId }
    });
    return data;
  },

  getMyVouchers: async (): Promise<Voucher[]> => {
    const { data } = await api.get<Voucher[]>('/vouchers/my-vouchers');
    return data;
  },

  createVoucher: async (payload: CreateVoucherDTO): Promise<Voucher> => {
    const { data } = await api.post<Voucher>('/vouchers', payload);
    return data;
  },

  toggleVoucherStatus: async (id: string): Promise<Voucher> => {
    const { data } = await api.put<Voucher>(`/vouchers/${id}/toggle-status`);
    return data;
  },

  getVoucherUsages: async (voucherId: string): Promise<VoucherUsage[]> => {
    const { data } = await api.get<VoucherUsage[]>(`/vouchers/${voucherId}/usages`);
    return data;
  }
};