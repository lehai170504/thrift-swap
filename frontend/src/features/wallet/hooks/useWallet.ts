import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyWallet, deposit, withdraw, WithdrawRequest } from '@/lib/api/wallet';
import { toast } from 'sonner';

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: getMyWallet,
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Nạp tiền thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền');
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Đã gửi yêu cầu rút tiền thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi rút tiền');
    },
  });
};

export const useVNPayPayment = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await import('@/lib/api/wallet').then(m => m.createVNPayPayment(amount));
      return response;
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể tạo link thanh toán');
    },
  });
};
