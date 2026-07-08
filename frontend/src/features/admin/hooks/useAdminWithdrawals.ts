import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } from '@/lib/api/admin';

export function useAdminWithdrawals(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'withdrawals', page, size, debouncedSearchTerm],
    queryFn: () => getPendingWithdrawals(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    }
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    }
  });
}
