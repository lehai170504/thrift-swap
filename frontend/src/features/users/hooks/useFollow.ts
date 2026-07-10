import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const useFollow = (username: string) => {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ['follow-status', username],
    queryFn: async () => {
      const { data } = await axios.get<{ isFollowing: boolean }>(`/follows/${username}/status`);
      return data.isFollowing;
    },
    enabled: !!username,
  });

  const countQuery = useQuery({
    queryKey: ['follower-count', username],
    queryFn: async () => {
      const { data } = await axios.get<{ followerCount: number }>(`/follows/${username}/count`);
      return data.followerCount;
    },
    enabled: !!username,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<{ isFollowing: boolean, followerCount: number, message: string }>(`/follows/${username}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['follow-status', username], data.isFollowing);
      queryClient.setQueryData(['follower-count', username], data.followerCount);
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thực hiện thao tác.');
    },
  });

  const followersQuery = useQuery({
    queryKey: ['followers-list', username],
    queryFn: async () => {
      const { data } = await axios.get<any[]>(`/follows/${username}/followers`);
      return data;
    },
    enabled: !!username,
  });

  return {
    isFollowing: statusQuery.data ?? false,
    followerCount: countQuery.data ?? 0,
    followersList: followersQuery.data ?? [],
    isLoadingStatus: statusQuery.isLoading,
    isLoadingCount: countQuery.isLoading,
    isLoadingFollowers: followersQuery.isLoading,
    toggleFollow: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
};
