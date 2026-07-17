'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ArrowRight, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { useRef } from 'react';

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts(0, 8),
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

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

  if (isError || !data || data.content.length === 0) return null;

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 px-4 sm:px-0">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Đang hot
            </p>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground tracking-tight mb-4">
              Khám phá phiên đấu giá
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Cơ hội sở hữu những món đồ độc đáo với giá tốt nhất hôm nay.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-4">
              <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full border-border/50 hover:bg-muted/50">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full border-border/50 hover:bg-muted/50">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="rounded-full px-6 hover:bg-muted/50 transition-colors font-medium">
                Xem tất cả <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-12 pt-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.content.map((product: any) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[350px] snap-start shrink-0 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl h-auto">
                <ProductCard product={product} />
              </div>
            ))}
            
            {/* View All Card at the end of slider */}
            <div className="w-[280px] sm:w-[320px] lg:w-[350px] snap-start shrink-0 flex items-center justify-center p-6 pb-0">
              <Link href="/products" className="group flex flex-col items-center justify-center gap-4 w-full h-full min-h-[400px] rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-6 h-6 text-foreground" />
                </div>
                <span className="font-heading font-medium text-lg text-foreground/80">Xem toàn bộ</span>
              </Link>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
          `}} />
        </div>
      </div>
    </section>
  );
}
