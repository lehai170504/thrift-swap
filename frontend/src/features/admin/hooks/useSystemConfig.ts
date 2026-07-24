import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useSystemConfig = () => {
  const queryClient = useQueryClient();

  const getConfig = useQuery({
    queryKey: ['systemConfig'],
    queryFn: adminApi.getSystemConfig,
  });

  const updateConfig = useMutation({
    mutationFn: adminApi.updateSystemConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
    },
  });

  return {
    config: getConfig.data,
    isLoading: getConfig.isLoading,
    updateConfig,
  };
};
