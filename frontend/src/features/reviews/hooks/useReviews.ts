import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, ReviewRequest } from '../api/reviewApi';

export const useUserReviews = (username: string) => {
  return useQuery({
    queryKey: ['reviews', username],
    queryFn: () => reviewApi.getReviewsByUser(username),
    enabled: !!username,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: ReviewRequest }) =>
      reviewApi.createReview(orderId, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries if needed, e.g., the user's reviews
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};
