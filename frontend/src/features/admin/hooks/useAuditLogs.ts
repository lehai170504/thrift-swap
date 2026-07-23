import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAuditLogs = (page: number, search: string, actionFilter: string, roleFilter: string) => {
  return useQuery({
    queryKey: ['audit-logs', page, search, actionFilter, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: '20',
        ...(search && { search }),
        ...(actionFilter && { action: actionFilter }),
        ...(roleFilter && { actorRole: roleFilter }),
      });
      return await adminApi.getAuditLogs(params.toString());
    },
    placeholderData: (prev) => prev,
  });
};