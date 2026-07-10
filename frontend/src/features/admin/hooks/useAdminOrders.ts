import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderApi } from '@/features/orders/api/orderApi';

export function useAdminOrders(page: number, size: number, debouncedSearchTerm: string) {
  return useQuery({
    queryKey: ['admin', 'all-orders', page, size, debouncedSearchTerm],
    queryFn: () => orderApi.getAllOrders(page, size, debouncedSearchTerm),
    placeholderData: keepPreviousData
  });
}
