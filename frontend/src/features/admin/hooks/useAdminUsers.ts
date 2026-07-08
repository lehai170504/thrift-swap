import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, banUser, unbanUser } from '@/lib/api/admin';

export function useAdminUsers(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'users', page, size, debouncedSearchTerm],
    queryFn: () => getAllUsers(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}
