import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';

export const useMyNotifications = (isAuthenticated: boolean = true) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getMyNotifications,
    enabled: isAuthenticated,
  });
};

export const useUnreadCount = (isAuthenticated: boolean = true) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 30000, // Refetch every 30s as a fallback to websocket
    enabled: isAuthenticated,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};
