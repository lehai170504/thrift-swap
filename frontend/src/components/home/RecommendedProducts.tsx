'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecommendations, getProducts } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { useAuth } from '@/contexts/AuthContext';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export function RecommendedProducts() {
  const { isAuthenticated } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: recData, isLoading: recLoading } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: getRecommendations,
    enabled: isAuthenticated,
  });

  const { data: fallbackData, isLoading: fallbackLoading } = useQuery({
    queryKey: ['products', 'recommended-fallback'],
    queryFn: () => getProducts(0, 8),
    enabled: !isAuthenticated || !recData || recData.length === 0,
  });

  const products = (recData && recData.length > 0)
    ? recData
    : (fallbackData?.content || []);

  const isLoading = isAuthenticated ? (recLoading && fallbackLoading) : fallbackLoading;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mb-8">
            <div className="w-48 h-4 bg-slate-200 animate-pulse rounded-full mb-4"></div>
            <div className="w-64 h-10 bg-slate-200 animate-pulse rounded"></div>
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-blue-600/50"></span>
              Gợi ý cho bạn
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight font-sans">
              Sản Phẩm Gợi Ý Hôm Nay
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full border-border hover:bg-accent hidden sm:flex">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full border-border hover:bg-accent hidden sm:flex">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4 pt-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[340px] snap-start shrink-0 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
