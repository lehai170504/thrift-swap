'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/features/products/api/productsApi';
import { AuctionProductCard } from '@/components/home/AuctionProductCard';
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

  // Filter only auction products
  const auctionProducts = data.content.filter((p: any) => p.sellType === 'AUCTION' && !p.isExpired);

  if (auctionProducts.length === 0) return null;

  return (
    <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-primary/50"></span>
              Phiên đấu giá
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-foreground tracking-tight mb-4">
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
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-12 pt-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {auctionProducts.map((product: any) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[350px] snap-start shrink-0 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl h-auto">
                <AuctionProductCard product={product} />
              </div>
            ))}

            {/* View All Card at the end of slider */}
            <div className="w-[280px] sm:w-[320px] lg:w-[350px] snap-start shrink-0 flex items-center justify-center p-6 pb-0">
              <Link href="/products" className="group flex flex-col items-center justify-center gap-6 w-full h-full min-h-[400px] rounded-[2rem] bg-background border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-2 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <ArrowRight className="w-6 h-6 text-foreground/70 group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <span className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">Xem toàn bộ</span>
              </Link>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
