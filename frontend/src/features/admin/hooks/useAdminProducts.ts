import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';

export function useAdminProducts(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'products', page, size, debouncedSearchTerm],
    queryFn: () => adminApi.getAllAdminProducts(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });
}

export function useForceCancelAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.forceCancelProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });
}
