import { useQuery } from '@tanstack/react-query';
import { getAllUsers, getPendingWithdrawals, getTotalEscrow, getChartData } from '@/lib/api/admin';
import { orderApi } from '@/lib/api/orders';

export function useAdminDashboard() {
  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users', 'count'],
    queryFn: () => getAllUsers(0, 1)
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin', 'orders', 'count'],
    queryFn: () => orderApi.getAllOrders(0, 1)
  });

  const { data: withdrawalsData } = useQuery({
    queryKey: ['admin', 'withdrawals', 'count'],
    queryFn: () => getPendingWithdrawals(0, 1)
  });

  const { data: escrowData } = useQuery({
    queryKey: ['admin', 'escrow', 'total'],
    queryFn: getTotalEscrow
  });

  const { data: chartDataResponse } = useQuery({
    queryKey: ['admin', 'dashboard', 'chart'],
    queryFn: getChartData
  });

  const totalUsers = (usersData as any)?.totalElements || 0;
  const totalOrders = (ordersData as any)?.totalElements || 0;
  const totalWithdrawals = (withdrawalsData as any)?.totalElements || 0;
  const totalEscrow = escrowData?.totalEscrow || 0;
  const chartData = chartDataResponse || [];

  return {
    totalUsers,
    totalOrders,
    totalWithdrawals,
    totalEscrow,
    chartData,
  };
}
