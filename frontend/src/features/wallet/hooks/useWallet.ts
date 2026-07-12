import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi, WithdrawRequest } from '../api/walletApi';
import { toast } from 'sonner';

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: walletApi.getMyWallet,
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.deposit,
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
    mutationFn: walletApi.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Đã gửi yêu cầu rút tiền thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi rút tiền');
    },
  });
};

export const usePayOSPayment = () => {
  return useMutation({
    mutationFn: walletApi.createPayOSPayment,
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
