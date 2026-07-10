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
