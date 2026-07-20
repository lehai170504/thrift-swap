'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { useAuth } from '@/contexts/AuthContext';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export function RecommendedProducts() {
  const { isAuthenticated } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: getRecommendations,
    enabled: isAuthenticated,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mb-12">
            <div className="w-48 h-4 bg-muted animate-pulse rounded-full mb-4"></div>
            <div className="w-64 h-10 bg-muted animate-pulse rounded"></div>
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (isError || !data || data.length === 0) return null;

  return (
    <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-primary/50"></span>
              Gợi ý cho bạn
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
              Gợi ý hôm nay
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full border-border/50 hover:bg-muted/50 hidden sm:flex">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full border-border/50 hover:bg-muted/50 hidden sm:flex">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.map((product) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[350px] snap-start shrink-0 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl h-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
