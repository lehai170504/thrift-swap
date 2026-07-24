import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminRevenueStats = () => {
  return useQuery({
    queryKey: ['adminRevenueStats'],
    queryFn: adminApi.getRevenueStats,
  });
};

export const useAdminRevenueTransactions = (page: number, size: number) => {
  return useQuery({
    queryKey: ['adminRevenueTransactions', page, size],
    queryFn: () => adminApi.getRevenueTransactions(page, size),
    placeholderData: keepPreviousData,
  });
};
