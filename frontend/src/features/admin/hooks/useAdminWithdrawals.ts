import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';

export function useAdminWithdrawals(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'withdrawals', page, size, debouncedSearchTerm],
    queryFn: () => adminApi.getPendingWithdrawals(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.approveWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    }
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.rejectWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    }
  });
}
