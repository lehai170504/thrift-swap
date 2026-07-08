import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllAdminProducts, deleteAdminProduct } from '@/lib/api/admin';

export function useAdminProducts(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'products', page, size, debouncedSearchTerm],
    queryFn: () => getAllAdminProducts(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });
}
