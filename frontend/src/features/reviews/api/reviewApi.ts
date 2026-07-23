import api from '@/lib/axios';
import { ReviewRequest, ReviewResponse } from '../types/review';

export const reviewApi = {
  createReview: async (orderId: string, data: ReviewRequest): Promise<ReviewResponse> => {
    const response = await api.post(`/reviews/order/${orderId}`, data);
    return response.data;
  },

  getReviewsByUser: async (username: string): Promise<ReviewResponse[]> => {
    const response = await api.get(`/reviews/user/${username}`);
    return response.data;
  },
};
