import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { orderApi } from '@/features/orders/api/orderApi';

export function useAdminSearch(debouncedQuery: string) {
  return useQuery({
    queryKey: ['admin', 'search', debouncedQuery],
    queryFn: () => adminApi.globalSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });
}

export function useAdminNotifications() {
  const { data: withdrawalsData } = useQuery({
    queryKey: ['admin', 'withdrawals'],
    queryFn: () => adminApi.getPendingWithdrawals(),
    refetchInterval: 30000 // Polling every 30s
  });

  const { data: disputesData } = useQuery({
    queryKey: ['admin', 'disputes'],
    queryFn: () => orderApi.getDisputedOrders(0, 100),
    refetchInterval: 30000
  });

  return { withdrawalsData, disputesData };
}
