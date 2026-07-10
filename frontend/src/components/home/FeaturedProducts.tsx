'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/features/products/api/productsApi';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ArrowRight, Flame, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts(0, 8),
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-500">Đang tải sản phẩm nổi bật...</p>
        </div>
      </section>
    );
  }

  if (isError || !data || data.content.length === 0) {
    return null; // Không hiển thị nếu không có dữ liệu
  }

  return (
    <section className="py-24 bg-white border-b border-neutral-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 font-semibold text-sm mb-4">
              <Flame className="w-4 h-4" /> Thị trường sôi động
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight mb-4">
              Khám phá phiên đấu giá <span className="text-primary">&</span> Sản phẩm mới nhất
            </h2>
            <p className="text-neutral-600 text-lg">
              Những món đồ cũ giá trị đang chờ chủ nhân mới. Tham gia ngay để không bỏ lỡ cơ hội sở hữu với giá cực hời!
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-full px-6 h-12 text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all">
              Xem tất cả <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.content.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
