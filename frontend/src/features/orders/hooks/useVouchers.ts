import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Voucher {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  quantity: number;
  expiryDate: string;
  sellerId?: string;
  isActive: boolean;
}

export const useAvailableVouchers = (sellerId?: string) => {
  return useQuery({
    queryKey: ['vouchers', sellerId],
    queryFn: async () => {
      const { data } = await api.get<Voucher[]>(`/vouchers/available`, {
        params: { sellerId }
      });
      return data;
    },
    enabled: !!sellerId
  });
};

export const useMyVouchers = () => {
  return useQuery({
    queryKey: ['my-vouchers'],
    queryFn: async () => {
      const { data } = await api.get<Voucher[]>('/vouchers/my-vouchers');
      return data;
    }
  });
};

export interface CreateVoucherDTO {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  quantity: number;
  expiryDate: string;
}

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVoucherDTO) => {
      const { data } = await api.post<Voucher>('/vouchers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vouchers'] });
      toast.success('Tạo mã giảm giá thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Có lỗi xảy ra khi tạo mã giảm giá');
    }
  });
};

export const useToggleVoucherStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put<Voucher>(`/vouchers/${id}/toggle-status`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vouchers'] });
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Có lỗi xảy ra khi cập nhật');
    }
  });
};

export interface VoucherUsage {
  id: string;
  username: string;
  email: string;
  orderId: string;
  productTitle: string;
  discountAmount: number;
  usedAt: string;
}

export const useVoucherUsages = (voucherId: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ['voucher-usages', voucherId],
    queryFn: async () => {
      const { data } = await api.get<VoucherUsage[]>(`/vouchers/${voucherId}/usages`);
      return data;
    },
    enabled: isOpen && !!voucherId
  });
};
