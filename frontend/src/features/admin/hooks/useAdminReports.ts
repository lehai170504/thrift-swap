import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminReports = (page: number, size: number) => {
  return useQuery({
    queryKey: ['adminReports', page, size],
    queryFn: () => adminApi.getAllReports(page, size),
    placeholderData: keepPreviousData,
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
  });
};
