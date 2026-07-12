'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ArrowRight, Flame, Gavel } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts(0, 8),
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-background border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="w-32 h-6 bg-muted animate-pulse rounded-full mb-4"></div>
              <div className="w-3/4 h-10 bg-muted animate-pulse rounded mb-4"></div>
              <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (isError || !data || data.content.length === 0) {
    return null; // Không hiển thị nếu không có dữ liệu
  }

  return (
    <section className="py-24 bg-background border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Flame className="w-4 h-4 animate-pulse" /> BENTO GRID SHOWCASE
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight mb-4">
              Khám phá phiên đấu giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">HOT nhất</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Bộ sưu tập những món đồ có giá trị và lượt quan tâm cao nhất hôm nay. Cơ hội sở hữu hàng độc với giá không tưởng!
            </p>
          </div>
          <Link href="/products">
            <Button className="rounded-full px-8 h-14 text-base font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Khám phá tất cả <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento Box 1: Large Hero Product */}
          {data.content[0] && (
            <Link href={`/products/${data.content[0].id}`} className="lg:col-span-2 group relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl block min-h-[500px] lg:min-h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:from-black"></div>
              <img
                src={data.content[0].imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200&h=800`}
                alt={data.content[0].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200&h=800'; }}
              />

              {/* Top Badges */}
              <div className="absolute top-6 left-6 z-20 flex gap-3">
                {data.content[0].sellType === 'AUCTION' && (
                  <div className="bg-primary/90 text-white backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                    <Gavel className="w-4 h-4" /> Phiên Đấu Giá
                  </div>
                )}
                {(data.content[0] as any).isLive && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> TRỰC TIẾP
                  </div>
                )}
              </div>

              {/* Content Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                  <div className="text-primary font-bold uppercase tracking-widest text-sm mb-3 drop-shadow-md">
                    {data.content[0].categoryName || 'Siêu phẩm'}
                  </div>
                  <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 line-clamp-2 leading-tight drop-shadow-lg group-hover:text-primary transition-colors">
                    {data.content[0].title}
                  </h3>
                  <p className="text-white/70 text-base md:text-lg line-clamp-2 max-w-xl">
                    {data.content[0].description}
                  </p>
                </div>

                <div className="glass bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[24px] flex flex-col items-center justify-center min-w-[200px] shrink-0 group-hover:bg-white/20 transition-colors">
                  <div className="text-white/70 font-bold uppercase tracking-widest text-xs mb-2">
                    {data.content[0].sellType === 'BUY_NOW' ? 'Giá Bán' : 'Giá Tốt Nhất'}
                  </div>
                  <div className="text-3xl font-mono font-black text-white tracking-tighter">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      data.content[0].sellType === 'AUCTION' && data.content[0].currentHighestBid && data.content[0].currentHighestBid > data.content[0].price
                        ? data.content[0].currentHighestBid
                        : data.content[0].price
                    )}
                  </div>
                  <div className="mt-4 w-full h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    Xem Chi Tiết <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Bento Boxes 2 & 3: Stacked Smaller Products */}
          <div className="flex flex-col gap-6">
            {data.content.slice(1, 3).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
