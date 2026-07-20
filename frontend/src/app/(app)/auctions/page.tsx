'use client';

import { useSearchProducts } from '@/features/products/hooks/useProducts';
import { useActiveLiveAuctions } from '@/features/live/hooks/useLive';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { Gavel } from 'lucide-react';
import { useMemo } from 'react';

export default function AuctionsPage() {
  const { data: productsPage, isLoading } = useSearchProducts({
    sellType: 'AUCTION',
    sortBy: 'createdAt',
    direction: 'desc',
    size: 20,
  });

  const { data: activeLiveSessions } = useActiveLiveAuctions();

  const productsWithLiveStatus = useMemo(() => {
    if (!productsPage?.content) return [];
    return productsPage.content.map(product => ({
      ...product,
      isLive: activeLiveSessions?.some(session => session.productId === product.id) || false
    }));
  }, [productsPage?.content, activeLiveSessions]);

  // Sắp xếp ưu tiên các phòng đang LIVE lên đầu
  const sortedProducts = useMemo(() => {
    return [...productsWithLiveStatus].sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });
  }, [productsWithLiveStatus]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-[24px] flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground">
                Sàn Đấu Giá
              </h1>
              <p className="text-lg text-muted-foreground mt-2">Nơi săn những món đồ độc lạ với mức giá do bạn quyết định.</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-background/50 rounded-[24px] glass border border-border shadow-lg">
            <Gavel className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Chưa có phiên đấu giá nào</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Hiện tại không có sản phẩm nào đang được đấu giá. Hãy quay lại sau nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
