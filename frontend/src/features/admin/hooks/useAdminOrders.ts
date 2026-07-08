import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/api/orders';

export function useAdminOrders(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'all-orders', page, size, debouncedSearchTerm],
    queryFn: () => orderApi.getAllOrders(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}
