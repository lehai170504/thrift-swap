'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Sparkles } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { useAuth } from '@/contexts/AuthContext';

export function RecommendedProducts() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: getRecommendations,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null; // Không hiển thị nếu chưa đăng nhập
  }

  if (isLoading) {
    return (
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="w-32 h-6 bg-muted animate-pulse rounded-full mb-4"></div>
              <div className="w-3/4 h-10 bg-muted animate-pulse rounded mb-4"></div>
              <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    );
  }

  if (isError || !data || data.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background border-b border-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" /> Dành riêng cho bạn
            </h2>
            <p className="text-muted-foreground text-lg">
              Dựa trên lịch sử xem hàng, Thriftly AI chọn lọc những món đồ phù hợp nhất với sở thích của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
