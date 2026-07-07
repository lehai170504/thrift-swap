import api from '@/lib/axios';

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeName: string;
  orderId: string;
  productTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

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
