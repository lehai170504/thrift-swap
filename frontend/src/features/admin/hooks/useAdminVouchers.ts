import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { Voucher, CreateVoucherRequest } from '../types/admin';

export const useAdminVouchers = () => {
  const queryClient = useQueryClient();

  const getVouchers = useQuery<Voucher[]>({
    queryKey: ['adminVouchers'],
    queryFn: () => adminApi.getAllPlatformVouchers(),
  });

  const createVoucher = useMutation({
    mutationFn: (data: CreateVoucherRequest) => adminApi.createPlatformVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVouchers'] });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => adminApi.togglePlatformVoucherStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVouchers'] });
    },
  });

  const deleteVoucher = useMutation({
    mutationFn: (id: string) => adminApi.deletePlatformVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVouchers'] });
    },
  });

  return {
    vouchers: getVouchers.data || [],
    isLoading: getVouchers.isLoading,
    createVoucher,
    toggleStatus,
    deleteVoucher,
  };
};
