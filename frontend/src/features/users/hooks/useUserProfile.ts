import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import { getProductsBySeller } from '@/lib/api/products';
import { reviewApi } from '@/lib/api/reviews';

export function useUserProfile(username: string) {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => userApi.getUserByUsername(username),
  });

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['sellerProducts', username],
    queryFn: () => getProductsBySeller(username),
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['sellerReviews', username],
    queryFn: () => reviewApi.getReviewsByUser(username),
  });

  return {
    profile,
    isProfileLoading,
    products,
    isProductsLoading,
    reviews,
    isReviewsLoading,
  };
}
