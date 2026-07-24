import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';

export function useAdminUsers(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'users', page, size, debouncedSearchTerm],
    queryFn: () => adminApi.getAllUsers(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useAdjustUserBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; amount: number; reason: string }) =>
      adminApi.adjustUserBalance(data.userId, data.amount, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useUpdateUserTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; tier: string }) =>
      adminApi.updateUserTier(data.userId, data.tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role: string }) =>
      adminApi.updateUserRole(data.userId, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}
