import { useQuery } from '@tanstack/react-query';
import { globalSearch, getPendingWithdrawals } from '@/lib/api/admin';
import { orderApi } from '@/lib/api/orders';

export function useAdminSearch(debouncedQuery: string) {
  return useQuery({
    queryKey: ['admin', 'search', debouncedQuery],
    queryFn: () => globalSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });
}

export function useAdminNotifications() {
  const { data: withdrawalsData } = useQuery({
    queryKey: ['admin', 'withdrawals'],
    queryFn: () => getPendingWithdrawals(),
    refetchInterval: 30000 // Polling every 30s
  });

  const { data: disputesData } = useQuery({
    queryKey: ['admin', 'disputes'],
    queryFn: () => orderApi.getDisputedOrders(0, 100),
    refetchInterval: 30000
  });

  return { withdrawalsData, disputesData };
}
